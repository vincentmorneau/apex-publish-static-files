var helpers = helpers || {};

/* for complex type a java hashmap is needed for binds */
helpers.getBindMap = function() {
	var HashMap = Java.type("java.util.HashMap");
	map = new HashMap();
	return map;
};

/* create a temp blob and load it from a local to sqlcl file */
helpers.getBlobFromFile = function(fileName) {
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

// builds an array of files given a top level directory
// recursively enters each sub directory and adds the files to the array
helpers.walkFileTree = function(path) {
	var cwd = new File(path);
	var pathFiles = cwd.listFiles();

	for (var f in pathFiles) {
		if (pathFiles[f].isDirectory()) {
			helpers.walkFileTree(pathFiles[f].getAbsolutePath());
		}

		if (pathFiles[f].isFile()) {
			files[fileCount++] = pathFiles[f];
		}
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
	/* load binds */
	binds = helpers.getBindMap();

	/* add more binds */
	binds.put("path", files[file].toString());
	binds.put("dir", dir);
	binds.put("app_id", appID);
	binds.put("plugin_name", pluginName);

	blob = helpers.getBlobFromFile(files[file]);

	ctx.write("Uploaded: " + files[file] + "\n");
	binds.put("b", blob);

	// exec the insert and pass binds
	var plsql =
		" declare" +
		"   l_file_name varchar2(4000);" +
		"   l_mime_type varchar2(4000);" +
		"   l_dir varchar2(4000);" +

		// app_id is a varchar2 because it can come as an app alias too
		"   l_app_id varchar2(100) := :app_id;" +
		"   l_plugin_name varchar2(100) := :plugin_name;" +

		"   l_application_id apex_applications.application_id%type;" +
		"   l_workspace_id apex_applications.workspace_id%type;" +
		"   l_theme_number apex_applications.theme_number%type;" +
		"   l_plugin_id apex_appl_plugins.plugin_id%type;" +

		"   cursor c_mime_types (p_file_name in varchar2) is" +
		"   select mime_type" +
		"   from xmltable (" +
		"       xmlnamespaces (" +
		"       default 'http://xmlns.oracle.com/xdb/xdbconfig.xsd')," +
		"           '//mime-mappings/mime-mapping' " +
		"           passing xdb.dbms_xdb.cfg_get()" +
		"       columns" +
		"           extension varchar2(50) path 'extension'," +
		"           mime_type varchar2(100) path 'mime-type' " +
		"   )" +
		"   where lower(extension) = lower(substr(p_file_name, instr(p_file_name, '.', -1) + 1));" +
		" begin" +
		// simulates an APEX session to set the security_group_id
		"   select application_id, workspace_id, theme_number" +
		"   into l_application_id, l_workspace_id, l_theme_number" +
		"   from apex_applications" +
		"   where to_char(application_id) = l_app_id" +
		"   or upper(alias) = upper(l_app_id);" +

		"   apex_util.set_security_group_id (p_security_group_id => l_workspace_id);" +

		"   l_file_name := :path;" +
		"   l_dir := :dir;" +
		// eliminate the local dist path to get a real file name
		// "C:/dist/css/app.css" becomes "css/app.css"
		"   l_file_name := substr(l_file_name, length(l_dir) + 2);" +
		"   l_file_name := replace(l_file_name, '\\', '/');" +

		// get the mime type for the current file
		"   for i in c_mime_types (p_file_name => l_file_name) loop" +
		"     l_mime_type := i.mime_type;" +
		"   end loop;" +

		// inserts the file
		"   execute immediate 'alter session set current_schema=' || apex_application.g_flow_schema_owner;" +
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
