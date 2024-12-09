const nodemailer = require("nodemailer");
if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER, // Email from .env
		pass: process.env.EMAIL_PASS, // Password or app-specific password
	},
});

transporter.verify((error, success) => {
	if (error) {
		console.error("Error configuring email transporter:", error);
	} else {
		console.log("Email transporter is ready to send emails.");
	}
});

module.exports = transporter;
