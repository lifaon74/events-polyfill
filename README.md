### Polyfill different events classes and methods to match last ES7 specifications

Min IE 10+

#### event-constructor-polyfill.js
Polyfill [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent), [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) and [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)

#### event-listener-options-polyfill.js
Polyfill EventTarget.prototype.addEventListener and EventTarget.prototype.removeEventListener ```options``` (last parameter which replace useCapture: boolean)
* [once](https://developers.google.com/web/updates/2016/10/addeventlistener-once)
* [passive](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
* capture (which replace useCapture)

#### event-listener-types-polyfill.js
--TODO
Polyfill event types :
* 'mousewheel', 'DOMMouseScroll' -> 'mousewheel'
* 'pointerlockchange', 'mozpointerlockchange', 'webkitpointerlockchange' -> 'pointerlockchange'
* ...