<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex md12 lg6 order-lg1>
        <broadcast
          id="table"
          @play="playBroadcast"
          @mount="mount"
        ></broadcast>
      </v-flex>
      <v-flex md12 lg6 order-lg0>
        <video-player :timestamp="timestamp"></video-player>
        <slider :value="timestamp" @input="changeTimestamp"></slider>
      </v-flex>
      <v-flex md12 order-lg2>
        <flat-bed
          :parts="parts.parts"
          :harris="parts.harris"
          :name="parts.title"
          :datetime="parts.start"
          :timestamp="timestamp"
          @clear="clearParts"
          @click="changeTimestamp"
        ></flat-bed>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Broadcast from '@/components/Broadcast'
import Slider from '@/components/Slider'
import FlatBed from '@/components/flatbed/FlatBed'
import VideoPlayer from '@/components/VideoPlayer'

import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      parts: []
    }
  },

  computed: {
    ...mapGetters('files', [
      'source'
    ]),
    ...mapGetters('timestamp', [
      'timestamp'
    ])
  },

  methods: {
    ...mapActions('timestamp', {
      initTimestamp: 'init',
      changeTimestamp: 'change'
    }),
    mount (parts) {
      let copy = JSON.parse(JSON.stringify(parts))
      this.changeTimestamp(new Date(copy.start).getTime())
      copy.parts.forEach(part => {
        part.start = new Date(part.start).getTime()
        part.end = new Date(part.end).getTime()
        part.imgStart = ''
        part.imgEnd = ''
      })
      this.parts = copy
      this.$socket.emit('lock_harris', parts.harris)
    },
    clearParts () {
      this.parts = []
      this.$socket.emit('lock_harris', '')
    },
    playBroadcast (src) {
      this.changeTimestamp(new Date(src.start))
    }
  },

  beforeDestroy () {
    this.$socket.emit('lock_harris', '')
  },

  components: {
    Broadcast,
    VideoPlayer,
    Slider,
    FlatBed
  },

  created () {
    let yesterday = -1
    this.initTimestamp(yesterday)
  }
}
</script>
<style scoped>
  #table {
    min-height: 700px;
  }
</style>
