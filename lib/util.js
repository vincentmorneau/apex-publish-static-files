'use strict';

module.exports = {
	// Returns the application ID of an APEX URL
	getAppID(appURL) {
		const parameterString = appURL.slice(appURL.indexOf('f?p=') + 4).split(':');
		return parameterString[0];
	}
};
