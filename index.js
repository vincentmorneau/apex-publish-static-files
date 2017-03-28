'use strict';

const path = require('path');
const execSync = require('child_process').execSync;
const fs = require('fs');

const objectAssign = require('object-assign');

const validate = function (opts) {
	let exit = false;

	if (opts.connectString === undefined) {
		console.trace('connectString\' is a required argument.');
		exit = true;
	}

	if (opts.directory === undefined) {
		console.trace('directory\' is a required argument.');
		exit = true;
	}

	if (!fs.existsSync(opts.directory)) {
		console.trace(`Directory ${opts.directory} is not a valid path.`);
		exit = true;
	}

	if (opts.appID === undefined) {
		console.trace('appID\' is a required argument.');
		exit = true;
	}

	if (exit) {
		throw new Error();
	}

	return opts;
};

module.exports = {
	// Validates a JSON object
	publish(opts) {
		// Set defaults
		opts = objectAssign({
			sqlclPath: 'sql',
			filesDirectory: 'application'
		}, opts);

		// Validate the options
		opts = validate(opts);

		// Execute the upload process
		try {
			if (opts.filesDirectory.toLowerCase() === 'theme') {
				console.log(`Uploading to ${opts.appID} - Theme Files...`);
			} else if (opts.filesDirectory.toLowerCase() === 'workspace') {
				console.log(`Uploading to ${opts.appID} - Workspace Files...`);
			} else {
				console.log(`Uploading to ${opts.appID} - Application Static Files...`);
			}

			const childProcess = execSync(
				opts.sqlclPath + // Sqlcl path
				' ' + opts.connectString + // Connect string (user/pass@server:port/sid)
				' @"' + path.resolve(__dirname, 'lib/script') + '"' + // Sql to execute
				' "' + path.resolve(__dirname, 'lib/distUpload.js') + '"' + // Param &1 (js to execute)
				' "' + path.resolve(opts.directory) + '"' + // Param &2
				' ' + opts.appID + // Param &3
				' "' + opts.filesDirectory + '"' // Param &4
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
