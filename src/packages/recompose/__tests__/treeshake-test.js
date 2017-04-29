import webpack from 'webpack'
import MemoryFS from 'memory-fs'
import pkg from '../package.json'
import fs from 'fs'

test('tree shaking should work', () => {
  const compiler = webpack({
    context: __dirname,
    entry: './fixtures/treeshake-entry.js',
    externals: {
      react: 'React',
      'fbjs/lib/shallowEqual': 'shallowEqual',
      'hoist-non-react-statics': 'hoistNonReactStatics',
      'change-emitter': 'changeEmitter',
      'symbol-observable': 'symbolObservable',
    },
    output: {
      path: '/',
      filename: './bundle.js',
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        mangle: false,
      }),
    ],
  })
  const memoryFS = new MemoryFS()
  compiler.outputFileSystem = memoryFS
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve(stats)
      }
    })
  }).then(stats => {
    const result = memoryFS.readFileSync('/bundle.js', 'utf-8')
    const list = [
      'mapProps',
      'withProps',
      'withPropsOnChange',
      'withHandlers',
      'defaultProps',
      'renameProp',
      'renameProps',
      'flattenProp',
      'withState',
      'withReducer',
      'branch',
      'renderComponent',
      'renderNothing',
      'shouldUpdate',
      'pure',
      'onlyUpdateForKeys',
      'onlyUpdateForPropTypes',
      'withContext',
      'getContext',
      'lifecycle',
      'toClass',
      'setStatic',
      'setPropTypes',
      'setDisplayName',
      'compose',
      'getDisplayName',
      'wrapDisplayName',
      'shallowEqual',
      'isClassComponent',
      'createEagerElement',
      'createEagerFactory',
      'createSink',
      'componentFromProp',
      'nest',
      'hoistStatics',
      'componentFromStream',
      'mapPropsStream',
      'createEventHandler',
      'setObservableConfig',
    ]

    list.forEach(name => {
      expect([name, result.indexOf(name)]).toEqual([name, -1])
    })
  })
})
