(function(EventListenerInterceptor) {
  /**
   * Event listener options support
   */

  EventListenerInterceptor.detectSupportedOptions = function() {
    var _this = this;

    this.supportedOptions = {
      once: false,
      passive: false,
      capture: false,

      all: false,
      some: false
    };

    document.createDocumentFragment().addEventListener('test', function() {}, {
      get once() {
        _this.supportedOptions.once = true;
        return false;
      },
      get passive() {
        _this.supportedOptions.passive = true;
        return false;
      },
      get capture() {
        _this.supportedOptions.capture = true;
        return false;
      }
    });

    // useful shortcuts to detect if options are all/some supported
    this.supportedOptions.all  = this.supportedOptions.once && this.supportedOptions.passive && this.supportedOptions.capture;
    this.supportedOptions.some = this.supportedOptions.once || this.supportedOptions.passive || this.supportedOptions.capture;
  };

  EventListenerInterceptor.polyfillListenerOptions = function() {
    this.detectSupportedOptions();
    if (!this.supportedOptions.all) {
      var _this = this;

      this.interceptAll({
        add: function(normalizedArguments) {
          // console.log('intercepted', normalizedArguments);

          var once = normalizedArguments.options.once && !_this.supportedOptions.once;
          var passive = normalizedArguments.options.passive && !_this.supportedOptions.passive;

          if (once || passive) {
            var listener = normalizedArguments.polyfilled.listener;

            normalizedArguments.polyfilled.listener = function(event) {
              if(once) {
                this.removeEventListener(normalizedArguments.type, normalizedArguments.listener, normalizedArguments.options);
              }

              if(passive) {
                event.preventDefault = function() {
                  throw new Error('Unable to preventDefault inside passive event listener invocation.');
                };
              }

              return listener.call(this, event);
            };
          }

          if (!_this.supportedOptions.some) {
            normalizedArguments.polyfilled.options = normalizedArguments.options.capture;
          }
        }
      });
    }
  };


  EventListenerInterceptor.polyfillListenerOptions();


  // var onclick = function() {
  //   console.log('click');
  // };

  // document.body.addEventListener('click', onclick, false);
  // document.body.addEventListener('click', onclick, { once: true });
  // document.body.addEventListener('click', onclick, { once: true });
  // document.body.addEventListener('click', onclick, false);
  // document.body.addEventListener('click', onclick, false);

})(require('./EventListenerInterceptor.js'));