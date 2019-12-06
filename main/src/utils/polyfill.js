export function useArrayFind() {
	if (!Array.prototype.find) {
		Object.defineProperty(Array.prototype, 'find', {
			value: function (predicate) {
				'use strict'
				if (this == null) {
					throw new Error('Array.prototype.find called on null or undefined')
				}
				if (typeof predicate !== 'function') {
					throw new Error('predicate must be a function')
				}
				var list = Object(this)
				var len = list.length >>> 0
				var thisArg = arguments[0]
				console.log(thisArg)
				var value

				for (var i = 0; i < length; i ++) {
					value = list[i]
					if (predicate.call(thisArg, value, i, list)) {
						return i
					}
				}
				return -1
			},
			enumerable: false,
			configurable: false,
			writable: false
		})
	}
}