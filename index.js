'use strict';

const path = require('path');
const {
	spawnSync
} = require('child_process');
const fs = require('fs');

module.exports = {
	// Validates a JSON object
	publish(options) {
		// Set defaults
		const defaults = {
			sqlclPath: 'sql',
			destination: 'application'
		};
		options = Object.assign(defaults, options);

		// Validate arguments
		if (typeof options.connectString === 'undefined') {
			throw new TypeError('connectString is required.');
		}

		if (typeof options.directory === 'undefined') {
			throw new TypeError('directory is a required argument.');
		}

		if (typeof options.appID === 'undefined') {
			throw new TypeError('appID is a required argument.');
		}

		if (options.destination.toLowerCase() === 'plugin' && typeof options.pluginName === 'undefined') {
			throw new Error('pluginName is a required argument.');
		}

		if (!fs.existsSync(options.directory)) {
			throw new Error(`Directory ${options.directory} is not a valid path.`);
		}

		const getAllFiles = (files, dir) => {
			if (fs.lstatSync(dir).isDirectory()) {
				fs.readdirSync(dir).forEach(file => {
					const fullPath = path.join(dir, file);
					getAllFiles(files, fullPath);
				});
			} else {
				files.push(dir);
			}
		};

		const files = [];
		getAllFiles(files, options.directory);

		if (files.length === 0) {
			console.log('Directory is empty.');
		} else {
			// Execute the upload process
			try {
				switch (options.destination.toLowerCase()) {
					case 'theme':
						console.log(`Uploading to ${options.appID} - Theme Files...`);
						break;
					case 'workspace':
						console.log(`Uploading to ${options.appID} - Workspace Files...`);
						break;
					case 'plugin':
						console.log(`Uploading to ${options.appID} - ${options.pluginName} - Plugin Files...`);
						break;
					default:
						console.log(`Uploading to ${options.appID} - Application Static Files...`);
				}

				const spawnOptions = [
					options.connectString, // Connect string (user/pass@server:port/sid)
					'@' + path.resolve(__dirname, 'lib/script'), // Sql to execute
					path.resolve(__dirname, 'lib/distUpload.js'), // Param &1 (js to execute)
					path.resolve(options.directory), // Param &2
					options.appID, // Param &3
					options.destination, // Param &4
					options.pluginName // Param &5
				];

				const childProcess = spawnSync(
					options.sqlclPath, // SQLcl path
					spawnOptions, {
						encoding: 'utf8'
					}
				);

				if (childProcess.error || (childProcess.stdout && childProcess.stdout.includes('Error Message'))) {
					console.error('Files could not be uploaded.');

					/* eslint complexity: ["error", 21] */
					/* eslint max-depth: ["error", 5] */

					if (childProcess.error) {
						if (childProcess.error.errno && childProcess.error.path) {
							console.error(childProcess.error.errno, childProcess.error.path);
						} else if (childProcess.error.errno) {
							console.error(childProcess.error.errno);
						} else {
							console.error(childProcess.error);
						}
					}

					if (childProcess.stdout && childProcess.stdout.includes('Error Message')) {
						console.error(childProcess.stdout);
					}
				} else {
					console.error(childProcess.stdout);
					console.log('Files were uploaded successfully.');
				}
			} catch (error) {
				console.error(error);
			}
		}
	}
};
