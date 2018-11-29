import { mount, config } from '@vue/test-utils'
import LoginForm from '@/components/LoginForm'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.config.silent = true
Vue.use(Vuetify)
config.mocks.$t = key => key

describe('LoginForm.vue', () => {

  const wrapper = mount(LoginForm, {
    localVue: Vue,
    sync: false
  })

  it('Проверка создания формы', () => {
    expect(wrapper.name()).toBe('LoginForm')
    // console.log(wrapper.html())
  })

  it('Отправка данных формы', () => {
    wrapper.vm.$emit('submit')

    // заполнение полей
    wrapper.setData({ username: 'myLogin' })
    wrapper.setData({ password: 'myPassword' })
    const submitButton = wrapper.find('button')

    // имитация нажатия кнопки
    submitButton.trigger('click')

    // проверка, что событие было вызвано
    expect(wrapper.emitted('submit')).toBeTruthy()
    // проверка, что событие вызывалось определённое число раз
    expect(wrapper.emitted('submit').length).toBe(2)
    // проверка, что с событием были переданы определённые данные
    expect(wrapper.emitted('submit')).toEqual([[], [{ username: 'myLogin', password: 'myPassword', rememberMe: true }]])
  })

})
