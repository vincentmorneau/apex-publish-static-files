module.exports = {
	// Returns the application ID of an APEX URL
	getAppID(appURL) {
		const paramString = appURL.substring(appURL.indexOf('f?p=') + 4).split(':');
		return paramString[0];
	}
};
