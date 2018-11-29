<template>
  <v-snackbar
    top
    color="error"
    :value="true"
    v-if="error"
    :timeout="5000"
    @input="closeSnack"
    @click="closeSnack"
  >
    {{ error }}
  </v-snackbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Snack',
  computed: {
    ...mapGetters('common', [
      'error'
    ])
  },
  methods: {
    ...mapActions('common', {
      closeSnack: 'clearError'
    })
  }
}
</script>

<style scoped>

</style>
