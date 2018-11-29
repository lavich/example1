// store-parts.spec.js

import parts from '@/store/modules/parts'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'

const correctParts = [
  [
    { timestamp: 1528974100000 },
    { timestamp: 1528974100001 }
  ],
  [
    { timestamp: 1528974100009 },
    { timestamp: 1528974100008 }
  ],
  [
    { timestamp: 1528974100005 },
    { timestamp: 1528974100006 }
  ]
]

describe('Store: parts', () => {

  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store(cloneDeep(parts))

  it('Создание хранилища parts', () => {
    expect(store.state.parts.length).toBe(0)
  })

  it('mutations: set parts', () => {
    store.dispatch('set', { parts: correctParts })

    expect(store.getters.parts.length).toBe(3)
    expect(store.getters.parts[0][0].timestamp).toBe(1528974100000)
    expect(store.getters.parts[0][1].timestamp).toBe(1528974100001)
    expect(store.getters.parts[1][0].timestamp).toBe(1528974100005)
    expect(store.getters.parts[1][1].timestamp).toBe(1528974100006)
    expect(store.getters.parts[2][0].timestamp).toBe(1528974100008)
    expect(store.getters.parts[2][1].timestamp).toBe(1528974100009)
  })

  it('mutations: set meta', () => {
    const meta = 'hello'
    expect(store.getters.meta).toBe('')
    store.dispatch('set', { meta: meta })
    expect(store.getters.meta).toBe(meta)
  })

})

describe('Store: parts', () => {

  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store(cloneDeep(parts))
  const TIMESTAMP = 1528974100000

  it('Создание хранилища parts', () => {
    expect(store.state.parts.length).toBe(0)
  })

  it('Create part: first', () => {
    store.dispatch('create', TIMESTAMP)
    expect(store.getters.parts.length).toBe(1)
    expect(store.getters.parts[0][0].timestamp).toBe(TIMESTAMP)
    expect(store.getters.parts[0][1].timestamp).toBe(TIMESTAMP + 1000)
  })

  it('Create part: inner', () => {
    store.dispatch('create', TIMESTAMP + 500)
    expect(store.getters.parts.length).toBe(2)
    expect(store.getters.parts[0][0].timestamp).toBe(TIMESTAMP)
    expect(store.getters.parts[0][1].timestamp).toBe(TIMESTAMP + 500)
    expect(store.getters.parts[1][0].timestamp).toBe(TIMESTAMP + 500)
    expect(store.getters.parts[1][1].timestamp).toBe(TIMESTAMP + 1000)
  })

  it('Create part: outer', () => {
    store.dispatch('create', TIMESTAMP + 2000)
    expect(store.getters.parts.length).toBe(3)
    expect(store.getters.parts[0][0].timestamp).toBe(TIMESTAMP)
    expect(store.getters.parts[0][1].timestamp).toBe(TIMESTAMP + 500)
    expect(store.getters.parts[1][0].timestamp).toBe(TIMESTAMP + 500)
    expect(store.getters.parts[1][1].timestamp).toBe(TIMESTAMP + 1000)
    expect(store.getters.parts[2][0].timestamp).toBe(TIMESTAMP + 1000)
    expect(store.getters.parts[2][1].timestamp).toBe(TIMESTAMP + 2000)
  })

  it('Remove part', () => {
    store.dispatch('remove', 1)
    expect(store.getters.parts.length).toBe(2)
    expect(store.getters.parts[0][0].timestamp).toBe(TIMESTAMP)
    expect(store.getters.parts[0][1].timestamp).toBe(TIMESTAMP + 500)
    expect(store.getters.parts[1][0].timestamp).toBe(TIMESTAMP + 1000)
    expect(store.getters.parts[1][1].timestamp).toBe(TIMESTAMP + 2000)
  })

  it('Clear all parts', () => {
    store.dispatch('clear', TIMESTAMP)
    expect(store.getters.parts.length).toBe(0)
    expect(store.getters.meta).toBe('')
  })

})
