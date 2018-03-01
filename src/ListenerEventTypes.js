(function(EventListenerInterceptor) {
  /**
   * Event listener type support
   */

  EventListenerInterceptor.isSupportedOnEvent = function(target, type) {
    return (('on' + type) in target);
  };

  EventListenerInterceptor.isSupportedTransitionEvent = function(target, type) {
    return EventListenerInterceptor.isSupportedOnEvent(target, type) || (('style' in target) && (target.style['transition'] !== void 0));
  };

  EventListenerInterceptor.isSupportedFullScreenEvent = function(target, type) {
    if(EventListenerInterceptor.isSupportedOnEvent(target, type)) {
      return true;
    } else {
      if(/^ms/.test(type.toLowerCase())) {
        return 'msRequestFullscreen' in document.body;
      } else if(/^moz/.test(type)) {
        return 'mozRequestFullscreen' in document.body;
      } else if(/^webkit/.test(type)) {
        return 'webkitRequestFullscreen' in document.body;
      } else {
        return false;
      }
    }
  };


  EventListenerInterceptor.generateEventTypes = function() {
    var _this = this;

    this.eventTypes = {}; // map of types that resolved to something else
    this.vendorPrefixes = ['', 'webkit', 'moz', 'ms', 'o'];


    this.eventTypes['wheel'] = ['wheel', 'mousewheel', 'DOMMouseScroll'].map(function(type) {
      return { type: type, isSupported: _this.isSupportedOnEvent } ;
    });

    this.eventTypes['fullscreenchange'] = ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange', 'msfullscreenchange'].map(function(type) {
      return { type: type, isSupported: _this.isSupportedFullScreenEvent } ;
    });

    this.eventTypes['fullscreenerror'] = ['fullscreenerror', 'mozfullscreenerror', 'webkitfullscreenerror', 'MSFullscreenError', 'msfullscreenerror'].map(function(type) {
      return { type: type, isSupported: _this.isSupportedFullScreenEvent } ;
    });

    [
      'pointerlockchange', 'pointerlockerror',
      'animationstart', 'animationiteration', 'animationend',
      'pointercancel', 'pointerdown', 'pointerhover', 'pointermove', 'pointerout', 'pointerover', 'pointerup'
    ].forEach(function(type) {
      _this.eventTypes[type] = _this.vendorPrefixes
        .map(function(prefix) {
          return { type: (prefix + type), isSupported: _this.isSupportedOnEvent } ;
        });
    });

    ['transitionstart', 'transitionrun', 'transitionend'].forEach(function(type) {
      _this.eventTypes[type] = _this.vendorPrefixes
        .map(function(prefix) {
          return { type: (prefix + type), isSupported: _this.isSupportedTransitionEvent } ;
        });
    });
  };

  EventListenerInterceptor.getSupportedEventType = function(target, type) {
    var types = this.eventTypes[type];
    if(types === void 0) {
      return type;
    } else {
      var _type;
      for(var i = 0; i < types.length; i++) {
        _type = types[i];
        if(_type.isSupported(target, _type.type)) {
          // console.log('use : ' + eventTypesPolyfiller[i].type);
          return _type.type;
        }
      }

      // this.error(new Error('Event listener type ' + String(type) + ' on ' + String(target) + ' is not supported by current environment'));
      return type;
    }
  };


  EventListenerInterceptor.polyfillListenerEventTypes = function() {
    this.generateEventTypes();

    var _this = this;

    this.interceptAll({
      add: function(normalizedArguments) {
        normalizedArguments.polyfilled.type = _this.getSupportedEventType(this, normalizedArguments.polyfilled.type);
      }
    });
  };


  EventListenerInterceptor.polyfillListenerEventTypes();

})(require('./EventListenerInterceptor.js'));