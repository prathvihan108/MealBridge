const User = require("../models/user.js");
if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}

module.exports.signUpFormRender = async (req, res) => {
	res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res, next) => {
	try {
		let { name, password, username, email, phoneNo } = req.body;
		let newUser = new User({ name, email, username, phoneNo });
		let registedUser = await User.register(newUser, password);
		req.login(registedUser, (err) => {
			if (err) {
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
	let { password, foodbank } = req.body;
	// console.log(password, " ", process.env.ADMIN_PASSWORD);
	if (password == process.env.ADMIN_PASSWORD) {
		req.flash("success", "Admin LoggedIn Succesfully!");
		res.redirect(`/foodbank?foodbank=${foodbank}`);
	} else {
		req.flash("error", "Wrong Admin Password");
		res.redirect("/dashboard");
	}
};
