'use strict';

const path = require('path');
const execSync = require('child_process').execSync;
const fs = require('fs');

module.exports = {
	// Validates a JSON object
	publish(opts) {
		// Set defaults
		const defaults = {
			sqlclPath: 'sql',
			destination: 'application'
		};
		opts = Object.assign(defaults, opts);

		// Validate arguments
		if (typeof opts.connectString === 'undefined') {
			throw new TypeError('connectString is required.');
		}

		if (typeof opts.directory === 'undefined') {
			throw new TypeError('directory is a required argument.');
		}

		if (typeof opts.appID === 'undefined') {
			throw new TypeError('appID is a required argument.');
		}

		if (opts.destination.toLowerCase() === 'plugin' && typeof opts.pluginName === 'undefined') {
			throw new Error('pluginName is a required argument.');
		}

		if (!fs.existsSync(opts.directory)) {
			throw new Error(`Directory ${opts.directory} is not a valid path.`);
		}

		// Execute the upload process
		try {
			switch (opts.destination.toLowerCase()) {
				case 'theme':
					console.log(`Uploading to ${opts.appID} - Theme Files...`);
					break;
				case 'workspace':
					console.log(`Uploading to ${opts.appID} - Workspace Files...`);
					break;
				case 'plugin':
					console.log(`Uploading to ${opts.appID} - ${opts.pluginName} - Plugin Files...`);
					break;
				default:
					console.log(`Uploading to ${opts.appID} - Application Static Files...`);
			}

			const childProcess = execSync(
				'"' + opts.sqlclPath + '"' + // Sqlcl path
				' ' + opts.connectString + // Connect string (user/pass@server:port/sid)
				' @"' + path.resolve(__dirname, 'lib/script') + '"' + // Sql to execute
				' "' + path.resolve(__dirname, 'lib/distUpload.js') + '"' + // Param &1 (js to execute)
				' "' + path.resolve(opts.directory) + '"' + // Param &2
				' ' + opts.appID + // Param &3
				' "' + opts.destination + '"' + // Param &4
				' "' + opts.pluginName + '"' // Param &5
				, {
					encoding: 'utf8'
				}
			);

			console.log(childProcess);

			console.log('Files were uploaded successfully.');

			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}
};
