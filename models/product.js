const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
	itemName: String,
	quantity: String,
	expireDate: {
		type: Date,
		default: () => {
			const date = new Date();
			date.setDate(date.getDate() + 7);
			return date;
		},
	},
	expired: {
		type: Boolean,
		default: false,
	},
	timeLeft: {
		hours: Number,
		minutes: Number,
	},
});

module.exports = mongoose.model("Product", productSchema);
