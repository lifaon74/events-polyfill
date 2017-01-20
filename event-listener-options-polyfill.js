(function() {

  /**
   * Polyfill addEventListener options :
   *  - once
   *  - passive
   *  - capture
   */

  /**
   * Create EventTarget
   */
  if(typeof EventTarget === 'undefined') {
    var EventTarget = Element;
    window.EventTarget = EventTarget;
  }

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
   * Polyfill options
   */
  if(!supportedOptions.all) {
    var getFormattedListener = function(listener) {
      if(typeof listener === 'function') {
        return listener;
      } else if((typeof listener === 'object') && (typeof listener.handleEvent === 'function')) {
        return listener.handleEvent;
      } else {
        throw new Error('Unsupported listener type for addEventListener');
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

      options.once    = (typeof options.once === 'boolean') ? options.once : false;
      options.passive = (typeof options.passive === 'boolean') ? options.passive : false;
      options.capture = (typeof options.capture === 'boolean') ? options.capture : false;

      return options;
    };

    var getFormattedArguments = function(type, listener, options) {
      return {
        type: type,
        listener: getFormattedListener(listener),
        options: getFormattedOptions(options)
      };
    };
    

    var registerEventListener = function(target, formattedArguments) {
      var key = formattedArguments.type + '-' + (formattedArguments.options.capture ? '1' : '0');
      if(typeof target.__eventListeners === 'undefined') {
        target.__eventListeners = {};
      }
      if(typeof target.__eventListeners[key] === 'undefined') {
        target.__eventListeners[key] = [];
      }
      target.__eventListeners[key].push(formattedArguments);
    };

    var unregisterEventListener = function(target, formattedArguments) {
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

    var getRegisteredEventListener = function(target, formattedArguments) {
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


    var addEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      var formattedArguments      = getFormattedArguments(type, listener, options);
      var registeredEventListener = getRegisteredEventListener(this, formattedArguments);

      if(!registeredEventListener) {
        formattedArguments.eventListenerArguments = {
          type: formattedArguments.type,
          listener: null,
          options: supportedOptions.some ? formattedArguments.options : formattedArguments.options.capture
        };

        formattedArguments.eventListenerArguments.listener = function(event) {
          if(formattedArguments.options.once && !supportedOptions.once) {
            this.removeEventListener(type, listener, options);
          }

          if(formattedArguments.options.passive && !supportedOptions.passive) {
            event.preventDefault = function() {
              throw new Error('Unable to preventDefault inside passive event listener invocation.');
            };
          }

          return formattedArguments.listener.call(this, event);
        };

        registerEventListener(this, formattedArguments);

        addEventListener.call(
          this,
          formattedArguments.eventListenerArguments.type,
          formattedArguments.eventListenerArguments.listener,
          formattedArguments.eventListenerArguments.options
        );
      }
    };

    var removeEventListener = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
      var formattedArguments = getFormattedArguments(type, listener, options);
      var registeredEventListener = getRegisteredEventListener(this, formattedArguments);

      if(registeredEventListener) {
        unregisterEventListener(this, formattedArguments);
        removeEventListener.call(
          this,
          registeredEventListener.eventListenerArguments.type,
          registeredEventListener.eventListenerArguments.listener,
          registeredEventListener.eventListenerArguments.options
        );
      } else {
        removeEventListener.call(this, type, listener, options);
      }
    }

  }

  // var div = document.createElement('div');
  // document.body.innerHTML = '';
  // document.body.appendChild(div);
  // div.style.height = '500px';
  // div.style.background = 'red';
  // var cb = function(event) {
  //   console.log('click', event);
  // };
  //
  // div.addEventListener('click', cb, { passive: true, once: true, capture: false });
  // div.removeEventListener('click', cb, false);
  // div.addEventListener('click', cb, { passive: true, once: true, capture: true });
})();
