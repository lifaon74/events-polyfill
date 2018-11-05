(function(ApplyThisPrototype) {
  /**
   * Polyfill KeyboardEvent : https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
   *  - key ✓
   *  - char ✓
   *  - code ✓
   *  - location ✓
   *  - ctrlKey ✓
   *  - shiftKey ✓
   *  - altKey ✓
   *  - metaKey ✓
   *  - repeat ✓
   *  - isComposing ✗
   *  - charCode ✓
   *  - keyCode ✓
   *  - which ✓
   */
  try {
    var event = new window.KeyboardEvent('event', { bubbles: true, cancelable: true });
  } catch (error) {
    var KeyboardEventOriginal = window.KeyboardEvent || window.Event;
    var KeyboardEvent = function(eventName, params) {
      params = params || {};
      var event = document.createEvent('KeyboardEvent');

      // https://msdn.microsoft.com/en-us/library/ff975297(v=vs.85).aspx
      event.initKeyboardEvent(
        eventName,
        (params.bubbles === void 0) ? false : params.bubbles,
        (params.cancelable === void 0) ? false : params.cancelable,
        (params.view === void 0) ? window : params.view,
        (params.key === void 0) ? '' : params.key,
        (params.location === void 0) ? 0 : params.location,
        ((params.ctrlKey === true) ? 'Control ' : '') +
        ((params.altKey === true) ? 'Alt ' : '') +
        ((params.shiftKey === true) ? 'Shift ' : '') +
        ((params.metaKey === true) ? 'Meta ' : ''),
        (params.repeat === void 0) ? false : params.repeat,
        (params.locale === void 0) ? navigator.language : params.locale
      );

      event.keyCode   = (params.keyCode === void 0) ? 0 : params.keyCode;
      event.code      = (params.code === void 0) ? '' : params.code;
      event.charCode  = (params.charCode === void 0) ? 0 : params.charCode;
      event.char      = (params.charCode === void 0) ? '' : params.charCode;
      event.which     = (params.which === void 0) ? 0 : params.which;

      ApplyThisPrototype(event, this);

      return event;
    };
    KeyboardEvent.prototype = KeyboardEventOriginal.prototype;
    window.KeyboardEvent = KeyboardEvent;
  }

})(require('./ApplyThisPrototype.js'));