# expect-to-enzyme

expect-to helpers for use with [enzyme](http://airbnb.io/enzyme/).

## Installation

```
npm install --save-dev expect-to-enzyme
```

Import the assertions by name, or using a namespace

```js
import { findOne, haveClass, haveProps } from 'expect-to-enzyme'
```

## Assertions

- `findSome(selector, n)` — takes a selector and asserts that it resolves to `n` nodes. Don't pass an `n` and the assertion will ensure that more than one node is matched. Also supports asserting off the matched node(s), see [sub tests](#sub-tests) for details.

  Aliases:
   - `findOne(selector)`
   - `findTwo(selector)`
   - `findThree(selector)`


  ```javascript
  const wrapper = shallow(
    <Foo className="test">
      <Bar />
    </Foo>
  )

  expect(wrapper).to(findOne(Bar)); // passes
  expect(wrapper).to(findTwo(Bar)); // expected to find 2...
  ```

- `haveClass(class)` — assert that a node has a class
- `matchText(regex|string)` - assert that a node's text includes some value,
- `equalComponent(<Node />)` - assert that an enzyme matches another
- `haveProps(partialProps)` - assert that a node has
- `haveEqualProps(props)` - assert that a node all and only the props defined
- `haveExactProps(props)` - assert that a node has props
- `haveProp(name)` - asserts that a node has a prop. Also supports asserting off the props value, see [sub tests](#sub-tests) for details.
- `assertEach(assertion)` - Ensure that each node in a set matches an assertion

## asserting found values

When an assertion works on a value inside of the original context, you can use the `.and()` method to write additional assertions on that value.

```js
import expect from 'expect-to'
import { findOne } from 'expect-to-enzyme'

const View = ({ type, count }) =>
  <div>
    <input type="number" value={count} />
    <select value={type}>
      <option>html</option>
      <option>css</option>
      <option>js</option>
      <option>png</option>
    </select>
  </div>

describe('View', () => {
  it('renders count to an input of type number', () => {
    const wrapper = shallow(<View count={100} type="html" />)
    expect(wrapper).to(
      findOne('input')
        .and(haveProps({ type: 'number', value: 100 }))
    )
  })
})

```
