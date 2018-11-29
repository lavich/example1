// store-common.spec.js

import common from '@/store/modules/common'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'

describe('Store: parts', () => {

  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store(cloneDeep(common))

  it('Создание хранилища common', () => {
    expect(store.state.error).toEqual([])
  })

  it('set error', () => {
    store.dispatch('setError', 'error 1')
    store.dispatch('setError', 'error 2')
    store.dispatch('setError', 'error 3')

    expect(store.state.error.length).toBe(3)
    expect(store.getters.error).toBe('error 1')
  })

  it('clear error', () => {
    store.dispatch('clearError')
    expect(store.state.error.length).toBe(2)
    expect(store.getters.error).toBe('error 2')

    store.dispatch('clearError')
    expect(store.state.error.length).toBe(1)
    expect(store.getters.error).toBe('error 3')

    store.dispatch('clearError')
    expect(store.state.error.length).toBe(0)
    expect(store.getters.error).toBeNull()
  })

})
