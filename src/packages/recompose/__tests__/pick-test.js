import test from 'ava'
import pick from '../utils/pick'

test('pick', t => {
  t.deepEqual(
    pick({
      one: '1',
      dont: 'include',
      two: {
        deep: {
          value: 'true'
        }
      },
      root: {},
      three: '3'
    }, [
      'one',
      ['two', 'deep', 'value'],
      ['root', 'missed'],
      'three'
    ]),
    {
      one: '1',
      'two\ndeep\nvalue': 'true',
      'root\nmissed': undefined,
      three: '3'
    }
  )
})
