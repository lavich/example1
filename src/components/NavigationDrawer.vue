<template>
  <v-navigation-drawer app permanent :mini-variant.sync="mini">
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile @click.stop="mini = !mini">
          <v-tooltip right>
            <v-list-tile-action slot="activator">
              <v-icon color="primary">menu</v-icon>
            </v-list-tile-action>
            <span>{{ $t('showMenu') }}</span>
          </v-tooltip>

          <v-list-tile-content>
            <v-list-tile-title>{{ $t('menu') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-toolbar>

    <v-list class="pt-0">
      <v-list-tile v-for="item in items"
                   :key="item.text"
                   @click.stop="$router.push(item.url)"
                   v-if="!(item.url === '/admin' && !isAdmin)">
        <v-tooltip right>
          <v-list-tile-action slot="activator">
            <v-icon color="primary">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <span>{{ $t(item.title) }}</span>
        </v-tooltip>
        <v-list-tile-content>
          <v-list-tile-title>{{ $t(item.title) }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

  </v-navigation-drawer>
</template>

<script>

const messages = {
  en: {
    menu: 'Menu',
    showMenu: 'Show menu',
    pages: {
      air: 'Air',
      player: 'Player',
      video: 'Video'
    }
  },
  ru: {
    menu: 'Меню',
    showMenu: 'Показать меню',
    pages: {
      air: 'Эфир',
      player: 'Плееры',
      video: 'Видео'
    }
  }
}

export default {

  name: 'NavigationDrawer',

  data () {
    return {
      mini: true,
      items: [
        { icon: 'cast', title: 'pages.air', url: '/' },
        { icon: 'movie', title: 'pages.player', url: '/players' },
        { icon: 'slideshow', title: 'pages.video', url: '/videos' }
      ]
    }
  },
  i18n: {
    messages
  }
}
</script>

<style scoped>

</style>
