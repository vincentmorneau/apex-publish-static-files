# APEX Publish Static Files

Allows to publish an entire local directory to Oracle APEX Shared Components.

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
    sqlclPath: "sql",
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

## Methods
Name | Type | Description
--- | --- | --- | ---
publish | function | Publishes the files to APEX

## Changelog
[See changelog.](changelog.md)

## Project Team
- [Vincent Morneau](https://github.com/vincentmorneau)
