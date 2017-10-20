### Polyfill different events classes and methods to match last ES7 specifications

Tested on IE 10+

#### Install
```
npm i events-polyfill --save
```

#### event-constructor-polyfill.js
Polyfill for : [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent),
[MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent),
[KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent),
[FocusEvent](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent)

#### event-listener-polyfill.js
Polyfill for :
```js
EventTarget.prototype.addEventListener(type, listener[, options]);
EventTarget.prototype.removeEventListener(type, listener[, options]);
```

**type** : name of the event

Polyfill vendor prefixed events like 'pointerlockchange' (try 'pointerlockchange', 'mozpointerlockchange' and 'webkitpointerlockchange') and some *'experimental'* events like 'wheel' (try 'wheel', 'mousewheel', 'DOMMouseScroll')

* If option 'polyfill' set to false : disable polyfill (ex: for custom events)
* If option 'polyfill' set to true AND can't be polyfilled : throw an error (allow you to check is event type is supported)


Polyfilled types :
```js
[
    'wheel',
    'pointerlockchange', 'pointerlockerror',
    'fullscreenchange', 'fullscreenerror',
    'animationend', 'animationiteration', 'animationstart', 'transitionend',
    'pointercancel', 'pointerdown', 'pointerhover', 'pointermove', 'pointerout', 'pointerover', 'pointerup'
]
```

**listener** : the callback

**options** : last parameter which replace boolean useCapture
* [once](https://developers.google.com/web/updates/2016/10/addeventlistener-once) : trigger only once this event (default: false)
* [passive](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md) : allow browser to continue animations (ex: while scrolling) by 'disabling' event.preventDefault() (default: false)
* capture : replace useCapture (default: false)
* polyfill : custorm property which tell if vendor properties should be auto prefixed (default: true)

#### Example:
```js
document.addEventListener('pointerlockchange', function(event) {
    console.log('pointerlockchange', event);
}, { polyfill: true }); // here polyfill: true could be omited because it's the default value

document.addEventListener('click', function() {
    document.body.requestPointerLock();
}, { once: true });
```
