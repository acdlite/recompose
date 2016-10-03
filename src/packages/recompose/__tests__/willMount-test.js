import test from 'ava'
import React from 'react'
import { willMount } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('willMount adds a handler to componentWillMount in component', t => {
  const log = sinon.spy(console, 'log');

  const Counter = willMount(function () {
    return console.log('I am being mounted');
  })('div');
  t.is(Counter.displayName, 'willMount(div)');

  const div = mount(<Counter />).find('div');

  log.restore();

  sinon.assert.calledOnce(log);
});

test('willMount handler has access to props', t => {
  const log = sinon.spy(console, 'log');

  const handler = ({ name }) => {
    console.log(name);
  };

  const name = "Recompose";
  //
  const Counter = willMount(handler)('div');
  t.is(Counter.displayName, 'willMount(div)');

  const div = mount(<Counter name={name} />).find('div');

  log.restore();

  sinon.assert.calledWith(log, name);

});
