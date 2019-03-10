# APEX Publish Static Files

[![npm](https://img.shields.io/npm/v/apex-publish-static-files.svg)]() [![Build Status](https://travis-ci.org/vincentmorneau/apex-publish-static-files.svg?branch=master)](https://travis-ci.org/vincentmorneau/apex-publish-static-files) [![Dependency Status](https://david-dm.org/vincentmorneau/apex-publish-static-files.svg)](https://david-dm.org/vincentmorneau/apex-publish-static-files) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Uploads all files from a local directory or a single file to Oracle APEX. Destination can be:
- Application Static Files
- Workspace Static Files
- Theme Files
- Plugin Files

![demo](/docs/demo.gif)

## Requirements
* [Node.js](https://nodejs.org/en/)
* [SQLcl](http://www.oracle.com/technetwork/developer-tools/sqlcl/overview/index.html)

## Install
```
npm install apex-publish-static-files
```

## Usage
```javascript
var publisher = require('apex-publish-static-files');

publisher.publish({
    connectString: "user/pass@server:port/sid",
    directory: "/Users/vmorneau/Documents/project/www",
    appID: 111
});
```

## Options
Name | Type | Default | Description
--- | --- | --- | ---
sqlclPath | string | sql | Path to SQLcl (example: `/Users/vmorneau/sqlcl/bin/sql`)
connectString | string | | user/pass@server:port/sid
directory | string | | Local directory that contains the files or file path
appID | numeric | | Application ID to export the files to
destination | string | | Determines where the files should be uploaded in APEX (choices: `application`, `workspace`, `theme`, `plugin`)

## Methods
Name | Type | Description
--- | --- | ---
publish | function | Publishes the files to APEX

## Changelog
[See changelog.](changelog.md)

## License
MIT © [Vincent Morneau](http://vmorneau.me)
