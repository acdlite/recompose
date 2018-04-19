// @flow
import React from 'react'
import { componentFromStream } from '../..'

// $ExpectError
componentFromStream(1)

// $ExpectError
const result1: number = componentFromStream(() => React.createElement('div'))

componentFromStream(a => a)
