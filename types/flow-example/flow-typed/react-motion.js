// TODO: remove after react-motion will be updated with new flow typedefs
declare module 'react-motion' {
  declare export function spring<A>(
    val: number,
    config?: A
  ): { val: number, ...$Exact<A> }

  declare export var TransitionMotion: React$ComponentType<{ styles: any }>
}
