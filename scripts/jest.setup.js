/* eslint-disable */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

import 'symbol-observable'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })
