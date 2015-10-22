import 'babel/polyfill';
import expect from 'expect';
import expectJSX from 'expect-jsx';

expect.extend(expectJSX);

const context = require.context('./src', true, /-test\.js$/);
context.keys().forEach(context);
