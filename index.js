const fs = require("fs");
const path = require("path");
const globby = require("globby");
const oracledb = require("oracledb");
const mime = require("mime-types");

const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};

module.exports = {
	// Validates a JSON object
	publish({
		libDir,
		user,
		password,
		connectString,
		directory,
		appID,
		destination,
		pluginName,
	}) {
		// Validate arguments
		if (typeof connectString === "undefined") {
			throw new TypeError("connectString is required.");
		}

		if (typeof directory === "undefined") {
			throw new TypeError("directory is a required argument.");
		}

		if (typeof appID === "undefined") {
			throw new TypeError("appID is a required argument.");
		}

		if (
			destination.toLowerCase() === "plugin" &&
			typeof pluginName === "undefined"
		) {
			throw new Error("pluginName is a required argument.");
		}

		if (!fs.existsSync(directory)) {
			throw new Error(`Directory ${directory} is not a valid path.`);
		}

		async function run() {
			let connection;
			let result;
			let createFileApi;

			const files = await globby([directory]);

			if (files.length === 0) {
				console.log("Directory is empty.");
			} else {
				switch (destination.toLowerCase()) {
					case "theme":
						console.log(`Uploading to ${appID} - Theme Files...`);
						createFileApi = `
						wwv_flow_api.create_theme_file (
							p_flow_id      => :application_id,
							p_theme_id     => :theme_number,
							p_file_name    => :file_name,
							p_mime_type    => :mime_type,
							p_file_charset => 'utf-8',
							p_file_content => :b
						);`;
						break;
					case "workspace":
						console.log(`Uploading to ${appID} - Workspace Files...`);
						createFileApi = `
						wwv_flow_api.create_workspace_static_file (
							p_file_name    => :file_name,
							p_mime_type    => :mime_type,
							p_file_charset => 'utf-8',
							p_file_content => :b
						);`;
						break;
					case "plugin":
						console.log(
							`Uploading to ${appID} - ${pluginName} - Plugin Files...`
						);
						createFileApi = `
						declare
							l_plugin_id apex_appl_plugins%plugin_id%type;
						begin
							select plugin_id
							into l_plugin_id
							from apex_appl_plugins
							where application_id = l_app_id
							and name = l_plugin_name
							;
				
							wwv_flow_api.create_plugin_file (
								p_flow_id      => :application_id,
								p_plugin_id    => l_plugin_id,
								p_file_name    => :file_name,
								p_mime_type    => :mime_type,
								p_file_charset => 'utf-8',
								p_file_content => :b
							);
						exception when no_data_found then
							raise_application_error(-20001, 'Plugin ' || l_plugin_name || ' is not valid.');
						end;`;
						break;
					default:
						console.log(`Uploading to ${appID} - Application Static Files...`);
						createFileApi = `
						wwv_flow_api.create_app_static_file (
							p_flow_id      => :application_id,
							p_file_name    => :file_name,
							p_mime_type    => :mime_type,
							p_file_charset => 'utf-8',
							p_file_content => :b
						);`;
				}

				try {
					oracledb.initOracleClient({ libDir });

					connection = await oracledb.getConnection({
						user,
						password,
						connectString,
					});

					result = await connection.execute(
						`
						declare			
							l_app_id varchar2(100) := :appID;
							l_workspace_id apex_applications.workspace_id%type;
						begin
							select application_id, theme_number, workspace_id
							into :application_id, :theme_number, l_workspace_id
							from apex_applications
							where to_char(application_id) = l_app_id
							or upper(alias) = upper(l_app_id);
			
							apex_util.set_security_group_id (p_security_group_id => l_workspace_id);
			
							execute immediate 'alter session set current_schema='||apex_application.g_flow_schema_owner;
						exception when no_data_found then
							raise_application_error(-20001, 'Application ' || l_app_id || ' is not valid.');
						end;`,
						{
							appID,
							application_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
							theme_number: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
						}
					);

					const application_id = result.outBinds.application_id;
					const theme_number = result.outBinds.theme_number;

					await asyncForEach(files, async (file) => {
						const b = fs.readFileSync(file);
						const file_name = path.relative(directory, file);
						const mime_type = mime.lookup(file);

						let opts = {
							b,
							file_name,
							mime_type,
							application_id
						};

						if (destination.toLowerCase() === 'theme') {
							opts.theme_number = theme_number;
						}

						const result2 = await connection.execute(`begin ${createFileApi} end;`, opts);
						console.log(`Uploaded ${file_name}`);
					});

					console.log(`Uploading Complete`);
				} catch (err) {
					console.error(err);
				} finally {
					if (connection) {
						try {
							await connection.commit();
							await connection.close();
						} catch (err) {
							console.error(err);
						}
					}
				}
			}
		}

		run();
	},
};
