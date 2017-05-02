# APEX Publish Static Files

[![npm](https://img.shields.io/npm/v/apex-publish-static-files.svg)]() [![Build Status](https://travis-ci.org/vincentmorneau/apex-publish-static-files.svg?branch=master)](https://travis-ci.org/vincentmorneau/apex-publish-static-files) [![Dependency Status](https://david-dm.org/vincentmorneau/apex-publish-static-files.svg)](https://david-dm.org/vincentmorneau/apex-publish-static-files) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo) [![Greenkeeper badge](https://badges.greenkeeper.io/vincentmorneau/apex-publish-static-files.svg)](https://greenkeeper.io/)

Publish a local directory to Oracle APEX.

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
    directory: "C:\\project\\files",
    appID: 111
});
```

## Options
Name | Type | Default | Description
--- | --- | --- | ---
sqlclPath | string | sql | Path to SQLcl
connectString | string | | user/pass@server:port/sid
directory | string | | Local directory that contains the files
appID | numeric | | Application ID to export the files to
apexDestination | string | | Determines where the files should be uploaded in APEX (choices: `application`, `workspace`, `theme`)

## Methods
Name | Type | Description
--- | --- | ---
publish | function | Publishes the files to APEX

## Changelog
[See changelog.](changelog.md)

## License
MIT © [Vincent Morneau](http://vmorneau.me)
