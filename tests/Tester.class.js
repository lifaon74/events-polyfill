const webdriver = require('selenium-webdriver');

Promise.sequence = (promiseFactories) => {
  let promise = Promise.resolve();
  promiseFactories.forEach((promiseFactory) => {
    promise = promise.then(() => {
      promiseFactory();
    });
  });
  return promise;
};

Promise.parallel = (promiseFactories) => {
  let promises = [];
  promiseFactories.forEach(promiseFactory => {
    promises.push(promiseFactory());
  });
  return Promise.all(promises);
};

class Tester {
  static get CHROME () { return 'chrome' };
  static get FIREFOX () { return 'firefox' };
  static get OPERA () { return 'opera' };
  static get IE () { return 'ie' };
  static get EDGE () { return 'edge' };


  constructor(remoteUrl) {
    this.remoteUrl = remoteUrl;
  }

  testWith(browsers, callback) {
    let drivers = browsers.map((browser) => this.getBrowserDriver(browser));
    let promiseFactories = [];
    for(let i = 0; i < drivers.length; i++) {
      promiseFactories.push(() => {
        return this.testWithDriver(drivers[i], callback);
      });
    }
    return Promise.parallel(promiseFactories);
  }

  testWithDriver(driver, callback) {
    return new Promise((resolve, reject) => {
      callback(driver, resolve);
    });
  }

  getBrowserDriver(browserName) {
    let capabilities = null;

    switch(browserName) {
      case Tester.CHROME:
        capabilities = webdriver.Capabilities.chrome();
        break;
      case Tester.IE:
        capabilities = webdriver.Capabilities.ie();
        break;
      case Tester.FIREFOX:
        capabilities = webdriver.Capabilities.firefox();
        break;
      case Tester.OPERA:
        capabilities = webdriver.Capabilities.opera();
        break;
      case Tester.EDGE:
        capabilities = webdriver.Capabilities.edge();
        break;
      default:
        throw new Error('Can\'t find browswer name ' + browserName);
      // return null;
    }

    return new webdriver.Builder()
      .usingServer(this.remoteUrl)
      .withCapabilities(capabilities)
      .build();
  }

  navigate(driver, path) {
    return driver.executeScript('return window.router.navigate(' + JSON.stringify(path) + ');');
  }

  executeScript(driver, script) {
    return this.executeAsyncScript(driver, `resolve(
      (function() {
        ${script}
      })()
    );`);
  }

  executeAsyncScript(driver, script) {
    return driver.executeAsyncScript(`
     var __done = arguments[arguments.length - 1];
     var resolve = function(data) {
      if(__done) __done({ success : true, data: data });
      __done = null;
     };
     var reject = function(error) {
       if(error instanceof Error) {
        error = { name: error.name, message: error.message, stack: error.stack };
       }
       if(__done) __done({ success : false, error: error });
       __done = null;
     };
     
     try {
      ${script}
     } catch(error) {
       reject(error);
     }
    `).then((data) => {
      if(data.success) {
        return data.data;
      } else {
        throw new Error(data.error.message + '\n\n' + data.error.stack);
      }
    });
  }

  untilIsNotVisible(element) {
    return () => {
      return element.isDisplayed().then(() => false).catch(() => true);
    };
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }
}

module.exports = Tester;