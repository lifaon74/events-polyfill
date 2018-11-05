(function(ApplyThisPrototype) {
  /**
   * Polyfill FocusEvent : https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/FocusEvent
   *  - relatedTarget ✓
   */
  try {
    var event = new window.FocusEvent('event', { bubbles: true, cancelable: true });
  } catch (error) {
    var FocusEventOriginal = window.FocusEvent || window.Event;
    var FocusEvent = function(eventName, params) {
      params = params || {};
      var event = document.createEvent('FocusEvent');

      // https://msdn.microsoft.com/en-us/library/ff975954(v=vs.85).aspx
      event.initFocusEvent(
        eventName,
        (params.bubbles === void 0) ? false : params.bubbles,
        (params.cancelable === void 0) ? false : params.cancelable,
        (params.view === void 0) ? window : params.view,
        (params.detail === void 0) ? {} : params.detail,
        (params.relatedTarget === void 0) ? null : params.relatedTarget
      );

      ApplyThisPrototype(event, this);

      return event;
    };
    FocusEvent.prototype = FocusEventOriginal.prototype;
    window.FocusEvent = FocusEvent;
  }
})(require('./ApplyThisPrototype.js'));