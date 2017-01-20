(function() {
  /**
   * Polyfill creation of custom events
   */


  /**
   * Polyfill CustomEvent
   */
  try {
    var event = new window.CustomEvent('event', { bubbles: true, cancelable: true });
  } catch (error) {
    var CustomEvent = function(eventName, params) {
      params = params || {};
      params.bubbles    = (typeof params.bubbles === 'boolean') ? params.bubbles : false;
      params.cancelable = (typeof params.cancelable === 'boolean') ? params.cancelable : false;
      params.detail     = params.detail || {};

      var event = document.createEvent('CustomEvent');
      event.initCustomEvent(
        eventName,
        params.bubbles,
        params.cancelable,
        params.detail
      );
      return event;
    };
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }


  /**
   * Polyfill MouseEvent
   */
  try {
    var event = new window.MouseEvent('event', { bubbles: true, cancelable: true });
  } catch (error) {
    var MouseEvent = function(eventName, params) {
      params = params || {};
      params.bubbles    = (typeof params.bubbles === 'boolean') ? params.bubbles : false;
      params.cancelable = (typeof params.cancelable === 'boolean') ? params.cancelable : false;
      params.view       = params.view || window;
      params.detail     = (typeof params.detail === 'number') ? params.detail : 1;
      params.screenX    = (typeof params.screenX === 'number') ? params.screenX : 0;
      params.screenY    = (typeof params.screenY === 'number') ? params.screenY : 0;
      params.clientX    = (typeof params.clientX === 'number') ? params.clientX : 0;
      params.clientY    = (typeof params.clientY === 'number') ? params.clientY : 0;
      params.ctrlKey    = (typeof params.clientY === 'boolean') ? params.ctrlKey : false;
      params.altKey     = (typeof params.altKey === 'boolean') ? params.altKey : false;
      params.shiftKey   = (typeof params.shiftKey === 'boolean') ? params.shiftKey : false;
      params.metaKey    = (typeof params.metaKey === 'boolean') ? params.metaKey : false;
      params.button     = (typeof params.button === 'number') ? params.button : 1;

      params.relatedTarget = params.relatedTarget || null;

      var event = document.createEvent('MouseEvent');
      event.initMouseEvent(
        eventName,
        params.bubbles,
        params.cancelable,
        params.view,
        params.detail,
        params.screenX,
        params.screenY,
        params.clientX,
        params.clientY,
        params.ctrlKey,
        params.altKey,
        params.shiftKey,
        params.metaKey,
        params.button,
        params.relatedTarget
      );
      return event;
    };
    MouseEvent.prototype = window.Event.prototype;
    window.MouseEvent = MouseEvent;
  }

  /**
   * Polyfill KeyboardEvent
   */
  try {
    var event = new window.KeyboardEvent('event', { bubbles: true, cancelable: true });
  } catch (error) {
    var KeyboardEvent = function(eventName, params) {
      params = params || {};
      params.bubbles    = (typeof params.bubbles === 'boolean') ? params.bubbles : false;
      params.cancelable = (typeof params.cancelable === 'boolean') ? params.cancelable : false;
      params.view       = params.view || window;
      params.ctrlKey    = (typeof params.clientY === 'boolean') ? params.ctrlKey : false;
      params.altKey     = (typeof params.altKey === 'boolean') ? params.altKey : false;
      params.shiftKey   = (typeof params.shiftKey === 'boolean') ? params.shiftKey : false;
      params.metaKey    = (typeof params.metaKey === 'boolean') ? params.metaKey : false;
      params.keyCode    = (typeof params.button === 'number') ? params.keyCode : 0;
      params.charCode   = (typeof params.charCode === 'number') ? params.charCode : 0;


      var event = document.createEvent('KeyboardEvent');
      event.iniKeyEvent(
        eventName,
        params.bubbles,
        params.cancelable,
        params.view,
        params.ctrlKey,
        params.altKey,
        params.shiftKey,
        params.metaKey,
        params.keyCode,
        params.charCode
      );
      return event;
    };
    KeyboardEvent.prototype = window.Event.prototype;
    window.KeyboardEvent = KeyboardEvent;
  }
})();