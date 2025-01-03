require("dotenv").config(); // Load the .env file
const setupLogging = require("./controllers/debugging.js"); // Import the setupLogging
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");
const userRouter = require("./routes/user.js");
const fbRouter = require("./routes/foodBank.js");
const { isLoggedIn } = require("./utils/Middlewares.js");
// const cron = require("node-cron");
const markExpiredProducts = require("./utils/updateExpired.js");

// // FROM HERE
// const store = MongoStore.create({
// 	mongoUrl: Mongo_url,
// 	crypto: {
// 		secret: process.env.SESSION_SECRET_KEY,
// 	},
// 	touchAfter: 24 * 60 * 60,
// });

// store.on("error", () => {
// 	console.log("Mongo store Error", err);
// }); // TO HERE comment this while working on local machine
// Call the function to configure logging
setupLogging(); //call the function
const sessionOptions = {
	// store, // comment this line for hosting from the local machine
	// secret: process.env.SESSION_SECRET_KEY,
	secret: "change_while_deployment",
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
		maxAge: 3 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	},
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
	.then(() => {
		console.log("Mongo DB Connection Successful");
	})
	.catch((err) => console.log(err + "error connecting to mongo db server"));

// cron.schedule("*/2 * * * *", async () => {
// 	console.log("Running daily expiration check...");
// 	await markExpiredProducts();
// });

async function main() {
	const mongo_url = process.env.MONGO_URL;
	await mongoose.connect(mongo_url);
}
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currentUser = req.user;
	next();
});

//home route
app.get("/", (req, res) => {
	if (req.user) {
		return res.redirect("/dashboard");
	}
	res.render("elements/index.ejs");
});
app.use("/", userRouter);
app.use("/", fbRouter);

//error handlings
app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
	let { statusCode = 500, message = "Something Went Wrong!" } = err;
	res.status(statusCode).render("ErrorPage/Error.ejs", { message, statusCode });
});

app.listen(port, "0.0.0.0", () => {
	console.log("MealBridge Listening {Port: 8080}");
});
