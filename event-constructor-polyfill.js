(function() {
  /**
   * Polyfill creation of custom events
   */

  // ✓, ✗

  /**
   * Polyfill Event
   */
  try {
    var event = new window.Event('event', { bubbles: true, cancelable: true });
  } catch (error) {
    var EventOriginal = window.CustomEvent || window.Event;
    var Event = function(eventName, params) {
      params = params || {};
      var event = document.createEvent('Event');
      event.initEvent(
        eventName,
        (params.bubbles === void 0) ? false : params.bubbles,
        (params.cancelable === void 0) ? false : params.cancelable,
        (params.detail === void 0) ? {} : params.detail
      );
      return event;
    };
    Event.prototype = EventOriginal.prototype;
    window.Event = Event;
  }

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
      return event;
    };
    CustomEvent.prototype = CustomEventOriginal.prototype;
    window.CustomEvent = CustomEvent;
  }


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

      return event;
    };
    MouseEvent.prototype = MouseEventOriginal.prototype;
    window.MouseEvent = MouseEvent;
  }

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

      return event;
    };
    KeyboardEvent.prototype = KeyboardEventOriginal.prototype;
    window.KeyboardEvent = KeyboardEvent;
  }



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

      return event;
    };
    FocusEvent.prototype = FocusEventOriginal.prototype;
    window.FocusEvent = FocusEvent;
  }

})();