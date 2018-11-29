<template>
  <v-app>
    <div v-show="$route.path !== '/login'">
      <navigation-drawer></navigation-drawer>
      <toolbar></toolbar>
    </div>
    <v-content>
      <router-view></router-view>
    </v-content>
    <snack></snack>
  </v-app>
</template>

<script>
import NavigationDrawer from '@/components/NavigationDrawer'
import Toolbar from '@/components/Toolbar'
import Snack from '@/components/Snack'
import { mapActions } from 'vuex'

export default {
  name: 'App',

  methods: {
    ...mapActions('files', [
      'fetchFiles'
    ])
  },

  created () {
    this.fetchFiles()
    setInterval(this.fetchFiles, 5 * 60 * 1000) // 5 minutes
  },

  components: {
    NavigationDrawer,
    Snack,
    Toolbar
  }
}
</script>

<style scoped>

</style>
