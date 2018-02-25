export const mix = (superClass) => new MixinBuilder(superClass)

class MixinBuilder {
	constructor(superClass) {
		this.superClass = superClass
	}

	with(...mixins) {
		return mixins.reduce((c, mixin) => mixin(c), this.superClass)
	}
}

export const isTypeOf = (val, type) => {
	switch (type) {
		case 'object':
			return Object.prototype.toString.call(val) === "[object Object]"

		case 'string':
			return Object.prototype.toString.call(val) === "[object String]"

		case 'array':
			return Array.isArray(val)
			//return Object.prototype.toString.call(val) === "[object Array]"

		case 'function':
			return typeof(val) === 'function'

		case 'integer':
			return Number.isInteger(val)

		case 'element':
			return Object.prototype.toString.call(val) === "[object HTMLDivElement]"

		case 'boolean':
			return typeof(val) === 'boolean'
	}
}

export const flatten = (data) => {
  const result = []

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result.push(prop + '.' + cur)
    } else if (isTypeOf(cur, 'array')) {
      for (let i = 0, l = cur.length; i < l; i++) {
        recurse(cur[i], prop)
      }
    } else {
      for (let p in cur) {
        recurse(cur[p], prop ? prop + '.' + p : p)
      }
    }
  }

  recurse(data, '')
  return result
}

export const validate = (options: Object, validation: Object) => {
	Object.keys(validation).forEach(name => {
		const optValue = validation[name]
		const isOptValueObj = isTypeOf(optValue, 'object')

		const isValueEmpty = typeof options[name] === 'undefined'

		if (optValue.type && typeof optValue.default === 'undefined' && !isTypeOf(options[name], optValue.type)) {
			throw new TypeError(`${name} not type of ${optValue.type}`)
		} else if (!isOptValueObj && !isValueEmpty && !isTypeOf(options[name], optValue)) {
			throw new TypeError(`${name} not type of ${optValue}`)
		} else if (isOptValueObj && optValue.required && isValueEmpty) {
			throw new TypeError(`${name} is required`)
		}

		const nextValue = () => {
			const value = isOptValueObj ? optValue.default : null

			return typeof value === 'function' ? value() : value
		}

		options[name] = !isValueEmpty ? options[name] : nextValue()
	})

	return Object.freeze(options)
}

export const getRandomInt = (min: Number, max: Number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const isObject = (val: Object) => isTypeOf(val, 'object')
export const isString = (val: String) => isTypeOf(val, 'string')
export const isArray = (val: Array) => isTypeOf(val, 'array')
export const isInteger = (val: Number) => isTypeOf(val, 'integer')
export const isElement = (val: Object) => isTypeOf(val, 'element')
export const isBoolean = (val: Boolean) => isTypeOf(val, 'boolean')
export const isFunc = (val: Boolean) => isTypeOf(val, 'function')
