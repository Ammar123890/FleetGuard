const userModel = require('../Models/user');
const adminModel = require('../Models/Admin/admin');
const customerModel = require('../Models/Customer/customer');


const { SignupSchema, LoginSchema, CustomerSchema } = require('../Schemas/auth');

const generateToken = require('../Utils/generateToken');
const generateOTP = require('../Utils/generateOTP');
const sendEmail = require('../Utils/generateMail');

const dayjs = require('dayjs');
const bcrypt = require('bcryptjs');

//Helper Functions

const {
    Types: { ObjectId },
} = require('mongoose');


/**
 * @description To register a new User
 * @route POST /api/auth/register
 * @route POST /api/auth/admin/register
 * @access Public
 */

module.exports.register = async (req, res) => {
    try {
        // Validate the request body
        const { error } = SignupSchema(req.body);
        if (error)
            return res.status(400).json({ msg: error.details[0].message });

        var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var email = req.body.email;
        if (!email.match(mailFormat))
            return res.status(400).json({ msg: "Invalid Email" });

        // Check if user already exists
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(req.body.password, salt);

        // Create a base user object
        let userObject = {
            email: req.body.email,
            password: passwordHash,
            userType: req.body.userType,
        };

        // Modify object based on user type
        if (req.body.userType === 'admin') {
            // Set isVerified to true for admin
            userObject.isVerified = true;

        } else {
            // Generate and add OTP for non-admin users
            const otp = generateOTP.generateCode();
            userObject.verificationCode = otp;
            userObject.otpLastSentTime = dayjs().valueOf();

            // Send the OTP to the email
            await sendEmail.sendVerificationEmail(email, otp);
        }

        // Create and save the new user
        const newUser = new userModel(userObject);
        const savedUser = await newUser.save();
        res.status(200).json({
            msg: "User registered",
            id: savedUser._id,
            status: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}


/**
 * @description To verify the email of a user
 * @route POST /api/auth/verify
 * @access Public
 */

module.exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    // Edge cases and errors
    if (!email || !otp) {
        return res.status(400).json({ errors: { msg: "Email and OTP are required", status: false } });
    }

    try {
        // Find User
        const user = await userModel.findOne({ email }).select("+verificationCode +otpLastSentTime");
        if (!user) {
            return res.status(400).json({ errors: { msg: "User not found", status: false } });
        }

        // Check if OTP is expired (5 minutes = 300000 milliseconds)
        const otpValidDuration = 300000; // 5 minutes in milliseconds
        const currentTime = dayjs();
        const otpSentTime = dayjs(user.otpLastSentTime);
        const timeElapsed = currentTime.diff(otpSentTime);
        if (timeElapsed > otpValidDuration || user.verificationCode == null) {
            return res.status(400).json({ errors: { msg: "OTP is expired or used", status: false } });
        }

        // Check if OTP is correct
        if (otp !== user.verificationCode) {
            return res.status(400).json({ errors: { msg: "OTP is incorrect", status: false } });
        }

        // Update user as verified
        await userModel.updateOne({ _id: user._id }, { verificationCode: null, otpLastSentTime: null, isVerified: true });

        // Generate Token
        
        const token = generateToken(user._id);
        res.status(200).json({
            msg: "Account verified",
            status: true,
            token: token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ errors: error });
    }
};



/**
 * @description To resend the OTP to the email of a user if the OTP is expired
 * @route POST /api/auth/resend
 * @access Public
 */

module.exports.resendOTP = async (req, res) => {
    const { email } = req.body;

    //Edge cases and errors
    if (!email) {
        return res
            .status(400)
            .json({ errors: { msg: "Email is required", status: false } });
    }

    try {
        //Find User
        const user = await userModel
            .findOne({ email })
            .select("+verificationCode +otpLastSentTime");

        if (!user) {
            return res
                .status(400)
                .json({ errors: { msg: "User not found", status: false } });
        }

        //Edge cases and errors
        if (
            dayjs().diff(dayjs(user.otpLastSentTime)) < 300000 &&
            user.verificationCode != null &&
            user.otpLastSentTime != null
        ) {
            return res.status(400).json({
                errors: { msg: "OTP is not expired", status: false },
            });
        }

        //Generate OTP
        const otp = generateOTP.generateCode();
        await userModel.updateOne(
            { _id: user._id },
            { verificationCode: otp, otpLastSentTime: dayjs().valueOf() }
        );

        //Send OTP
        await sendEmail.sendVerificationEmail(email, otp);

        return res.status(200).json({
            msg: "OTP sent",
            status: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description To login a customer
 * @route POST /api/auth/customer/login
 * @route POST /api/auth/admin/login
 * @access Public
 */

module.exports.login = async (req, res) => {
    try {
        // Validate the request body
        const { error } = LoginSchema(req.body);
        if (error)
            return res.status(400).json({ msg: error.details[0].message });
        const email = req.body.email;

        // Check if customer exists
        const existingUser = await userModel.findOne({ email }).select("+password");
        if (!existingUser)
            return res.status(401).json({ msg: "Wrong email or password" });
        // Check if password is correct
        const passwordCorrect = await bcrypt.compare(req.body.password, existingUser.password);
        if (!passwordCorrect)
            return res.status(401).json({ msg: "Wrong email or password" });

        // check if the customer is verified
        if (!existingUser.isVerified)
            return res.status(401).json({ msg: "Customer not verified" });

        // Sign the token
        const token = generateToken(existingUser._id);



        res.status(200).json({
            msg: "Logged in",
            type: existingUser.userType,
            status: true,
            token: token
        });

        // Send the token in cookie
        // res.cookie("token", token, {
        //     httpOnly: true,
        //  //   secure: true,
        //     sameSite: "none",
            
        // })
        //     .status(200)
        //     .json({
        //         msg: "Logged in",
        //         type: existingUser.userType,
        //         status: true
        //     });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * @description To logout a user
 * @route GET /api/auth/logout
 * @access Private
 */


/**
 * @description To add the admin role
 * @route POST /api/auth/admin/addrole
 * @access Private
 */

module.exports.addAdminRole = async (req, res) => {
    const { role, email } = req.body;

    if (!role || !email) {
        return res.status(400).json({
            message: "Role and email are required to add an admin role."
        });
    }

    try {
        // Create and save the new admin role
        const admin = new adminModel({ role });
        const savedAdmin = await admin.save();

        // Find the user by email and update with the new admin role
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found with the provided email."
            });
        }

        user.user = savedAdmin._id; // Set the user's role to the new admin role
        await user.save();

        res.status(200).json({
            message: "Admin role added successfully.",
            adminId: savedAdmin._id,
        });
    } catch (error) {
        // Log the error internally
        console.error("Failed to add admin role:", error);

        // Respond with a user-friendly message
        res.status(500).json({
            message: "An error occurred while adding the admin role. Please try again."
        });
    }
};


/**
 * @description To add the customer details
 * @route POST /api/auth/customer/adddetails
 * @access Private
 */


module.exports.addCustomerDetails = async (req, res) => {
    try {
        // Validate the request body
        const { error } = CustomerSchema(req.body);
        if (error)
            return res.status(400).json({ msg: error.details[0].message });

        // Create and save the new customer details
        const customer = new customerModel(req.body);
        const savedCustomer = await customer.save();

        req.user.user = savedCustomer._id; // Set the user's details to the new customer details
        await req.user.save();

        res.status(200).json({
            message: "Customer details added successfully.",
            userId: req.user._id,
        });
    } catch (error) {
        // Log the error internally
        console.error("Failed to add customer details:", error);

        // Respond with a user-friendly message
        res.status(500).json({
            message: "An error occurred while adding the customer details. Please try again."
        });
    }
};

/**
 * @description To get the customer details
 * @route GET /api/auth/customer/getdetails
 * @access Private
 */

module.exports.getCustomerDetails = async (req, res) => {
    try {
        const customer = await customerModel.findById(req.user.user);
        res.status(200).json({
            data: customer,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description To edit the customer details
 * @route PUT /api/auth/customer/editdetails
 * @access Private
 */

module.exports.editCustomerDetails = async (req, res) => {
    try {
        const customer = await customerModel.findById(req.user.user);
        if (!customer) {
            return res.status(400).json({
                message: "Customer not found"
            });
        }
        await customerModel.updateOne({ _id: customer._id }, req.body);
        return res.status(200).json({
            message: "Customer details updated successfully."
        });
    } catch (error) {
        console.error("Failed to edit customer details:", error);
        return res.status(500).json({
            message: "An error occurred while editing the customer details. Please try again."
        });
    }
}

