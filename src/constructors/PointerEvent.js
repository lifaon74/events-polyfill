(function(ApplyThisPrototype) {
  /**
   * Polyfill PointerEvent
   *  - pointerId ✓
   *  - width ✓
   *  - height ✓
   *  - pressure ✓
   *  - tangentialPressure ✓
   *  - tiltX ✓
   *  - tiltY ✓
   *  - twist ✓
   *  - pointerType ✓
   *  - isPrimary ✓
   */
  try {
    var event = new window.PointerEvent('event', { bubbles: true, cancelable: true });
  } catch (error) {
    var PointerEventOriginal = window.PointerEvent || window.Event;
    var PointerEvent = function(eventName, params) {
      params = params || {};
      var event = document.createEvent('PointerEvent');

      // https://msdn.microsoft.com/en-us/library/jj192039(v=vs.85).aspx
      event.initPointerEvent(
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
        (params.relatedTarget === void 0) ? null : params.relatedTarget,

        (params.offsetX  === void 0) ? 0 : params.offsetX,
        (params.offsetY  === void 0) ? 0 : params.offsetY,
        (params.width === void 0) ? 1 : params.width,
        (params.height === void 0) ? 1 : params.height,
        (params.pressure === void 0) ? 0 : params.pressure,
        (params.twist === void 0) ? 0 : params.twist,
        (params.tiltX === void 0) ? 0 : params.tiltX,
        (params.tiltY === void 0) ? 0 : params.tiltY,
        (params.pointerId === void 0) ? 0 : params.pointerId,
        (params.pointerType === void 0) ? '' : params.pointerType,
        (params.hwTimestamp === void 0) ? 0 : params.hwTimestamp,
        (params.isPrimary === void 0) ? false : params.isPrimary
      );

      event.tangentialPressure = (params.tangentialPressure === void 0) ? 0 : params.tangentialPressure;

      ApplyThisPrototype(event, this);

      return event;
    };

    PointerEvent.prototype = PointerEventOriginal.prototype;

    var rotationDescriptor = Object.getOwnPropertyDescriptor(PointerEvent.prototype, 'rotation');
    if (rotationDescriptor) {
      Object.defineProperty(PointerEvent.prototype, 'twist', rotationDescriptor);
    }

    window.PointerEvent = PointerEvent;
  }
})(require('./ApplyThisPrototype.js'));