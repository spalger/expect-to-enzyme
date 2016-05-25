import isEqual from 'lodash.isequal'
import isRegExp from 'lodash.isregexp'

const debug = val => {
  if (val && val.debug) {
    return {
      inspect() {
        return val.debug()
      },
    }
  }

  return val
}

const startChain = (setup) => {
  const tests = []

  const combo = di => {
    const sub = setup(tests, di.actual)

    for (const test of tests) {
      const fail = test({ ...di, actual: sub })
      if (fail) return fail
    }

    return undefined
  }

  combo.and = test => {
    tests.push(test)
    return combo
  }

  return combo
}

export const findSome = (finder, n) =>
  startChain((tests, actual) => {
    const sub = actual.find(finder)

    if (n == null) {
      tests.unshift(
        ({ assert }) =>
          assert(
            sub.length > 0,
            ['expected to find some nodes matching %j in %j', debug(finder), debug(actual)],
            ['expected not to find some nodes matching %j in %j', debug(finder), debug(actual)]
          )
      )
    } else {
      tests.unshift(
        ({ assert }) =>
          assert(
            sub.length === n,
            ['expected to find %d nodes matching %j in %j', n, debug(finder), debug(actual)],
            ['expected not to find %d nodes matching %j in %j', n, debug(finder), debug(actual)]
          )
      )
    }

    return sub
  })

export const findOne = finder => findSome(finder, 1)

export const findTwo = finder => findSome(finder, 2)

export const findThree = finder => findSome(finder, 3)

export const haveClass = className =>
  ({ assert, actual }) =>
    assert(
      actual.hasClass(className),
      ['expected to find class %j on object %j', className, debug(actual)],
      ['expected not to find class %j on object %j', className, debug(actual)]
    )

export const matchText = match =>
  ({ assert, actual }) => {
    const text = actual.text()
    return assert(
      isRegExp(match)
        ? match.test(text)
        : text.indexOf(match) >= 0,
      ['expected %j to include %j', text, match],
      ['expected %j to include %j', text, match]
    )
  }
export const includeText = matchText

export const equalComponent = expected =>
  ({ assert, actual }) =>
    assert(
      actual.equals(expected),
      ['expected %j to equal %j', expected, actual],
      ['expected %j to equal %j', debug(expected), debug(actual)]
    )

export const haveProps = expected =>
  ({ assert, actual }) => {
    const props = actual.props()
    return assert(
      Object.keys(expected).every(key => isEqual(expected[key], props[key])),
      ['expected to find props %j on %j', expected, debug(actual)],
      ['expected to find props %j on %j', expected, debug(actual)],
    )
  }

export const haveProp = name =>
  startChain((tests, actual) => {
    const sub = actual.props()[name]

    tests.unshift(
      ({ assert }) =>
        assert(
          sub != null,
          ['expected to find prop %j on %j', name, debug(actual)],
          ['expected not to find prop %j on %j', name, debug(actual)]
        )
    )

    return sub
  })

export const assertProp = (name, assertion) =>
  di =>
    assertion({ ...di, actual: di.actual.props()[name] })

export const assertEach = assertion =>
  di => {
    for (let i = 0; i < di.actual.length; i ++) {
      const failure = assertion({ ...di, actual: di.actual.at(i) })
      if (failure) {
        return {
          ...failure,
          msg: `Assertion failed for i=${i}: ${failure.msg}`,
        }
      }
    }

    return undefined
  }
