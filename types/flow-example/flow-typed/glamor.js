declare module 'glamor' {
  declare type CSSF = (...style: Object[]) => Object
  declare type CSS = {
    insert: (css: string) => void,
    // hack https://github.com/facebook/flow/issues/2966
    $call: (...style: Object[]) => Object,
  }

  declare export var css: CSS
}
