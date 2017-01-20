(function() {

  var EventListenerHelper = {};

  /**
   * Create EventTarget
   */
  EventListenerHelper.polyfillEventTarget = function() {
    if(typeof EventTarget === 'undefined') {
      window.EventTarget = Node;
    }
  };

  /**
   * Check supported types
   */

  EventListenerHelper.prefixEventType = function(type) {
    return ['', 'webkit', 'moz', 'ms', 'o'].map(function(prefix) {
      return prefix + type;
    });
  };

  EventListenerHelper.eventTypes = {
    wheel: ['wheel', 'mousewheel', 'DOMMouseScroll']
  };

  [
    'pointerlockchange', 'pointerlockerror',
    'fullscreenchange', 'fullscreenerror',
    'animationend', 'animationiteration', 'animationstart', 'transitionend',
    'pointercancel', 'pointerdown', 'pointerhover', 'pointermove', 'pointerout', 'pointerover', 'pointerup'
  ].forEach(function(type) {
    EventListenerHelper.eventTypes[type] = EventListenerHelper.prefixEventType(type);
  });


  /**
   * Check supported options
   */
  EventListenerHelper.supportedOptions = {
    once: false,
    passive: false,
    capture: false
  };

  EventListenerHelper.getSupportedOptions = function() {
    document.createDocumentFragment().addEventListener('test', function() {}, {
      get once() {
        EventListenerHelper.supportedOptions.once = true;
        return false;
      },
      get passive() {
        EventListenerHelper.supportedOptions.passive = true;
        return false;
      },
      get capture() {
        EventListenerHelper.supportedOptions.capture = true;
        return false;
      }
    });

    // useful shortcuts to detect if options are all/some supported
    EventListenerHelper.supportedOptions.all  = EventListenerHelper.supportedOptions.once && EventListenerHelper.supportedOptions.passive && EventListenerHelper.supportedOptions.capture;
    EventListenerHelper.supportedOptions.some = EventListenerHelper.supportedOptions.once || EventListenerHelper.supportedOptions.passive || EventListenerHelper.supportedOptions.capture;
  };


  /**
   * Polyfill listener
   */
  EventListenerHelper.getFormattedListener = function(listener) {
    if(typeof listener === 'function') {
      return listener;
    } else if((typeof listener === 'object') && (typeof listener.handleEvent === 'function')) {
      return listener.handleEvent;
    } else {
      throw new Error('Unsupported listener type for addEventListener');
    }
  };

  EventListenerHelper.getFormattedOptions = function(options) {
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

  EventListenerHelper.getFormattedArguments = function(type, listener, options) {
    return {
      type: type,
      listener: EventListenerHelper.getFormattedListener(listener),
      options: EventListenerHelper.getFormattedOptions(options)
    };
  };


  EventListenerHelper.registerEventListener = function(target, formattedArguments) {
    var key = formattedArguments.type + '-' + (formattedArguments.options.capture ? '1' : '0');
    if(typeof target.__eventListeners === 'undefined') {
      target.__eventListeners = {};
    }
    if(typeof target.__eventListeners[key] === 'undefined') {
      target.__eventListeners[key] = [];
    }
    target.__eventListeners[key].push(formattedArguments);
  };

  EventListenerHelper.unregisterEventListener = function(target, formattedArguments) {
    var key = formattedArguments.type + '-' + (formattedArguments.options.capture ? '1' : '0');
    if(
      (typeof target.__eventListeners !== 'undefined') &&
      (typeof target.__eventListeners[key] !== 'undefined')
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

  EventListenerHelper.getRegisteredEventListener = function(target, formattedArguments) {
    var key = formattedArguments.type + '-' + (formattedArguments.options.capture ? '1' : '0');
    if(
      (typeof target.__eventListeners !== 'undefined') &&
      (typeof target.__eventListeners[key] !== 'undefined')
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



  EventListenerHelper.polyfillListener = function(_class) {

    EventListenerHelper.addEventListener = _class.prototype.addEventListener;
    _class.prototype.addEventListener = function(type, listener, options) {
      var formattedArguments      = EventListenerHelper.getFormattedArguments(type, listener, options);
      var registeredEventListener = EventListenerHelper.getRegisteredEventListener(this, formattedArguments);

      if(!registeredEventListener) {

        var vendorArguments = {};


        vendorArguments.type = formattedArguments.type;

        if(formattedArguments.options.polyfill) {
          var eventTypesPolyfiller = EventListenerHelper.eventTypes[formattedArguments.type];
          if(typeof eventTypesPolyfiller !== 'undefined') {
            var i;
            for(i = 0; i < eventTypesPolyfiller.length; i++) {
              if(('on' + eventTypesPolyfiller[i]) in this) {
                vendorArguments.type = eventTypesPolyfiller[i];
                break;
              }
            }

            if(i === eventTypesPolyfiller.length) {
              throw new Error('Not supported type <' + type + '>');
            }
          }
        }

        vendorArguments.listener = function(event) {
          if(formattedArguments.options.once && !EventListenerHelper.supportedOptions.once) {
            this.removeEventListener(type, listener, options);
          }

          if(formattedArguments.options.passive && !EventListenerHelper.supportedOptions.passive) {
            event.preventDefault = function() {
              throw new Error('Unable to preventDefault inside passive event listener invocation.');
            };
          }

          if(formattedArguments.options.polyfill) {
            event.type = formattedArguments.type;
          }

          return formattedArguments.listener.call(this, event);
        };

        if(EventListenerHelper.supportedOptions.some) {
          vendorArguments.options = formattedArguments.options;
        } else {
          vendorArguments.options = formattedArguments.options.capture;
        }

        formattedArguments.vendorArguments = vendorArguments;

        // console.log(formattedArguments);

        EventListenerHelper.registerEventListener(this, formattedArguments);

        EventListenerHelper.addEventListener.call(
          this,
          vendorArguments.type,
          vendorArguments.listener,
          vendorArguments.options
        );
      }
    };

    EventListenerHelper.removeEventListener = _class.prototype.removeEventListener;
    _class.prototype.removeEventListener = function(type, listener, options) {
      var formattedArguments      = EventListenerHelper.getFormattedArguments(type, listener, options);
      var registeredEventListener = EventListenerHelper.getRegisteredEventListener(this, formattedArguments);

      if(registeredEventListener) {
        EventListenerHelper.unregisterEventListener(this, formattedArguments);
        EventListenerHelper.removeEventListener.call(
          this,
          registeredEventListener.vendorArguments.type,
          registeredEventListener.vendorArguments.listener,
          registeredEventListener.vendorArguments.options
        );
      } else {
        EventListenerHelper.removeEventListener.call(this, type, listener, options);
      }
    }

  };

  /**
   * Polyfill all
   */

  EventListenerHelper.polyfillAll = function() {
    EventListenerHelper.polyfillEventTarget();
    EventListenerHelper.getSupportedOptions();
    EventListenerHelper.polyfillListener(EventTarget);
  };


  EventListenerHelper.polyfillAll();

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
