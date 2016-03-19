import React from 'react'
import Relay from 'react-relay'
import { graphql } from 'graphql'
import { expect } from 'chai'
import { compose } from 'recompose'
import createSpy from 'recompose/createSpy'
import { createContainer } from 'recompose-relay'

import { renderIntoDocument } from 'react-addons-test-utils'

import schema from '../data/schema'

const delay = ms => new Promise(res => setTimeout(res, ms))

const networkLayer = {
  sendMutation: mutationRequest => (
    graphql(schema, mutationRequest.getQueryString()).then(result => {
      if (result.errors) {
        mutationRequest.reject(new Error())
      } else {
        mutationRequest.resolve({ response: result.data })
      }
    })
  ),
  sendQueries: queryRequests => {
    return Promise.all(queryRequests.map(
      queryRequest => graphql(schema, queryRequest.getQueryString())
        .then(result => {
          if (result.errors) {
            queryRequest.reject(new Error())
          } else {
            queryRequest.resolve({ response: result.data })
          }
        })
    ))
  },
  supports: () => false
}

Relay.injectNetworkLayer(networkLayer)

describe.skip('createContainer()', () => {
  const relayTest = async (Tyrion, spy) => {
    renderIntoDocument(
      <Relay.RootContainer
        Component={Tyrion}
        route={{
          name: 'CharacterRoute',
          queries: {
            tyrion: Component => Relay.QL`
              query {
                tyrion {
                  ${Component.getFragment('tyrion')}
                }
              }
            `
          },
          params: {}
        }}
      />
    )

    await delay(100)

    const { tyrion } = spy.getProps()

    expect(tyrion.relationships.map(r => r.character.name)).to.eql([
      'Cersei',
      'Tywin',
      'Jaime'
    ])
  }

  it('is a curried, component-last version of Relay.createContainer()', async () => {
    const spy = createSpy()
    const Tyrion = compose(
      createContainer({
        fragments: {
          tyrion: () => Relay.QL`
            fragment on Character {
              name,
              relationships {
                character {
                  name
                }
              }
            }
          `
        }
      }),
      spy
    )('div')

    expect(Tyrion.displayName).to.equal(
      'Relay(spy(div))'
    )

    await relayTest(Tyrion, spy)
  })

  it('works with function components without warnings', async () => {
    const error = sinon.spy(console, 'error')
    const spy = createSpy()
    const Tyrion = compose(
      createContainer({
        fragments: {
          tyrion: () => Relay.QL`
            fragment on Character {
              name,
              relationships {
                character {
                  name
                }
              }
            }
          `
        }
      }),
      BaseComponent => props => <BaseComponent {...props} />,
      spy
    )('div')

    await relayTest(Tyrion, spy)

    expect(error.callCount).to.equal(0)
    /* eslint-disable */
    console.error.restore()
    /* eslint-enable */
  })
})
