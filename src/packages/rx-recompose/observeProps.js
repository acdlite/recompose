import createElement from 'recompose/createElement'
import createHelper from 'recompose/createHelper'
import createComponent from './createComponent'
import { Observable } from 'rxjs/Observable';

const observeProps = (ownerPropsToChildProps, BaseComponent) =>
  createComponent(ownerProps$ =>
    new Observable(observer => {
      const subscription = ownerPropsToChildProps(ownerProps$).subscribe({
        next: childProps => observer.next(
          createElement(BaseComponent, childProps)
        )
      })
      return () => subscription.unsubscribe()
    })
  )

export default createHelper(observeProps, 'observeProps')
