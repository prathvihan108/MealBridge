const mongoose = require("mongoose");
const Product = require("../models/product.js"); // Adjust the path to your Product schema
const Package = require("../models/package.js");

async function markExpiredProducts() {
	try {
		const products = await Product.find({ expired: false });
		const now = new Date();

		// Iterate through each product to calculate and update `timeLeft`
		for (const product of products) {
			const timeDifference = product.expireDate - now; // Calculate time left in milliseconds
			if (timeDifference > 0) {
				const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60));
				const minutesLeft = Math.floor(
					(timeDifference % (1000 * 60 * 60)) / (1000 * 60)
				);
				const timeLeft = { hours: hoursLeft, minutes: minutesLeft };
				product.timeLeft = timeLeft;
				await product.save(); // Save the updated product
			} else {
				// If the product is expired, set `expired` to true and update `timeLeft` to 0
				product.expired = true;
				const timeLeft = { hours: 0, minutes: 0 };
				product.timeLeft = timeLeft;
				await product.save();
			}
		}
		// const result = await Product.updateMany(
		// 	{ expireDate: { $lt: now }, expired: false },
		// 	{ $set: { expired: true } }
		// );
		// console.log(`${result.modifiedCount} products marked as expired.`);
		return; //result
	} catch (err) {
		console.error("Error marking expired products:", err);
		throw err;
	}
}

module.exports = markExpiredProducts;
