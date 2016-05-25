/* eslint-env mocha */

import React from 'react'
import expect, { be, throwError } from 'expect-to'
import { mount } from 'enzyme'

import {
  findSome,
  findOne,
  haveClass,
  haveProp,
  matchText,
} from '../src/index'

const P3 = () =>
  <div>
    <p>Foo</p>
    <p>Bar</p>
    <p>Baz</p>
  </div>

const P4 = () =>
  <div>
    <p>Foo</p>
    <p>Bar</p>
    <p>Baz</p>
    <p>Boo</p>
  </div>

const Paragraph = ({ className, children }) =>
  <p className={className}>{"=>"}{children}{"<="}</p>

describe('assertions', () => {
  describe('findSome', () => {
    context('n = null', () => {
      it('succeeds there are some', () => {
        expect(mount(<P3 />)).to(findSome('p'))
      })

      it('fails if there are none', () => {
        expect(() => {
          expect(mount(<P3 />)).to(findSome('a'))
        }).to(throwError())
      })
    })

    context('n = 3', () => {
      it('succeeds if there are 3', () => {
        expect(mount(<P3 />)).to(findSome('p', 3))
      })

      it('fails if there are more than 3', () => {
        expect(() => {
          expect(mount(<P4 />)).to(findSome('p', 3))
        }).to(throwError())
      })

      it('fails if there are none', () => {
        expect(() => {
          expect(mount(<P4 />)).to(findSome('a', 3))
        }).to(throwError())
      })
    })
  })

  describe('chaining', () => {
    context('findOne -> haveClass & matchText & haveProp -> be', () => {
      const run = ({
        className = 'bold',
        type = 'plain',
        match = /^=>/,
      }) => () => {
        expect(mount(
          <div>
            <div>
              <Paragraph className="bold" type="plain">
                This is just text
              </Paragraph>
            </div>
          </div>
        ))
        .to(
          findOne(Paragraph)
            .and(matchText(match))
            .and(
              haveProp('type')
                .and(be(type))
            )
            .and(
              findOne('p')
                .and(haveClass(className))
            )
        )
      }

      it('fails if className does not match', () => {
        expect(run({ className: 'bob' }))
          .to(throwError(/find class 'bob'/))
      })

      it('fails if text does not match', () => {
        expect(run({ match: /not just text/ }))
          .to(throwError(/expected '=>This is just text<='/))
      })

      it('fails if type does not match', () => {
        expect(run({ type: 'boo' }))
          .to(throwError('boo'))
      })
    })
  })
})
