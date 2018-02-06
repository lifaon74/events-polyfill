import * as $webdriver from 'selenium-webdriver';

import { Driver } from './classes/Driver';
import { Async } from './classes/Async';
import { Tester } from './classes/Tester';


(function example() {
  const config = require('./config.json');
  const tester = new Tester(config.testServer);

  return tester.runForMany([
    // Driver.EDGE,
    // Driver.CHROME,
    // Driver.FIREFOX,
    // Driver.OPERA,
    Driver.IE
  ], async (driver: Driver) => {


    await driver.driver.manage().setTimeouts({
      pageLoad: 300000,
      script: 300000,
    });
    await driver.navigate(config.testHost);

    await Async.$delay(500);

    await tester.test('Test CustomEvent', () =>  {
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

    await tester.test('Test MouseEvent', () =>  {
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

    await tester.test('Test KeyboardEvent', () =>  {
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

    await tester.test('Test FocusEvent', () =>  {
      return driver.executeAsyncScript(`
        window.addEventListener('FocusEvent', function(event) {
          if(event.relatedTarget === document.body) {
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

    await tester.test('Test PointerEvent', () =>  {
      return driver.executeAsyncScript(`
        window.addEventListener('PointerEvent', function(event) {
          if(event.width !== 10) {
            return reject(new Error('Invalid width property'));
          }
          
          if(event.isPrimary !== true) {
            return reject(new Error('Invalid isPrimary property'));
          }
          
          if(event.twist !== 180) {
            return reject(new Error('Invalid twist property'));
          }
          
          resolve();
        });

        window.dispatchEvent(new PointerEvent('PointerEvent', {
          width: 10,
          isPrimary: true,
          twist: 180
        }));
      `);
    });


    await tester.test('Test Once', () =>  {
      return driver.executeAsyncScript(`
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

    await tester.test('Test FullScreen', async () =>  {
      await driver.executeScript(`
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

      await driver.driver.wait($webdriver.until.elementLocated($webdriver.By.css('body')));
      await driver.driver.findElement($webdriver.By.css('body')).click();

      return driver.executeScript(`
        if(!window.FullScreenEventReceived) {
          throw new Error('PointerDownEvent not received');
        }
      `);
    });

  });

})();