"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var $webdriver = require("selenium-webdriver");
var Driver_1 = require("./classes/Driver");
var Async_1 = require("./classes/Async");
var Tester_1 = require("./classes/Tester");
(function example() {
    var _this = this;
    var config = require('./config.json');
    var tester = new Tester_1.Tester(config.testServer);
    return tester.runForMany([
        Driver_1.Driver.EDGE,
        Driver_1.Driver.CHROME,
        // Driver.FIREFOX,
        // Driver.OPERA,
        Driver_1.Driver.IE
    ], function (driver) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, driver.driver.manage().setTimeouts({
                        pageLoad: 300000,
                        script: 300000,
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, driver.navigate(config.testHost)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Async_1.Async.$delay(500)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tester.test('Test CustomEvent', function () {
                            return driver.executeAsyncScript("\n        window.addEventListener('CustomEvent', function(event) {\n          if(event.detail.test === 'test') {\n            resolve();\n          } else {\n            reject(new Error('Invalid detail property'));\n          }\n        });\n\n        window.dispatchEvent(new CustomEvent('CustomEvent', {\n          detail: { test: 'test' }\n        }));\n      ");
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tester.test('Test MouseEvent', function () {
                            return driver.executeAsyncScript("\n        window.addEventListener('MouseEvent', function(event) {\n          if(event.clientX.toString() === '123') {\n            resolve();\n          } else {\n            reject(new Error('Invalid clientX property : ' + event.clientX));\n          }\n        });\n\n        window.dispatchEvent(new MouseEvent('MouseEvent', {\n          clientX: 123\n        }));\n      ");
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, tester.test('Test KeyboardEvent', function () {
                            return driver.executeAsyncScript("\n       window.addEventListener('KeyboardEvent', function(event) {\n          if(event.key.toString() === '123') {\n            resolve();\n          } else {\n            reject(new Error('Invalid key property : ' + event.key));\n          }\n        });\n\n        window.dispatchEvent(new KeyboardEvent('KeyboardEvent', {\n          key: 123\n        }));\n      ");
                        })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, tester.test('Test FocusEvent', function () {
                            return driver.executeAsyncScript("\n        window.addEventListener('FocusEvent', function(event) {\n          if(event.relatedTarget === document.body) {\n            resolve();\n          } else {\n            reject(new Error('Invalid relatedTarget property'));\n          }\n        });\n\n        window.dispatchEvent(new FocusEvent('FocusEvent', {\n          relatedTarget: document.body \n        }));\n      ");
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, tester.test('Test PointerEvent', function () {
                            return driver.executeAsyncScript("\n        window.addEventListener('PointerEvent', function(event) {\n          if(event.width !== 10) {\n            return reject(new Error('Invalid width property'));\n          }\n          \n          if(event.isPrimary !== true) {\n            return reject(new Error('Invalid isPrimary property'));\n          }\n          \n          /*if(event.twist !== 180) {\n            return reject(new Error('Invalid twist property'));\n          }*/\n          \n          resolve();\n        });\n\n        window.dispatchEvent(new PointerEvent('PointerEvent', {\n          width: 10,\n          isPrimary: true,\n          twist: 180\n        }));\n      ");
                        })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, tester.test('Test Once', function () {
                            return driver.executeAsyncScript("\n        var count = 0;\n        window.addEventListener('once', function(event) {\n          count++;\n          if(count === 1) {\n            setTimeout(resolve, 1000);\n          } else {\n            reject(new Error('Invalid count => once triggered more than once'));\n          }\n        }, { once: true });\n\n        for(var i = 0; i < 10; i++) {\n          window.dispatchEvent(new CustomEvent('once'));\n        }\n      ");
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, tester.test('Test null third argument to addEventListener', function () {
                            return driver.executeAsyncScript("\n        var count = 0;\n        window.addEventListener('test-third-event', function(event) {\n          resolve();\n        }, null);\n        window.dispatchEvent(new CustomEvent('test-third-event'));\n      ");
                        })];
                case 10:
                    _a.sent();
                    // await tester.test('Test Passive', () =>  {
                    //   return driver.executeAsyncScript(`
                    //     window.addEventListener('scroll', function(event) {
                    //       try {
                    //         event.preventDefault();
                    //       } catch(error) {
                    //         resolve();
                    //         return;
                    //       }
                    //
                    //        reject(new Error('preventDefault inside passive should fail'));
                    //     }, { passive: true });
                    //
                    //     document.body.style.height = '4000px';
                    //     window.scroll(100, 100);
                    //   `);
                    // });
                    // await tester.test('Test KeyboardEvent code', async () =>  {
                    //   await driver.executeScript(`
                    //     window.KeyboardEventCodeReceived = null;
                    //     document.body.tabIndex = 0;
                    //     document.body.addEventListener('keydown', function(event) {
                    //       window.KeyboardEventCodeReceived = event;
                    //     });
                    //   `);
                    //
                    //   await driver.driver.wait($webdriver.until.elementLocated($webdriver.By.css('body')));
                    //   await driver.driver.findElement($webdriver.By.css('body')).sendKeys('a');
                    //
                    //   return driver.executeScript(`
                    //     if(!window.KeyboardEventCodeReceived) {
                    //       throw new Error('KeyboardEvent not received');
                    //     }
                    //
                    //     if(window.KeyboardEventCodeReceived.code !== 'KeyA') {
                    //       throw new Error('Invalid code : ' + window.KeyboardEventCodeReceived.code);
                    //     }
                    //   `);
                    // });
                    return [4 /*yield*/, tester.test('Test FullScreen', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, driver.executeScript("\n        window.FullScreenEventReceived = null;\n        document.body.style.height = '4000px';\n        document.body.style.background = 'blue';\n        document.body.requestFullscreen = document.body.requestFullscreen ||\n        document.body.msRequestFullscreen ||\n        document.body.mozRequestFullscreen ||\n        document.body.webkitRequestFullscreen;\n        \n        document.addEventListener('fullscreenchange', function(event) {\n          window.FullScreenEventReceived = event;\n          document.getElementById('content').style.background = 'green';\n        });\n        \n        document.body.addEventListener('click', function(event) {\n          document.getElementById('content').style.background = 'red';\n          document.body.requestFullscreen();\n        });\n      ")];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, driver.driver.wait($webdriver.until.elementLocated($webdriver.By.css('body')))];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, driver.driver.findElement($webdriver.By.css('body')).click()];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, driver.executeScript("\n        if(!window.FullScreenEventReceived) {\n          throw new Error('PointerDownEvent not received');\n        }\n      ")];
                                }
                            });
                        }); })];
                case 11:
                    // await tester.test('Test Passive', () =>  {
                    //   return driver.executeAsyncScript(`
                    //     window.addEventListener('scroll', function(event) {
                    //       try {
                    //         event.preventDefault();
                    //       } catch(error) {
                    //         resolve();
                    //         return;
                    //       }
                    //
                    //        reject(new Error('preventDefault inside passive should fail'));
                    //     }, { passive: true });
                    //
                    //     document.body.style.height = '4000px';
                    //     window.scroll(100, 100);
                    //   `);
                    // });
                    // await tester.test('Test KeyboardEvent code', async () =>  {
                    //   await driver.executeScript(`
                    //     window.KeyboardEventCodeReceived = null;
                    //     document.body.tabIndex = 0;
                    //     document.body.addEventListener('keydown', function(event) {
                    //       window.KeyboardEventCodeReceived = event;
                    //     });
                    //   `);
                    //
                    //   await driver.driver.wait($webdriver.until.elementLocated($webdriver.By.css('body')));
                    //   await driver.driver.findElement($webdriver.By.css('body')).sendKeys('a');
                    //
                    //   return driver.executeScript(`
                    //     if(!window.KeyboardEventCodeReceived) {
                    //       throw new Error('KeyboardEvent not received');
                    //     }
                    //
                    //     if(window.KeyboardEventCodeReceived.code !== 'KeyA') {
                    //       throw new Error('Invalid code : ' + window.KeyboardEventCodeReceived.code);
                    //     }
                    //   `);
                    // });
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
})();
