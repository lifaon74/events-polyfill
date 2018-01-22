import { Driver, DriverBrowser } from './classes/Driver';
import { Async } from './classes/Async';

export class Tester {


  public remoteUrl: string;

  constructor(remoteUrl: string) {
    this.remoteUrl = remoteUrl;
  }

  runForMany(browsers: DriverBrowser[], callback: (driver: Driver) => Promise<any>): Promise<void> {
    return Promise.all(
      browsers.map((browser: DriverBrowser) => this.runFor(browser, callback))
    ).then(() => {});
  }

  runFor(browser: DriverBrowser, callback: (driver: Driver) => Promise<any>): Promise<void> {
    const driver: Driver = Driver.create(browser, this.remoteUrl);
    return new Promise<void>((resolve: any) => {
      resolve(callback(driver));
    })
      .then(() => {
        return driver.quit();
      }, (error: any) => {
        return driver.quit()
          .then(() => Promise.reject(error));
      });
  }

  test(testName: string, callback: () => Promise<void>): Promise<void> {
    return new Promise<void>((resolve: any, reject: any) => {
      this.log(`Starting test '${testName}'`, 33);
      resolve(callback());
    })
      .then(() => {
        this.log(`test '${testName}' succeed`, 32);
      },(error: any) => {
        this.log(`test '${testName}' failed`, 31);
        console.log(error);
        throw error;
      });
  }

  protected log(content: string, color?: number): void {
    console.log(this.colorString(content, color));
  }

  protected colorString(content: string, color: number = 0): string {
    return `\x1b[${color}m${content}\x1b[0m`;
  }
}


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