(function(ApplyThisPrototype) {
  // ✓, ✗

  /**
   * Polyfill Event
   */
  try {
    var event = new window.Event('event', { bubbles: true, cancelable: true });
  } catch(error) {
    var EventOriginal = window.Event;
    var Event = function(eventName, params) {
      params = params || {};
      var event = document.createEvent('Event');
      event.initEvent(
        eventName,
        (params.bubbles === void 0) ? false : params.bubbles,
        (params.cancelable === void 0) ? false : params.cancelable,
        (params.detail === void 0) ? {} : params.detail
      );
      ApplyThisPrototype(event, this);
      return event;
    };
    Event.prototype = EventOriginal.prototype;
    window.Event = Event;
  }
})(require('./ApplyThisPrototype.js'));