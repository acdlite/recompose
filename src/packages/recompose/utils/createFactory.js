import { createElement } from 'react'

const createFactory = Type => createElement.bind(null, Type)

export default createFactory
