const { Resend } = require("resend");

//Init Resend
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports.sendVerificationEmail = async (email, code) => {
  try {
    const data = await resend.emails.send({
      from: "fleetguard@skillsplash.org",
      to: email,
      subject: "Verify Your Account",
      html: `<p>Thank you for choosing. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p> <h1>${code}</h1>`,
    });

    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
