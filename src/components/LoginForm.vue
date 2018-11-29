<template>
  <v-card class="my-cards">
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="username"
          :label="$t('login')"
          :rules="rule"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          :label="$t('password')"
          type="password"
          :rules="rule"
          required
        ></v-text-field>
        <v-checkbox
          v-model="rememberMe"
          :label="$t('rememberMe')"
        ></v-checkbox>

        <v-btn
          class="primary"
          block
          :disabled="!valid"
          @click="submit"
        >
          {{$t('submit')}}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
const messages = {
  en: {
    submit: 'Submit',
    login: 'Login',
    password: 'Password',
    required: 'Required',
    rememberMe: 'Remember me'
  },
  ru: {
    submit: 'Вход',
    login: 'Логин',
    password: 'Пароль',
    required: 'Обязательное поле',
    rememberMe: 'Запомнить меня'
  }
}

export default {

  name: 'LoginForm',

  data () {
    return {
      valid: false,
      username: '',
      password: '',
      rule: [
        v => !!v || 'Не может быть пустым'
      ],
      rememberMe: true
    }
  },

  i18n: {
    messages: messages
  },

  methods: {
    submit () {
      const { username, password, rememberMe } = this
      this.$emit('submit', { username, password, rememberMe })
    }
  }
}
</script>

<style scoped>
  .my-cards {
    width: 300px;
  }
</style>
