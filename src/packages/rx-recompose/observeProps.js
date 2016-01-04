import createElement from 'recompose/createElement'
import createHelper from 'recompose/createHelper'
import createComponent from './createComponent'

const observeProps = (ownerPropsToChildProps, BaseComponent) =>
  createComponent(ownerProps$ =>
    new Observable(observer =>
      ownerPropsToChildProps(ownerProps$).subscribe({
        next: childProps => observer.next(
          createElement(BaseComponent, childProps)
        )
      })
    )
  )

export default createHelper(observeProps, 'observeProps')
