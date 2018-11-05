(function(ApplyThisPrototype) {
  /**
   * Polyfill CustomEvent
   */
  try {
    var event = new window.CustomEvent('event', { bubbles: true, cancelable: true });
  } catch (error) {
    var CustomEventOriginal = window.CustomEvent || window.Event;
    var CustomEvent = function(eventName, params) {
      params = params || {};
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent(
        eventName,
        (params.bubbles === void 0) ? false : params.bubbles,
        (params.cancelable === void 0) ? false : params.cancelable,
        (params.detail === void 0) ? {} : params.detail
      );
      ApplyThisPrototype(event, this);
      return event;
    };
    CustomEvent.prototype = CustomEventOriginal.prototype;
    window.CustomEvent = CustomEvent;
  }
})(require('./ApplyThisPrototype.js'));