(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./classes/Driver", "./classes/Async"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Driver_1 = require("./classes/Driver");
    const Async_1 = require("./classes/Async");
    class Tester {
        constructor(remoteUrl) {
            this.remoteUrl = remoteUrl;
        }
        runForMany(browsers, callback) {
            return Promise.all(browsers.map((browser) => this.runFor(browser, callback))).then(() => { });
        }
        runFor(browser, callback) {
            const driver = Driver_1.Driver.create(browser, this.remoteUrl);
            return new Promise((resolve) => {
                resolve(callback(driver));
            })
                .then(() => {
                return driver.quit();
            }, (error) => {
                return driver.quit()
                    .then(() => Promise.reject(error));
            });
        }
        test(testName, callback) {
            return new Promise((resolve, reject) => {
                this.log(`Starting test '${testName}'`, 33);
                resolve(callback());
            })
                .then(() => {
                this.log(`test '${testName}' succeed`, 32);
            }, (error) => {
                this.log(`test '${testName}' failed`, 31);
                console.log(error);
                throw error;
            });
        }
        log(content, color) {
            console.log(this.colorString(content, color));
        }
        colorString(content, color = 0) {
            return `\x1b[${color}m${content}\x1b[0m`;
        }
    }
    exports.Tester = Tester;
    (function example() {
        const config = require('./config.json');
        const tester = new Tester(config.testServer);
        return tester.runForMany([
            // Driver.EDGE,
            // Driver.CHROME,
            // Driver.FIREFOX,
            // Driver.OPERA,
            Driver_1.Driver.IE
        ], async (driver) => {
            await driver.driver.manage().setTimeouts({
                pageLoad: 300000,
                script: 300000,
            });
            await driver.navigate(config.testHost);
            await Async_1.Async.$delay(500);
            await tester.test('Test CustomEvent', () => {
                return driver.executeAsyncScript(`
        window.addEventListener('CustomEvent', function(event) {
          if(event.detail.test === 'test') {
            resolve();
          } else {
            reject(new Error('Invalid detail property'));
          }
        });

        window.dispatchEvent(new CustomEvent('CustomEvent', {
          detail: { test: 'test' }
        }));
      `);
            });
            await tester.test('Test MouseEvent', () => {
                return driver.executeAsyncScript(`
        window.addEventListener('MouseEvent', function(event) {
          if(event.clientX.toString() === '123') {
            resolve();
          } else {
            reject(new Error('Invalid clientX property : ' + event.clientX));
          }
        });

        window.dispatchEvent(new MouseEvent('MouseEvent', {
          clientX: 123
        }));
      `);
            });
            await tester.test('Test KeyboardEvent', () => {
                return driver.executeAsyncScript(`
       window.addEventListener('KeyboardEvent', function(event) {
          if(event.key.toString() === '123') {
            resolve();
          } else {
            reject(new Error('Invalid key property : ' + event.key));
          }
        });

        window.dispatchEvent(new KeyboardEvent('KeyboardEvent', {
          key: 123
        }));
      `);
            });
            await tester.test('Test FocusEvent', () => {
                return driver.executeAsyncScript(`
        window.addEventListener('FocusEvent', function(event) {
          if(event.relatedTarget === document.body ) {
            resolve();
          } else {
            reject(new Error('Invalid relatedTarget property'));
          }
        });

        window.dispatchEvent(new FocusEvent('FocusEvent', {
          relatedTarget: document.body 
        }));
      `);
            });
        });
    })();
});
