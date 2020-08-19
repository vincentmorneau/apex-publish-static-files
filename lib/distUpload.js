var helpers = helpers || {};

/* a java hashmap is needed for binds */
helpers.getBindMap = function () {
	var HashMap = Java.type("java.util.HashMap");
	var map = new HashMap();
	return map;
};

/* create a temp blob and load it from a local to sqlcl file */
helpers.getBlobFromFile = function (fileName) {
	try {
		var b = conn.createBlob();
		var out = b.setBinaryStream(1);
		var path = java.nio.file.FileSystems.getDefault().getPath(fileName);

		java.nio.file.Files.copy(path, out);
		out.flush();

		return b;
	} catch (e) {
		ctx.write(e);
	}
};

/* get the mime type from a file name before loading it in the database */
helpers.getMimeTypeFromFile = function (fileName) {
	try {
		var extension;
		var i = fileName.toString().lastIndexOf('.');
		if (i > 0) {
			extension = fileName.toString().substring(i);
		}
		var mimeType = java.nio.file.Files.probeContentType(java.nio.file.Files.createTempFile("dummy", extension));

		return mimeType;
	} catch (e) {
		ctx.write(e);
	}
};

// builds an array of files given a top level directory
// recursively enters each sub directory and adds the files to the array
helpers.walkFileTree = function (path) {
	var cwd = new File(path);
	if (cwd.isDirectory()) {
		var pathFiles = cwd.listFiles();
		for (var f in pathFiles) {
			helpers.walkFileTree(pathFiles[f].getAbsolutePath());
		}
	} else {
		files[fileCount++] = cwd;
	}
};

var File = Java.type("java.io.File");

var dir = args[1];
var appID = args[2];
var api = args[3];
var pluginName = args[4];

var files = [];
var fileCount = 0;

helpers.walkFileTree(dir);

if (api.toLowerCase() == "theme") {
	createFileAPI = " wwv_flow_api.create_theme_file (" +
		" p_flow_id      => l_application_id," +
		" p_theme_id     => l_theme_number," +
		" p_file_name    => l_file_name," +
		" p_mime_type    => nvl(l_mime_type, 'application/octet-stream')," +
		" p_file_charset => 'utf-8'," +
		" p_file_content => :b);";
} else if (api.toLowerCase() == 'workspace') {
	createFileAPI = " wwv_flow_api.create_workspace_static_file (" +
		" p_file_name    => l_file_name," +
		" p_mime_type    => nvl(l_mime_type, 'application/octet-stream')," +
		" p_file_charset => 'utf-8'," +
		" p_file_content => :b);";
} else if (api.toLowerCase() == 'plugin') {
	createFileAPI =
		" begin" +
		"   select plugin_id" +
		"   into l_plugin_id" +
		"   from apex_appl_plugins" +
		"   where application_id = l_app_id" +
		"   and name = l_plugin_name" +
		"   ;" +

		"   wwv_flow_api.create_plugin_file (" +
		"   p_flow_id      => l_application_id," +
		"   p_plugin_id    => l_plugin_id," +
		"   p_file_name    => l_file_name," +
		"   p_mime_type    => nvl(l_mime_type, 'application/octet-stream')," +
		"   p_file_charset => 'utf-8'," +
		"   p_file_content => :b);" +
		" exception when no_data_found then" +
		"   raise_application_error(-20001, 'Plugin ' || l_plugin_name || ' is not valid.');" +
		" end; ";
} else {
	createFileAPI = " wwv_flow_api.create_app_static_file (" +
		" p_flow_id      => l_application_id," +
		" p_file_name    => l_file_name," +
		" p_mime_type    => nvl(l_mime_type, 'application/octet-stream')," +
		" p_file_charset => 'utf-8'," +
		" p_file_content => :b);";
}

for (var file in files) {
	binds = helpers.getBindMap();

	var mimeType = helpers.getMimeTypeFromFile(files[file]);

	if (mimeType) {
		binds.put("path", files[file].toString());
		binds.put("dir", dir);
		binds.put("app_id", appID);
		binds.put("plugin_name", pluginName);
		binds.put("mime_type", mimeType);

		blob = helpers.getBlobFromFile(files[file]);

		ctx.write("Uploaded: " + files[file].toString() + "\n");
		binds.put("b", blob);

		var plsql =
			" declare" +
			"   l_file_name varchar2(4000);" +
			"   l_path varchar2(4000);" +
			"   l_dir varchar2(4000);" +

			// app_id is a varchar2 because it can come as an app alias too
			"   l_app_id varchar2(100) := :app_id;" +
			"   l_plugin_name varchar2(100) := :plugin_name;" +
			"   l_mime_type varchar2(4000) := :mime_type;" +

			"   l_application_id apex_applications.application_id%type;" +
			"   l_workspace_id apex_applications.workspace_id%type;" +
			"   l_theme_number apex_applications.theme_number%type;" +
			"   l_plugin_id apex_appl_plugins.plugin_id%type;" +
			" begin" +
			// simulates an APEX session to set the security_group_id
			"   select application_id, workspace_id, theme_number" +
			"   into l_application_id, l_workspace_id, l_theme_number" +
			"   from apex_applications" +
			"   where to_char(application_id) = l_app_id" +
			"   or upper(alias) = upper(l_app_id);" +

			"   apex_util.set_security_group_id (p_security_group_id => l_workspace_id);" +

			"   l_path := :path;" +
			"   l_dir := :dir;" +
			// eliminate the local path to get a real file name
			// "C:/dist/css/app.css" becomes "css/app.css"
			// dir and path are the same for a single file so becomes "app.css"
			"  if l_path != l_dir then" +
			"    l_file_name := substr(l_path, length(l_dir) + 2);" +
			"  else" +
			"    if instr(l_path, '/') > 0 then" +
			"      l_file_name := replace(l_path, substr(l_path, 1, instr(l_path, '/', -1, 1)), '');" +
			"    elsif instr(l_path, '\\') > 0 then" +
			"      l_file_name := replace(l_path, substr(l_path, 1, instr(l_path, '\\', -1, 1)), '');" +
			"    else" +
			"      l_file_name := l_path;" +
			"    end if;" +
			"  end if;" +
			"  l_file_name := replace(l_file_name, '\\', '/');" +

			"  execute immediate 'alter session set current_schema=' || apex_application.g_flow_schema_owner;" +
			createFileAPI +
			"   exception when no_data_found then" +
			"      raise_application_error(-20001, 'Application ' || l_app_id || ' is not valid.');" +
			" end;";

		// Add server output support
		sqlcl.setStmt("set serveroutput on");
		sqlcl.run();

		var ret = util.execute(plsql, binds);

		var ex = util.getLastException();

		if (ex) {
			ctx.write(ex + "\n");
		}
	}
}
