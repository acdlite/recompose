recompose-relay
===============

[![npm version](https://img.shields.io/npm/v/recompose-relay.svg?style=flat-square)](https://www.npmjs.com/package/recompose-relay)

[Recompose](https://github.com/acdlite/recompose) helpers for [Relay](https://facebook.github.io/relay).

```
npm install --save recompose-relay
```

## API

### `createContainer()`

```js
createContainer(
  specification: Object,
  BaseComponent: ReactElementType
): ReactElementType
```

A curried, component-last version of `Relay.createContainer()`. This makes it composable with other Recompose helpers.

If the base component is not a class component, it is converted to one using `toClass()`. This allows Relay to add a ref to the base component without causing React to print a warning. (Function components cannot have refs.) This behavior will be removed once Relay updates to support function components.

Tip: Use `flattenProp()` in combination with `createContainer()` to flatten fragment props:

```js
const Post = compose(
  createContainer({
    fragments: {
      post: () => Relay.QL`
        fragment on Post {
          title,
          content,
          author {
            name
          }
        }
      `
    }
  }),
  flattenProp('post')
)(({ title, content, author }) => (
  <article>
    <h1>{title}</h1>
    <h2>By {author.name}</h2>
    <div>{content}</div>
  </article>
));
```
