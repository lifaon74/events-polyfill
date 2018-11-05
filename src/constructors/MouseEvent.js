(function(ApplyThisPrototype) {
  /**
   * Polyfill MouseEvent : https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent
   *  - screenX ✓
   *  - screenY ✓
   *  - clientX ✓
   *  - clientY ✓
   *  - ctrlKey ✓
   *  - shiftKey ✓
   *  - altKey ✓
   *  - metaKey ✓
   *  - button ✓
   *  - buttons ✓
   *  - region ✓
   */
  try {
    var event = new window.MouseEvent('event', { bubbles: true, cancelable: true });
  } catch (error) {
    var MouseEventOriginal = window.MouseEvent || window.Event;
    var MouseEvent = function(eventName, params) {
      params = params || {};
      var event = document.createEvent('MouseEvent');

      // https://msdn.microsoft.com/en-us/library/ff975292(v=vs.85).aspx
      event.initMouseEvent(
        eventName,
        (params.bubbles === void 0) ? false : params.bubbles,
        (params.cancelable === void 0) ? false : params.cancelable,
        (params.view === void 0) ? window : params.view,
        (params.detail === void 0) ? 0 : params.detail,
        (params.screenX === void 0) ? 0 : params.screenX,
        (params.screenY === void 0) ? 0 : params.screenY,
        (params.clientX === void 0) ? 0 : params.clientX,
        (params.clientY === void 0) ? 0 : params.clientY,
        (params.ctrlKey === void 0) ? false : params.ctrlKey,
        (params.altKey === void 0) ? false : params.altKey,
        (params.shiftKey === void 0) ? false : params.shiftKey,
        (params.metaKey === void 0) ? false : params.metaKey,
        (params.button === void 0) ? 0 : params.button,
        (params.relatedTarget === void 0) ? null : params.relatedTarget
      );

      event.buttons = (params.buttons === void 0) ? 0 : params.buttons;
      event.region  = (params.region === void 0) ? null : params.region;

      ApplyThisPrototype(event, this);

      return event;
    };
    MouseEvent.prototype = MouseEventOriginal.prototype;
    window.MouseEvent = MouseEvent;
  }
})(require('./ApplyThisPrototype.js'));