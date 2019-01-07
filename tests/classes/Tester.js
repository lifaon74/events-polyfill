"use strict";
exports.__esModule = true;
var Driver_1 = require("./Driver");
var Tester = /** @class */ (function () {
    function Tester(remoteUrl) {
        this.remoteUrl = remoteUrl;
    }
    Tester.prototype.runForMany = function (browsers, callback) {
        var _this = this;
        return Promise.all(browsers.map(function (browser) { return _this.runFor(browser, callback); })).then(function () {
        });
    };
    Tester.prototype.runFor = function (browser, callback) {
        var driver = Driver_1.Driver.create(browser, this.remoteUrl);
        return new Promise(function (resolve) {
            resolve(callback(driver));
        })
            .then(function () {
            return driver.quit();
        }, function (error) {
            return driver.quit()
                .then(function () { return Promise.reject(error); });
        });
    };
    Tester.prototype.test = function (testName, callback) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.log("Starting test '" + testName + "'", 33);
            resolve(callback());
        })
            .then(function () {
            _this.log("test '" + testName + "' succeed", 32);
        }, function (error) {
            _this.log("test '" + testName + "' failed", 31);
            console.log(error);
            throw error;
        });
    };
    Tester.prototype.log = function (content, color) {
        console.log(this.colorString(content, color));
    };
    Tester.prototype.colorString = function (content, color) {
        if (color === void 0) { color = 0; }
        return "\u001B[" + color + "m" + content + "\u001B[0m";
    };
    return Tester;
}());
exports.Tester = Tester;
