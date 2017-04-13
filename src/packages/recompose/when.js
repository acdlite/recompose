import branch from './branch'
import renderNothing from './renderNothing'
import renderComponent from './renderComponent'

const when = (predicate) => branch(predicate, renderComponent, renderNothing)

export default when
