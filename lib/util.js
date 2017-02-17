module.exports = {
    // returns the application ID of an APEX URL
    getAppID: function(appURL) {
        let paramString = appURL.substring(appURL.indexOf("f?p=") + 4).split(":");
        return paramString[0];
    }
};
