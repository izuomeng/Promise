function Promise(handler) {
  this.next = null
  this.reject = null
  if (typeof handler === 'function') {
    var self = this
    handler(function() {
      var args = arguments
      self.next.apply(self, args)
    })
  }
}
Promise.prototype = {
  constructor: Promise,
  then: function(resolve) {
    this.next = resolve
  },
  catch: function() {

  }
}

var a = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve(123)
  }, 2000)
})
a.then(function(num) {
  console.log('time to go! ' + num)
})
