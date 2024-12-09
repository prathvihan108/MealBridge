const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
	itemName: String,
	quantity: String,
	exprireDate: {
		type: Date,
		default: () => {
			const date = new Date();
			date.setDate(date.getDate() + 7);
			return date;
		},
	},
	hours: {
		type: Number,
	},
	minutes: { type: Number },
	expired: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Product", productSchema);
