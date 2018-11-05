module.exports = (function() {
  return function ApplyThisPrototype(event, target) {
    if ((typeof target === 'object') && (target !== null)) {
      var proto = Object.getPrototypeOf(target);
      var property;

      for (property in proto) {
        if (!(property in event)) {
          var descriptor = Object.getOwnPropertyDescriptor(proto, property);
          if (descriptor) {
            Object.defineProperty(event, property, descriptor);
          }
        }
      }

      for (property in target) {
        if (!(property in event)) {
          event[property] = target[property];
        }
      }
    }
  }
})();
