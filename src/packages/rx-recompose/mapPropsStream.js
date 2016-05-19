import createElement from 'recompose/createElement'
import createHelper from 'recompose/createHelper'
import createComponent from './createComponent'

const mapPropsStream = ownerPropsToChildProps => BaseComponent =>
  createComponent(ownerProps$ =>
    Observable.create(observer => {
      const subscription = ownerPropsToChildProps(ownerProps$).subscribe(
        childProps => {
          return observer.next(
            createElement(BaseComponent, childProps)
          )
        }
      )
      return () => subscription.unsubscribe()
    })
  )

export default createHelper(mapPropsStream, 'mapPropsStream')
