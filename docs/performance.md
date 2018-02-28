# Should I use this? Performance and other concerns

If function composition doesn't scare you, then yes, I think so. I believe using higher-order component helpers leads to smaller, more focused components, and provides a better programming model than using classes for operations—like `mapProps()` or `shouldUpdate()`—that aren't inherently class-y.

That being said, any abstraction over an existing API is going to come with trade-offs. There is a performance overhead when introducing a new component to the tree. I suspect this cost is negligible compared to the gains achieved by blocking subtrees from re-rendering using `shouldComponentUpdate()`—which Recompose makes easy with its `shouldUpdate()` and `onlyUpdateForKeys()` helpers. In the future, I'll work on some benchmarks so we know what we're dealing with.

However, many of Recompose's higher-order component helpers are implemented using stateless function components rather than class components. Eventually, React will include optimizations for stateless components.
