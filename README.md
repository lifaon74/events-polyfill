### Polyfill different events classes and methods to match last ES7 specifications

Tested on IE 10+

#### Install
```
npm i events-polyfill --save
```

For fast use `import 'events-polyfill'` (will import index.js).

**[INFO]** New release v2 that allow you to import specific polyfills only:
- you can use webpack (or any bundler) to import only required polyfills from `src/`.
- or you can import index.js (or index.min.js) at the root to polyfill everything.

#### src/constructors/*.js
Polyfill for :
[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event),
[CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent),
[MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent),
[KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent),
[FocusEvent](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent)
[PointerEvent](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)

#### src/ListenerOptions.js
Polyfill for the `options` argument of :
```js
EventTarget.prototype.addEventListener(type, listener[, options]);
EventTarget.prototype.removeEventListener(type, listener[, options]);
```

**options** : last parameter which replace boolean useCapture
* [once](https://developers.google.com/web/updates/2016/10/addeventlistener-once) : trigger only once this event (default: false)
* [passive](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md) : allow browser to continue animations (ex: while scrolling) by 'disabling' event.preventDefault() (default: false)
* capture : replace useCapture (default: false)

#### Example:
```js
document.addEventListener('click', function() {
    console.log('clicked once');
}, { once: true });
```

#### src/ListenerEventTypes.js
Polyfill for the `type` argument of :
```js
EventTarget.prototype.addEventListener(type, listener[, options]);
EventTarget.prototype.removeEventListener(type, listener[, options]);
```

Polyfill vendor prefixed events like 'pointerlockchange' (try 'pointerlockchange', 'mozpointerlockchange' and 'webkitpointerlockchange') and some *'experimental'* events like 'wheel' (try 'wheel', 'mousewheel', 'DOMMouseScroll')
* **[INFO]** If option can't be polyfilled : throw an error (allow you to check is event type is supported)


Currently polyfilled types :
```js
[
    'wheel',
    'pointerlockchange', 'pointerlockerror',
    'fullscreenchange', 'fullscreenerror',
    'animationend', 'animationiteration', 'animationstart', 'transitionend',
    'pointercancel', 'pointerdown', 'pointerhover', 'pointermove', 'pointerout', 'pointerover', 'pointerup'
]
```