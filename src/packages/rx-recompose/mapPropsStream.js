import createElement from 'recompose/createElement'
import createHelper from 'recompose/createHelper'
import createComponent from './createComponent'
import { Observable } from 'rx'

const mapPropsStream = ownerPropsToChildProps => BaseComponent =>
  createComponent(ownerProps$ =>
    Observable.create(observer => {
      const subscription = ownerPropsToChildProps(ownerProps$).subscribe(
        childProps => observer.next(
          createElement(BaseComponent, childProps)
        )
      )
      return () => subscription.dispose()
    })
  )

export default createHelper(mapPropsStream, 'mapPropsStream')
