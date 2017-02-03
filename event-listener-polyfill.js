(function() {

  /**
   * Create EventTarget
   */
  if(typeof EventTarget === 'undefined') {
    window.EventTarget = Node;
  }

  /**
   * Check supported types
   */

  var eventTypes = {
    wheel: ['wheel', 'mousewheel', 'DOMMouseScroll']
  };

  [
    'pointerlockchange', 'pointerlockerror',
    'fullscreenchange', 'fullscreenerror',
    'animationend', 'animationiteration', 'animationstart', 'transitionend',
    'pointercancel', 'pointerdown', 'pointerhover', 'pointermove', 'pointerout', 'pointerover', 'pointerup'
  ].forEach(function(type) {
    EventListenerHelper.eventTypes[type] = ['', 'webkit', 'moz', 'ms', 'o']
      .map(function(prefix) {
        return prefix + type;
      });
  });

  var polyfillEventTypesName = function(type, target) {
    var eventTypesPolyfiller = eventTypes[type];
    if(eventTypesPolyfiller === void 0) {
      return type;
    } else {
      var i = 0;
      for(; i < eventTypesPolyfiller.length; i++) {
        if(('on' + eventTypesPolyfiller[i]) in target) {
          return eventTypesPolyfiller[i];
        }
      }

      if(i === eventTypesPolyfiller.length) {
        throw new Error('Not supported type <' + type + '>');
      }
    }
  };



  /**
   * Check supported options
   */
  var supportedOptions = {
    once: false,
    passive: false,
    capture: false
  };


  document.createDocumentFragment().addEventListener('test', function() {}, {
    get once() {
      supportedOptions.once = true;
      return false;
    },
    get passive() {
      supportedOptions.passive = true;
      return false;
    },
    get capture() {
      supportedOptions.capture = true;
      return false;
    }
  });

  // useful shortcuts to detect if options are all/some supported
  supportedOptions.all  = supportedOptions.once && supportedOptions.passive && supportedOptions.capture;
  supportedOptions.some = supportedOptions.once || supportedOptions.passive || supportedOptions.capture;



  /**
   * Check supported events attributes
   */
  var keyCodes = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "Backspace",
    "Tab",
    null,
    null,
    "Numpad5",
    "NumpadEnter",
    null,
    null,
    "ShiftLeft",
    "ControlRight",
    "AltRight",
    "Pause",
    "CapsLock",
    null,
    null,
    null,
    null,
    null,
    null,
    "Escape",
    null,
    null,
    null,
    null,
    "Space",
    "PageUp",
    "PageDown",
    "End",
    "Home",
    "ArrowLeft",
    "ArrowUp",
    "ArrowRight",
    "ArrowDown",
    null,
    null,
    null,
    null,
    "Insert",
    "Delete",
    null,
    "Digit0",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "KeyA",
    "KeyB",
    "KeyC",
    "KeyD",
    "KeyE",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyI",
    "KeyJ",
    "KeyK",
    "KeyL",
    "KeyM",
    "KeyN",
    "KeyO",
    "KeyP",
    "KeyQ",
    "KeyR",
    "KeyS",
    "KeyT",
    "KeyU",
    "KeyV",
    "KeyW",
    "KeyX",
    "KeyZ",
    "KeyY",
    "MetaLeft",
    "MetaRight",
    "ContextMenu",
    null,
    null,
    "Numpad0",
    "Numpad1",
    "Numpad2",
    "Numpad3",
    "Numpad4",
    "Numpad5",
    "Numpad6",
    "Numpad7",
    "Numpad8",
    "Numpad9",
    "NumpadMultiply",
    "NumpadAdd",
    null,
    "NumpadSubtract",
    "NumpadDecimal",
    "NumpadDivide",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "NumLock",
    "ScrollLock",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "BracketLeft",
    null,
    "Comma",
    "Slash",
    "Period",
    "Backquote",
    "BracketRight",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "Minus",
    "Quote",
    "Equal",
    "Semicolon",
    "Backslash",
    null,
    null,
    "IntlBackslash"
  ];

  // window.buildKeyCodes = function() {
  //   window.addEventListener('keydown', function(event) {
  //     if(EventListenerHelper.keyCodes[event.keyCode] && EventListenerHelper.keyCodes[event.keyCode] !== event.code) {
  //       console.warn('Detect same keyCode for 2 different codes : ' + event.code + ' (current) vs ' + EventListenerHelper.keyCodes[event.keyCode] + '(old)');
  //     }
  //     EventListenerHelper.keyCodes[event.keyCode] = event.code;
  //     event.preventDefault();
  //     event.stopPropagation();
  //   });
  // };
  //
  // window.endBuildKeyCodes = function() {
  //   console.log(JSON.stringify(EventListenerHelper.keyCodes, null, '\t'));
  // };



  /**
   * Polyfill listener
   */

    /**
     * Formatter functions
     */
  var getFormattedListener = function(listener) {
    if(typeof listener === 'function') {
      return listener;
    } else if((typeof listener === 'object') && (typeof listener.handleEvent === 'function')) {
      return listener.handleEvent;
    } else {
      // to support Symbol
      return function(event) {
        listener(event);
      };
    }
  };

  var getFormattedOptions = function(options) {
    switch(typeof options) {
      case 'boolean':
        options = { capture: options };
        break;
      case 'undefined':
        options = { capture: false };
        break;
      case 'object':
        break;
      default:
        throw new Error('Unsupported options type for addEventListener');
        break;
    }

    options.once      = (typeof options.once === 'boolean') ? options.once : false;
    options.passive   = (typeof options.passive === 'boolean') ? options.passive : false;
    options.capture   = (typeof options.capture === 'boolean') ? options.capture : false;
    options.polyfill  = (typeof options.polyfill === 'boolean') ? options.polyfill : true;

    return options;
  };

  var getFormattedArguments = function(type, listener, options) {
    return {
      type: type,
      listener:getFormattedListener(listener),
      options: getFormattedOptions(options)
    };
  };


    /**
     * Event listener stack functions
     */
  var registerEventListener = function(target, formattedArguments) {
    var key = formattedArguments.type + '-' + (formattedArguments.options.capture ? '1' : '0');
    if(target.__eventListeners === void 0) {
      target.__eventListeners = {};
    }
    if(arget.__eventListeners[key] === void 0) {
      target.__eventListeners[key] = [];
    }
    target.__eventListeners[key].push(formattedArguments);
  };

  var unregisterEventListener = function(target, formattedArguments) {
    var key = formattedArguments.type + '-' + (formattedArguments.options.capture ? '1' : '0');
    if(
      (target.__eventListeners !==  void 0) &&
      (target.__eventListeners[key] !== void 0)
    ) {
      var map = target.__eventListeners[key];
      for(var i = 0; i < map.length; i++) {
        if(map[i].listener === formattedArguments.listener) {
          map.splice(i, 1);
        }
      }

      if(map.length === 0) {
        delete target.__eventListeners[key];
      }
    }
  };

  var getRegisteredEventListener = function(target, formattedArguments) {
    var key = formattedArguments.type + '-' + (formattedArguments.options.capture ? '1' : '0');
    if(
      (target.__eventListeners !== void 0) &&
      (target.__eventListeners[key] !== void 0)
    ) {
      var map = target.__eventListeners[key];
      for(var i = 0; i < map.length; i++) {
        if(map[i].listener === formattedArguments.listener) {
          return map[i];
        }
      }
    }
    return null;
  };


  var polyfillListenerConstructor = function(constructor) {
    var addEventListener = constructor.prototype.addEventListener;
    constructor.prototype.addEventListener = function(type, listener, options) {
      var formattedArguments      = getFormattedArguments(type, listener, options);
      var registeredEventListener = getRegisteredEventListener(this, formattedArguments);

      if(!registeredEventListener) {

        var vendorArguments = {};


        vendorArguments.type = formattedArguments.options.polyfill ?
          polyfillEventTypesName(formattedArguments.type) :
          formattedArguments.type
        ;

        vendorArguments.listener = function(event) {
            // once
          if(formattedArguments.options.once && !supportedOptions.once) {
            this.removeEventListener(type, listener, options);
          }

            // passive
          if(formattedArguments.options.passive && !supportedOptions.passive) {
            event.preventDefault = function() {
              throw new Error('Unable to preventDefault inside passive event listener invocation.');
            };
          }

            // polyfill
          if(formattedArguments.options.polyfill) {
            event.type = formattedArguments.type;

              // polyfill event attributes
            if(event instanceof KeyboardEvent) {
              if(!('code' in event)) {
                //noinspection JSAnnotator
                event.code = keyCodes[event.keyCode];
              }
            }
          }

          return formattedArguments.listener.call(this, event);
        };

        vendorArguments.options = supportedOptions.some ?
          formattedArguments.options : formattedArguments.options.capture;

        formattedArguments.vendorArguments = vendorArguments;

        // console.log(formattedArguments);

        registerEventListener(this, formattedArguments);

        addEventListener.call(
          this,
          vendorArguments.type,
          vendorArguments.listener,
          vendorArguments.options
        );
      }
    };

    var removeEventListener = constructor.prototype.removeEventListener;
    constructor.prototype.removeEventListener = function(type, listener, options) {
      var formattedArguments      = getFormattedArguments(type, listener, options);
      var registeredEventListener = getRegisteredEventListener(this, formattedArguments);

      if(registeredEventListener) {
        unregisterEventListener(this, formattedArguments);
        removeEventListener.call(
          this,
          registeredEventListener.vendorArguments.type,
          registeredEventListener.vendorArguments.listener,
          registeredEventListener.vendorArguments.options
        );
      } else {
        removeEventListener.call(this, type, listener, options);
      }
    };
  };


  polyfillListenerConstructor(EventTarget);
  if(!(window instanceof EventTarget)) {
    polyfillListenerConstructor(Window);
  }


  // var div = document.createElement('div');
  // document.body.innerHTML = '';
  // document.body.appendChild(div);
  // div.style.height = '500px';
  // div.style.background = 'red';
  //
  // var cb = function(event) {
  //   console.log('click', event);
  // };
  //
  // div.addEventListener('click', cb, { passive: true, once: true, capture: false });
  // div.removeEventListener('click', cb, false);
  // div.addEventListener('click', cb, { passive: true, once: true, capture: true });
  //
  // div.addEventListener('wheel', function(event) {
  //   console.log('wheeliiing', event);
  // }, { once: true });
  //
  // document.addEventListener('pointerlockchange', function(event) {
  //   console.log('pointerlockchange', event);
  // });
})();
