function Promise(handler) {
  const ref = this
  this.status = 'pending'
  this.next = []
  const _resolve = (p, ref, cb) => {
    p.then((value) => {
      cb(value)
    })
    p.next = ref.next
  }
  const _resolveNext = (ref, nValue) => {
    if (ref.next) {
      if (!(nValue && nValue.constructor && nValue.constructor.name == 'Promise')) {
        resolveNext(ref.next, nValue)
      } else {
        _resolve(nValue, ref, (nnValue) => {
          resolveNext(ref.next, nnValue)
        })
      }
    }
  }
  const resolveNext = (ref, value) => {
    ref.status = 'resolved'
    if (ref.handler) {
      try {
        var nValue = ref.handler(value)
        _resolveNext(ref, nValue)
      } catch (e) {
        rejectNext(ref, e)
      }
    }
  }
  const rejectNext = (ref, reason) => {
    if (!ref) {
      console.log('UnhandledPromiseRejectionWarning:', reason)
    } else {
      ref.status = 'rejected'
      if (ref.errorHandler) {
        try {
          var nValue = ref.errorHandler(reason)
          _resolveNext(ref, nValue)
        } catch (e) {
          rejectNext(ref.next, e)
        }
      } else {
        rejectNext(ref.next, reason)
      }
    }
  }
  const resolve = (value) => {
    ref.status = 'resolved'
    if (ref.next && ref.next.length > 0) {
      ref.next.forEach((promise) => {
        resolveNext(promise, value)
      })
    }
  }

  const reject = (reason) => {
    ref.status = 'rejected'
    if (ref.next) {
      rejectNext(ref.next, reason)
    }
  }
  if (handler && handler.constructor && handler.constructor.name == 'Function') {
    setTimeout(() => {
      try {
        handler(resolve, reject)
      } catch (e) {
        reject(e)
      }
    }, 0)
  }
}

Promise.prototype = {
  constructor: Promise,
  then: function(handler, errorHandler) {
    var p = new Promise()
    if (handler) {
      p.handler = handler
    }
    if (errorHandler) {
      p.errorHandler = errorHandler
    }
    this.next.push(p)
    return p
  },
  catch: function(errorHandler) {
    return this.then((value) => {
      return value
    }, errorHandler)
  }
}
Promise.resolve = function(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value)
    }, 0)
  })
}
Promise.reject = function(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(value)
    }, 0)
  })
}

// test
var a = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(123)
  }, 2000)
})
a.then(function (num) {
  console.log('time to go! ' + num)
})