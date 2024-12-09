const Product = require("../models/product.js");
const FoodBank = require("../models/foodBank.js");
const Package = require("../models/package.js");
const product = require("../models/product.js");
const transporter = require("../utils/emailConfig.js");
const ejs = require("ejs");
const path = require("path");

module.exports.fbPage = (req, res) => {
	res.render("elements/fb.ejs");
};

module.exports.fbInfo = async (req, res) => {
	let fb = new FoodBank(req.body.foodBank);
	await fb.save();
	req.flash("success", "New foodBank Succesfully Created");
	res.redirect("/dashboard");
};

module.exports.donatePage = (req, res, next) => {
	res.render("elements/donar.ejs");
};

module.exports.donateInfo = async (req, res, next) => {
	try {
		const { products, latitude, longitude } = req.body;
		const coordinates = [Number(longitude), Number(latitude)];
		// console.log(coordinates);
		const parsedProducts =
			typeof products === "string" ? JSON.parse(products) : products;

		const createdProducts = await Product.insertMany(
			parsedProducts.map((product) => ({
				itemName: product.itemName,
				quantity: product.quantity,
				expireDate: product.expireDate,
				hours: product.hours,
				minutes: product.minutes,
			}))
		);

		const productIds = createdProducts.map((product) => product._id);
		const geometry = { coordinates, type: "Point" };
		const newPackage = new Package({ donar: req.user._id, geometry });
		newPackage.products.push(...productIds);
		await newPackage.save();

		req.flash("success", "Products added successfully!");
		res.redirect("/dashboard"); // Redirect to another page
	} catch (err) {
		next(err);
	}
};

module.exports.inventory = async (req, res) => {
	const foodBank = req.query.foodbank || null;
	const packages = await Package.find({})
		.populate({ path: "products" })
		.populate({ path: "donar" });
	res.render("elements/inventory.ejs", { packages, foodBank });
};

module.exports.dashboard = async (req, res) => {
	const foodbanks = await FoodBank.find({});
	res.render("elements/dashboard.ejs", { foodbanks });
};

module.exports.recievePage = async (req, res) => {
	const packages = await Package.find({})
		.populate({ path: "products" })
		.populate({ path: "donar" });
	res.render("elements/recieve.ejs", { packages });
};

module.exports.fertilizerPage = async (req, res) => {
	const foodbanks = await FoodBank.find({})
		.populate({ path: "products" })
		.populate({ path: "donar" });
	res.render("elements/fertilizer.ejs", { foodbanks });
};

module.exports.acceptDonation = async (req, res, next) => {
	try {
		let { id } = req.params;
		let { foodBank } = req.body;
		const package = await Package.findByIdAndDelete(id)
			.populate({ path: "donar" })
			.populate({ path: "products" });
		const result = await Product.deleteMany({
			_id: { $in: package.products },
		});
		if (!package) {
			return req.flash("error", "no foodbank found");
		}
		const donarTemplatePath = path.join(
			__dirname,
			"..",
			"views",
			"emails",
			"donation-email.ejs"
		);
		const recieverTemplatePath = path.join(
			__dirname,
			"..",
			"views",
			"emails",
			"recieve-email.ejs"
		);
		if (foodBank) {
			const donarEmail = await ejs.renderFile(donarTemplatePath, {
				AcceptedBy: foodBank,
				individualName: package.donar.name,
				products: package.products,
				senderEmail: process.env.EMAIL_USER,
			});
			const mailOptions = {
				from: `MealBridge Support <${process.env.EMAIL_USER}>`,
				to: package.donar.email,
				subject: "Donation Accepted",
				html: donarEmail,
			};
			try {
				await transporter.sendMail(mailOptions);
			} catch (error) {
				return next(error);
			}
		} else {
			const recieverEmail = await ejs.renderFile(recieverTemplatePath, {
				reciverName: req.user.name,
				package: package,
				senderEmail: process.env.EMAIL_USER,
			});
			const recieveMailOptions = {
				from: `MealBridge Support <${process.env.EMAIL_USER}>`,
				to: package.donar.email,
				subject: "Thank You Accepting!",
				html: recieverEmail,
			};
			try {
				await transporter.sendMail(recieveMailOptions);
			} catch (error) {
				return next(error);
			}
			const donarEmail = await ejs.renderFile(donarTemplatePath, {
				AcceptedBy: req.user.name,
				individualName: package.donar.name,
				products: package.products,
				senderEmail: process.env.EMAIL_USER,
			});
			const donarMailOptions = {
				from: `MealBridge Support <${process.env.EMAIL_USER}>`,
				to: package.donar.email,
				subject: "Donation Accepted",
				html: donarEmail,
			};
			try {
				await transporter.sendMail(donarMailOptions);
			} catch (error) {
				return next(error);
			}
		}
		req.flash("success", "ThankYou for receving !");
		res.redirect("/dashboard");
	} catch (err) {
		next(err);
	}
};
