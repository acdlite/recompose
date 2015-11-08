import { find } from 'lodash'

const characters = [{
  id: 1,
  name: 'Tyrion',
  house: 'Lannister',
  relationships: [
    { characterId: 2, kind: 'sister' },
    { characterId: 3, kind: 'father' },
    { characterId: 4, kind: 'brother' }
  ]
}, {
  id: 2,
  name: 'Cersei',
  house: 'Lannister',
  relationships: [
    { characterId: 1, kind: 'brother' },
    { characterId: 3, kind: 'father' },
    { characterId: 4, kind: 'complicated' }
  ],
}, {
  id: 3,
  name: 'Tywin',
  house: 'Lannister',
  relationships: [
    { characterId: 1, kind: 'son' },
    { characterId: 2, kind: 'daughter' },
    { characterId: 4, kind: 'brother' }
  ],
}, {
  id: 4,
  name: 'Jaime',
  house: 'Lannister',
  relationships: [
    { characterId: 1, kind: 'brother' },
    { characterId: 2, kind: 'complicated' },
    { characterId: 3, kind: 'father' }
  ]
}]

export function getCharacter(id) {
  return find(characters, c => c.id === id)
}

export function getCharacterByName(name) {
  return find(characters, c => c.name === name)
}
