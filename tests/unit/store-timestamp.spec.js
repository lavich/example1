// store-timestamp.spec.js

import timestamp from '@/store/modules/timestamp'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'

describe('Store: timestamp', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store(cloneDeep(timestamp))

  it('Создание хранилища timestamp', () => {
    expect(store.getters.timestamp).toBeNull()
  })

  it('Инициализация', () => {
    const offset = -1
    store.dispatch('init', offset)
    expect(store.getters.timestamp).not.toBeNull()
  })

  it('Изменение', () => {
    const newTimestamp = 1541431394012
    store.dispatch('change', newTimestamp)
    expect(store.getters.timestamp).toBe(newTimestamp)
  })
})
