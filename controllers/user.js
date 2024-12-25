const User = require("../models/user.js");
if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}

module.exports.signUpFormRender = async (req, res) => {
	res.render("users/signup.ejs");
	console.log("signup form rendered successfully");
};

module.exports.signUp = async (req, res, next) => {
	try {
		let { name, password, username, email, phoneNo } = req.body;
		let newUser = new User({ name, email, username, phoneNo });
		console.log("User model instance created   successfull");
		let registedUser = await User.register(newUser, password);
		console.log("registration   successfull");
		req.login(registedUser, (err) => {
			if (err) {
				console.log("error occured while registering");
				return next(err);
			}
			req.flash("success", `Hi ${username} , Welcome To MealBridge!`);
			res.redirect("/dashboard");
		});
	} catch (err) {
		req.flash("error", err.message);
		res.redirect("/signup");
	}
};

module.exports.loginFormRender = async (req, res) => {
	res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
	let { username } = req.body;
	let redirectUrl = res.locals.redirectUrl || "/dashboard";
	req.flash("success", `Hello ${username}, Welcome Back To MealBridge!`);
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
	req.logOut((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success", "Logged Out Succesfully!");
		res.redirect("/");
	});
};

module.exports.adminLogin = (req, res) => {
	let { password, fbID } = req.body;
	// console.log(password, " ", process.env.ADMIN_PASSWORD);
	if (password == process.env.ADMIN_PASSWORD) {
		req.flash("success", "Admin LoggedIn Succesfully!");
		res.redirect(`/foodbank?foodbank=${fbID}`);
	} else {
		req.flash("error", "Wrong Admin Password");
		res.redirect("/dashboard");
	}
};
