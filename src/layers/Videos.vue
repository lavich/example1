<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs5>
        <h3>{{ data.path }}</h3>
        <video-player class="video-player-box"
                      ref="videoPlayer"
                      :options="playerOptions"
        />
        <v-tooltip top v-if="!!data.cdn_url">
          <v-btn class="mx-0" slot="activator" @click="downloadVideo(data.cdn_url)">
            <v-icon left>cloud_download</v-icon>
            {{ $t("download") }}
          </v-btn>
          <span>{{ $t("download") }}</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs7>
        <videos-platformcraft id="table" @click="clickRow"></videos-platformcraft>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import VideosPlatformcraft from '../components/VideosPlatformcraft'
import 'video.js/dist/video-js.css'

import { videoPlayer } from 'vue-video-player'

const messages = {
  en: {
    download: 'Download'
  },
  ru: {
    download: 'Скачать'
  }
}

export default {
  name: 'Videos',
  data () {
    return {
      data: { cdn_url: '' },
      playerOptions: {
        fluid: true,
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: []
      }
    }
  },
  i18n: {
    messages: messages
  },
  methods: {
    clickRow (value) {
      this.data = value
      this.playerOptions.sources.splice(0, 1, { src: 'http://' + value.cdn_url })
    },
    downloadVideo (url) {
      console.log('download link =', url)
      let link = document.createElement('a')
      link.href = 'http://' + url
      link.download = 'filename'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },
  components: {
    VideosPlatformcraft,
    videoPlayer
  }
}
</script>

<style scoped>
#table {
  min-height: 700px;
}
</style>
