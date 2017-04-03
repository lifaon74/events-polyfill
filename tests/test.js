const Tester = require('./Tester.class');

const assert = require('assert'),
  test = require('selenium-webdriver/testing'),
  webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until,
  Button = webdriver.Button
;

const config = require('./config.json');
const tester = new Tester(config.testServer);


test.describe('Events polyfill', function() {
  this.timeout(30000);

  tester.testWith([
    Tester.EDGE,
    Tester.CHROME,
    // Tester.FIREFOX,
    // Tester.OPERA,
    Tester.IE
  ], (driver, done) => {
    driver.manage().timeouts().setScriptTimeout(15000);


    test.before(() => {
      driver.manage().timeouts().pageLoadTimeout(1000);
       driver.navigate().to(config.testHost);
      return tester.sleep(2000);
    });

    test.it('Test CustomEvent', () => {
      return tester.executeAsyncScript(driver, `
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

    test.it('Test MouseEvent', () => {
      return tester.executeAsyncScript(driver, `
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

    test.it('Test KeyboardEvent', () => {
      return tester.executeAsyncScript(driver, `
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

    test.it('Test Once', () => {
      return tester.executeAsyncScript(driver, `
        var count = 0;
        window.addEventListener('once', function(event) {
          count++;
          if(count === 1) {
            setTimeout(resolve, 1000);
          } else {
            reject(new Error('Invalid count => once triggered more than once'));
          }
        }, { once: true });

        for(var i = 0; i < 10; i++) {
          window.dispatchEvent(new CustomEvent('once'));
        }
      `);
    });

    // test.it('Test Passive', () => {
    //   return tester.executeAsyncScript(driver, `
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

    test.it('Test KeyboardEvent code', () => {
      tester.executeScript(driver, `
        window.KeyboardEventCodeReceived = null;
        document.body.tabIndex = 0;
        document.body.addEventListener('keydown', function(event) {
          window.KeyboardEventCodeReceived = event;
        });
      `);

      driver.wait(until.elementLocated(By.css('body')));
      driver.findElement(By.css('body')).sendKeys('a');

      return tester.executeScript(driver, `
        if(!window.KeyboardEventCodeReceived) {
          throw new Error('KeyboardEvent not received');
        }

        if(window.KeyboardEventCodeReceived.code !== 'KeyA') {
          throw new Error('Invalid code : ' + window.KeyboardEventCodeReceived.code);
        }
      `);
    });


    test.it('Test FullScreen', () => {
      tester.executeScript(driver, `
        window.FullScreenEventReceived = null;
        document.body.style.height = '4000px';
        document.body.style.background = 'blue';
        document.body.requestFullscreen = document.body.requestFullscreen ||
        document.body.msRequestFullscreen ||
        document.body.mozRequestFullscreen ||
        document.body.webkitRequestFullscreen;
        
        document.addEventListener('fullscreenchange', function(event) {
          window.FullScreenEventReceived = event;
          document.getElementById('content').style.background = 'green';
        });
        
        document.body.addEventListener('click', function(event) {
          document.getElementById('content').style.background = 'red';
          document.body.requestFullscreen();
        });
      `);


      driver.wait(until.elementLocated(By.css('body')));
      driver.findElement(By.css('body')).click();

      return tester.executeScript(driver, `
        if(!window.FullScreenEventReceived) {
          throw new Error('PointerDownEvent not received');
        }
      `);
    });



    test.after(() => {
      driver.quit();
      done();
    });
  });
});


