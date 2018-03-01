module.exports = (function() {

  if(typeof EventTarget === 'undefined') {
    window.EventTarget = Node;
  }

  /**
   * Event listener interceptor
   */

  var EventListenerInterceptor = {
    interceptors: [] // { target: EventTarget, interceptors: [{ add: Function, remove: Function }, ...] }
  };


  /**
   * Returns if exists a previously registered listener from a target and the normalized arguments
   * @param target
   * @param normalizedArguments
   * @return {*}
   */
  EventListenerInterceptor.getRegisteredEventListener = function(target, normalizedArguments) {
    var key = normalizedArguments.type + '-' + (normalizedArguments.options.capture ? '1' : '0');
    if(
      (target.__eventListeners !== void 0) &&
      (target.__eventListeners[key] !== void 0)
    ) {
      var map = target.__eventListeners[key];
      for(var i = 0; i < map.length; i++) {
        if(map[i].listener === normalizedArguments.listener) {
          return map[i];
        }
      }
    }
    return null;
  };

  /**
   * Registers a listener on a target with some options
   * @param target
   * @param normalizedArguments
   */
  EventListenerInterceptor.registerEventListener = function(target, normalizedArguments) {
    var key = normalizedArguments.type + '-' + (normalizedArguments.options.capture ? '1' : '0');

    if(target.__eventListeners === void 0) {
      target.__eventListeners = {};
    }

    if(target.__eventListeners[key] === void 0) {
      target.__eventListeners[key] = [];
    }

    target.__eventListeners[key].push(normalizedArguments);
  };

  /**
   * Unregisters a listener on a target with some options
   * @param target
   * @param normalizedArguments
   */
  EventListenerInterceptor.unregisterEventListener = function(target, normalizedArguments) {
    var key = normalizedArguments.type + '-' + (normalizedArguments.options.capture ? '1' : '0');
    if(
      (target.__eventListeners !==  void 0) &&
      (target.__eventListeners[key] !== void 0)
    ) {
      var map = target.__eventListeners[key];
      for(var i = 0; i < map.length; i++) {
        if(map[i].listener === normalizedArguments.listener) {
          map.splice(i, 1);
        }
      }

      if(map.length === 0) {
        delete target.__eventListeners[key];
      }
    }
  };



  EventListenerInterceptor.normalizeListenerCallback = function(listener) {
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

  EventListenerInterceptor.normalizeListenerOptions = function(options) {
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
    }

    options.once      = Boolean(options.once);
    options.passive   = Boolean(options.passive);
    options.capture   = Boolean(options.capture);

    return options;
  };

  EventListenerInterceptor.normalizeListenerArguments = function(type, listener, options) {
    return {
      type: type,
      listener: this.normalizeListenerCallback(listener),
      options: this.normalizeListenerOptions(options)
    };
  };



  EventListenerInterceptor.intercept = function(target, interceptors) {
    // get an interceptor with this target or null
    var interceptor = null;
    for (var i = 0; i < this.interceptors.length; i++) {
      if(this.interceptors[i].target === target) {
        interceptor = this.interceptors[i];
      }
    }

    // if no interceptor already set
    if (interceptor === null) {
      interceptor = { target: target, interceptors: [interceptors] };
      this.interceptors.push(interceptor);

      this.interceptAddEventListener(target, interceptor);
      this.interceptRemoveEventListener(target, interceptor);
    } else { // if an interceptor already set, simply add interceptors to the list
      interceptor.interceptors.push(interceptors);
    }

    // var release = function() {
    //   target.prototype.addEventListener = addEventListener;
    //   target.prototype.removeEventListener = removeEventListener;
    // };
    // this.interceptors.push(release);
    // return release;
  };

  EventListenerInterceptor.interceptAddEventListener = function(target, interceptor) {
    var _this = this;

    var addEventListener = target.prototype.addEventListener;
    target.prototype.addEventListener = function(type, listener, options) {
      var normalizedArguments = _this.normalizeListenerArguments(type, listener, options);
      var registeredEventListener = _this.getRegisteredEventListener(this, normalizedArguments);

      if (!registeredEventListener) {

        normalizedArguments.polyfilled = {
          type: normalizedArguments.type,
          listener: normalizedArguments.listener,
          options: {
            capture: normalizedArguments.options.capture,
            once: normalizedArguments.options.once,
            passive: normalizedArguments.options.passive
          }
        };

        for (var i = 0; i < interceptor.interceptors.length; i++) {
          var interceptors = interceptor.interceptors[i];
          if (typeof interceptors.add === 'function') {
            interceptors.add(normalizedArguments);
          }
        }

        // console.log('normalizedArguments', normalizedArguments.polyfilled);

        _this.registerEventListener(this, normalizedArguments);

        addEventListener.call(
          this,
          normalizedArguments.polyfilled.type,
          normalizedArguments.polyfilled.listener,
          normalizedArguments.polyfilled.options
        );
      }
    };

    return function() {
      target.prototype.addEventListener = addEventListener;
    };
  };

  EventListenerInterceptor.interceptRemoveEventListener = function(target, interceptor) {
    var _this = this;

    var removeEventListener = target.prototype.removeEventListener;
    target.prototype.removeEventListener = function(type, listener, options) {
      var normalizedArguments = _this.normalizeListenerArguments(type, listener, options);
      var registeredEventListener = _this.getRegisteredEventListener(this, normalizedArguments);

      if (registeredEventListener) {
        _this.unregisterEventListener(this, normalizedArguments);
        removeEventListener.call(
          this,
          registeredEventListener.polyfilled.type,
          registeredEventListener.polyfilled.listener,
          registeredEventListener.polyfilled.options
        );
      } else {
        removeEventListener.call(this, type, listener, options);
      }
    };

    return function() {
      target.prototype.removeEventListener = removeEventListener;
    };
  };

  EventListenerInterceptor.interceptAll = function(interceptors) {
    this.intercept(EventTarget, interceptors);
    if(!(window instanceof EventTarget)) {
      this.intercept(Window, interceptors);
    }
  };

  EventListenerInterceptor.releaseAll = function() {
    for(var i = 0, l = this.interceptors.length; i < l; i++) {
      this.interceptors();
    }
  };


  EventListenerInterceptor.error = function(error) {
    // throw error;
    console.error(error);
  };

  return EventListenerInterceptor;
})();