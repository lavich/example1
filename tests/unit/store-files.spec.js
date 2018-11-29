// store-files.spec.js

import files from '@/store/modules/files'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'

const correctData = [
  { 'name': 'otr.stream_2018_06_14_141000000.mp4' },
  { 'name': 'otr.stream_2018_06_14_142000000.mp4' },
  { 'name': 'otr.stream_2018_06_14_143000000.mp4' }
]

const incorrectData = [
  { 'name': 'otr.stream_2018_06_14.mp4' },
  { 'name': 'otr.stream_2018-06-14-142000000.mp4' }
]

describe('Store: files', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store(cloneDeep(files))

  it('Создание хранилища files', () => {
    expect(store.getters.files.length).toBe(0)
  })

  it('Парсинг названий файлов', () => {
    store.commit('parseFiles', correctData)
    expect(store.getters.files.length).toBe(3)
    expect(store.getters.files[0].name).toBe('otr.stream_2018_06_14_141000000.mp4')
    expect(store.getters.files[0].start).toBe(1528974600000)
    expect(store.getters.files[0].end).toBe(1528975200000)
  })

  it('Парсинг некоректных данных', () => {
    store.commit('parseFiles', incorrectData)
    expect(store.getters.files.length).toBe(0)
  })

  it('Получение ссылки на файл', () => {
    store.commit('parseFiles', correctData)
    const source = store.getters.source(1528974600001)

    expect(source.url).toBe('/content/otr.stream_2018_06_14_141000000.mp4')
    expect(source.name).toBe('otr.stream_2018_06_14_141000000.mp4')
    expect(source.currentTime).toBe(0.001)
    expect(source.start).toBe(1528974600000)
    expect(source.end).toBe(1528975200000)
  })

  it('Получение скриншота (нет подходящих файлов)', () => {
    store.commit('parseFiles', correctData)
    const image = store.getters.image(1528974599999)
    expect(image).toBe('')
  })

})
