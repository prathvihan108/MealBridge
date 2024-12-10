const express = require("express");
const router = express.Router();
const AsyncWrap = require("../utils/AsyncWrap.js");
const passport = require("passport");
const fbController = require("../controllers/foodBank.js");
const { isLoggedIn } = require("../utils/Middlewares.js");

router
	.route("/fb")
	.get(isLoggedIn, fbController.fbPage)
	.post(AsyncWrap(fbController.fbInfo));

router
	.route("/donate")
	.get(isLoggedIn, fbController.donatePage)
	.post(AsyncWrap(fbController.donateInfo));

router.route("/foodbank").get(isLoggedIn, fbController.inventory);

router.route("/dashboard").get(isLoggedIn, fbController.dashboard);

router.route("/recieve").get(isLoggedIn, fbController.recievePage);

router
	.route("/manures")
	.get(isLoggedIn, fbController.fertilizerPage)
	.post(fbController.recieveManure);

router.route("/foodbank/:id").delete(isLoggedIn, fbController.acceptDonation);

module.exports = router;
