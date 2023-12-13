const userModel = require("../Models/user");
const jwt = require("jsonwebtoken");
const adminModel = require("../Models/Admin/admin");

module.exports.adminMiddleware = async (req, res, next) => {
    try {
        let token;
        if (

            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            try {
                token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.verify(token.trim(), process.env.SECRET);
                req.user = await userModel.findById(decoded.id).select("-password");
                if (req.user.userType !== 'admin') {
                    return res.status(403).json({ message: 'Access denied' });
                }
                else {
                    //check if admin role is admin 
                    const admin = await adminModel.findById(req.user.user);
                    if (admin.role !== 'admin') {
                        return res.status(403).json({ message: 'Access denied' });
                    }
                }
                next();
            } catch (error) {
                console.error(error);
                res.status(401).send("Not authorized, token failed");
            }
        }
        if (!token) {
            res.status(401).send("Not authorized, no token");
        }
    } catch (error) {
        console.error("Error verifying admin token:", error);
        res.status(401).json({ message: "Authentication failed." });
    }
}
module.exports.customerMiddleware = async (req, res, next) => {
    try {
        let token;
        if (

            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            try {
                token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.verify(token.trim(), process.env.SECRET);
                req.user = await userModel.findById(decoded.id).select("-password");
                if (req.user.userType !== 'customer') {
                    return res.status(403).json({ message: 'Access denied' });
                }
                next();
            } catch (error) {
                console.error(error);
                res.status(401).send("Not authorized, token failed");
            }
        }
        if (!token) {
            res.status(401).send("Not authorized, no token");
        }
    } catch (error) {
        console.error("Error verifying admin token:", error);
        res.status(401).json({ message: "Authentication failed." });
    }
}

