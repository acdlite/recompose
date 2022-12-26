// @flow
import React from 'react'
import { createEventHandler } from '../..'

// $ExpectError
createEventHandler(1)

// $ExpectError
const result1: number = createEventHandler()

// $ExpectError
const { stream1, handler1 } = createEventHandler()

const { stream, handler } = createEventHandler()

handler()
