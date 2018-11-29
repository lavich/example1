<template>
  <v-layout align-center justify-center column fill-height>
    <login-form
      @submit="loginHandler"
    ></login-form>
    <v-btn flat @click="changeLang">
      {{$i18n.locale}}
    </v-btn>
  </v-layout>
</template>

<script>
import LoginForm from '@/components/LoginForm'
import { mapActions } from 'vuex'

export default {
  name: 'LoginPage',

  methods: {
    ...mapActions('auth', [
      'login',
      'logout'
    ]),
    changeLang () {
      if (this.$i18n.locale === 'en') {
        this.$i18n.locale = 'ru'
      } else {
        this.$i18n.locale = 'en'
      }
    },
    loginHandler (data) {
      const { username, password, rememberMe } = data
      this.login({ username, password, rememberMe })
      this.$router.push('/')
    }
  },

  components: {
    LoginForm
  },

  created () {
    this.logout()
  }

}
</script>

<style scoped>

</style>
