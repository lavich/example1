<template>
  <video-player class="video-player-box"
                ref="videoPlayer"
                :options="playerOptions"
                @ready="playerReadied"
  />
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'

import { mapGetters } from 'vuex'

export default {
  props: {
    timestamp: { type: Number }
  },

  data () {
    return {
      playerOptions: {
        fluid: true,
        playbackRates: [0.7, 1.0, 1.5, 2.0]
      },
      currentTime: 0
    }
  },

  watch: {
    timestamp () {
      this.computedSource()
    }
  },

  computed: {
    ...mapGetters('files', [
      'source'
    ])
  },

  methods: {
    computedSource () {
      let source = this.source(this.timestamp)
      let player = this.$refs.videoPlayer.player
      if (source) {
        if (source.name !== player.currentSource().src) {
          player.src(source.url)
          this.currentTime = source.currentTime
        } else {
          this.$refs.videoPlayer.player.currentTime(source.currentTime)
        }
      }
    },
    playerReadied (player) {
      player.on('loadedmetadata', () => { this.loadedMetadata() })
      this.$refs.videoPlayer.player.currentTime(this.currentTime)
    },
    loadedMetadata () {
      this.$refs.videoPlayer.player.currentTime(this.currentTime)
    }
  },

  components: {
    videoPlayer
  },

  created () {
    // this.computedSource()
  }
}
</script>

<style>

</style>
