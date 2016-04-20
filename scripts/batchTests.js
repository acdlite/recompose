// Stolen from https://raw.githubusercontent.com/MoOx/phenomic/3eaf91f6d58fb76eab8236eebbd5b69625182076/scripts/ava-serial.js, which was stolen from
// Stolen from https://git.io/vajFu @ben-eb

// Ava creates a separate process for every file. Travis will kill processes
// after a certain limit. This is a temporary workaround until Ava provdes a
// better solution.

import { spawn } from 'child_process'
import pkg from '../package.json'
import globby from 'globby'

const throttlePromise = (myArray, iterator, limit) => {
  const pickUpNextTask = () => {
    if (myArray.length) {
      return iterator(myArray.shift())
    }
  }
  const startChain = () => (
    Promise.resolve().then(function next() {
      return pickUpNextTask().then(next)
    })
  )

  const chains = []
  for (let k = 0; k < limit; k += 1) {
    chains.push(startChain())
  }
  Promise.all(chains)
}

const spawnAva = (file) => (
  new Promise((resolve, reject) => {
    // Normalize string to array
    const filesToTest = (Array.isArray(file)) ? file : [ file ]

    const ps = spawn(
      process.execPath,
      [ 'node_modules/.bin/ava', ...filesToTest ],
      {
        stdio: 'inherit',
      }
    )

    ps.on('close', (code) => {
      if (code === 0) {
        return resolve(code)
      }
      return reject(code)
    })
  })
)

const pattern = pkg.ava.files

globby(pattern)
.then((tests) => {
  throttlePromise(tests, spawnAva, 2)
})
.catch((err) => {
  setImmediate(() => { throw err })
})
