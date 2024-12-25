const setupLogging = () => {
	if (process.env.NODE_ENV === "production") {
		console.log = () => {}; // Disable logging in production
	} else if (
		process.env.NODE_ENV === "development" &&
		process.env.DISABLE_LOGS === "true"
	) {
		console.log = () => {}; // Disable logging in local development if DISABLE_LOGS is true
	} else {
		console.log = (...args) => {
			// Enable logging in local development by default
			// Optionally, you can prepend a prefix to each log statement for clarity
			console.info("[DEV LOG]", ...args);
		};
	}
};

module.exports = setupLogging;
