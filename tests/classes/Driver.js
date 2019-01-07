"use strict";
exports.__esModule = true;
var $webdriver = require("selenium-webdriver");
var Driver = /** @class */ (function () {
    function Driver(driver) {
        this.driver = driver;
    }
    Object.defineProperty(Driver, "CHROME", {
        get: function () {
            return 'chrome';
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Driver, "FIREFOX", {
        get: function () {
            return 'firefox';
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Driver, "OPERA", {
        get: function () {
            return 'opera';
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Driver, "IE", {
        get: function () {
            return 'ie';
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Driver, "EDGE", {
        get: function () {
            return 'edge';
        },
        enumerable: true,
        configurable: true
    });
    ;
    Driver.create = function (browserName, remoteUrl) {
        var capabilities = null;
        switch (browserName) {
            case this.CHROME:
                capabilities = $webdriver.Capabilities.chrome();
                break;
            case this.IE:
                capabilities = $webdriver.Capabilities.ie();
                break;
            case this.FIREFOX:
                capabilities = $webdriver.Capabilities.firefox();
                break;
            case this.OPERA:
                capabilities = $webdriver.Capabilities.opera();
                break;
            case this.EDGE:
                capabilities = $webdriver.Capabilities.edge();
                break;
            default:
                throw new Error("Can't find browswer name " + browserName);
        }
        var builder = new $webdriver.Builder();
        if (remoteUrl !== void 0) {
            builder = builder.usingServer(remoteUrl);
        }
        return new Driver(builder
            .withCapabilities(capabilities)
            .build());
    };
    /**
     * Executes an async script in the browser. Provides 2 function:
     *  - resolve
     *  - reject
     * @param {string} script
     * @return {Promise<void>}
     */
    Driver.prototype.executeAsyncScript = function (script) {
        // return this.driver.executeAsyncScript('arguments[arguments.length - 1]()');
        return this.driver.executeAsyncScript("\n       var __done = arguments[arguments.length - 1];\n       \n       var resolve = function(data) {\n         if(__done) __done({ success : true, data: data });\n         __done = null;\n       };\n       \n       var reject = function(error) {\n         if(error instanceof Error) {\n          var type = error.constructor.name || (/^\\s*function\\s+([^\\(\\s]*)\\s*/).exec(error.constructor.toString())[1]\n          error = { type: type, name: error.name || '', message: error.message || '', stack: error.stack || '' };\n         }\n         if(__done) __done({ success : false, _error: error });\n         __done = null;\n       };\n       \n       try {\n         " + script + "\n       } catch(error) {\n         reject(error);\n       }\n     \n    ").then(function (data) {
            if (data.success) {
                return data.data;
            }
            else {
                var error = data._error;
                if (typeof error === 'object') {
                    var type = (error.type in global) ? global[error.type] : Error;
                    var _error = new type(error.message || '');
                    if (error.name && (error.name !== _error.name))
                        _error.name = error.name;
                    // if(error.stack) _error.stack = error.stack;
                    _error.stack = error.stack || error.name + ": " + error.message + "\n\tempty stack";
                    error = _error;
                }
                throw error;
            }
        });
    };
    /**
     * Executes a script in the browser.
     * Can return a value with 'return'
     * @param {string} script
     * @return {Promise<void>}
     */
    Driver.prototype.executeScript = function (script) {
        return this.executeAsyncScript("resolve(\n      (function() {\n        " + script + "\n      })()\n    );");
    };
    Driver.prototype.navigate = function (url) {
        return this.driver.navigate().to(url);
    };
    Driver.prototype.ngNavigate = function (path) {
        return this.driver.executeScript("return window.router.navigate(" + JSON.stringify(path) + ");");
    };
    Driver.prototype.quit = function () {
        return this.driver.quit();
    };
    return Driver;
}());
exports.Driver = Driver;
