<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs5>
        <h3>{{ data.path }}</h3>
        <div v-html="data.frame_tag"></div>
        <v-text-field
          label="Frame tag"
          :value="data.frame_tag"
          box
          readonly
          multi-line
        ></v-text-field>
        <p>
          {{$t('geoblock')}}: <span v-if="data.geo">{{$t('ru_geo')}}</span><span v-else>{{$t('ww_geo')}}</span>
        </p>
      </v-flex>
      <v-flex xs7>
        <players-platformcraft id="table" @click="value => data=value"></players-platformcraft>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PlayersPlatformcraft from '../components/PlayersPlatformcraft'

const messages = {
  en: {
    geoblock: 'Geoblocking enabled for',
    ru_geo: 'only for Russia',
    ww_geo: 'no limitations'

  },
  ru: {
    geoblock: 'Геоограничение',
    ru_geo: 'только для России',
    ww_geo: 'отсутствует'
  }
}

export default {
  name: 'Videos',
  data () {
    return {
      data: {}
    }
  },
  i18n: {
    messages: messages
  },
  methods: {},
  components: {
    PlayersPlatformcraft
  }
}
</script>

<style scoped>
  #table {
    min-height: 700px;
  }
</style>
