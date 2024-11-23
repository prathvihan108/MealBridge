const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");

const mongo_url = "mongodb://127.0.0.1:27017/MealBridge";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

main()
	.then(() => {
		console.log("Mongo DB Connection Successful");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect(mongo_url);
}

//home route
app.get("/", (req, res) => {
	res.render("index.ejs");
});

//donate route
app.get("/donate", (req, res) => {
	res.send("donate page");
});

//dashboard route
app.get("/dashboard", (req, res) => {
	res.render("dashboard.ejs");
});

//food bank
app.get("/foodbank", (req, res) => {
	res.send("food bank page");
});

//expired food page link
app.get("/expired", (req, res) => {
	res.send("expired food page");
});

//one more link
app.get("/one_more", (req, res) => {
	res.send("one more link");
});

app.listen(8080,'0.0.0.0',() => {
	console.log("ComfortNest Listening {Port: 8080}");
});
