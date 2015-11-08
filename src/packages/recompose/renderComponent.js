import createHelper from 'lodash/function/curry'

const renderComponent = (Component, _) => Component

export default createHelper(renderComponent, 'renderComponent')
