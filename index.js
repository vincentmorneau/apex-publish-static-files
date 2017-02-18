'use strict';

const objectAssign = require("object-assign");

var path = require('path'),
    execSync = require('child_process').execSync,
    fs = require("fs"),
    util = require('./lib/util');

var validate = function(opts) {
    let exit = false;

    if (opts.connectString == undefined) {
        console.trace("connectString' is a required argument.");
        exit = true;
    }

    if (opts.directory == undefined) {
        console.trace("directory' is a required argument.");
        exit = true;
    }

    if (!fs.existsSync(opts.directory)) {
        console.trace(`Directory ${opts.directory} is not a valid path.`);
        exit = true;
    }

    if (opts.appID == undefined) {
        console.trace("appID' is a required argument.");
        exit = true;
    }

    if (exit) {
        process.exit();
    }

    return opts;
};

module.exports = {
    // validates a JSON object
    publish: function(opts) {
        // set defaults
        opts = objectAssign({
            sqlclPath: "sql"
        }, opts);

        // validate the options
        opts = validate(opts);

        console.log("Uploading to Shared Components - Application Static Files...");

        // execute the upload process
        var childProcess = execSync(
            opts.sqlclPath // sqlcl path
            + " " + opts.connectString // connect string (user/pass@server:port/sid)
            + " @\"" + path.resolve(__dirname, "lib/script") + "\"" // sql to execute
            + " \"" + path.resolve(__dirname, "lib/distUpload.js") + "\"" // param &1 (js to execute)
            + " \"" + path.resolve(opts.directory) + "\"" // param &2
            + " " + opts.appID // param &3
            , { encoding: 'utf8' }
        );

        console.log(childProcess);

        console.log("Files were uploaded successfully.");
    }
}
