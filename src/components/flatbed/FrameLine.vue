<template>
  <div>
    <v-layout row wrap>
      <v-flex xs1>
        <v-layout align-center justify-center row fill-height>
          <v-btn icon large @click="unshiftFrame">
            <v-icon large>chevron_left</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex lg2 xl1 xs2 v-for="(frame, key) in frames" :key="key">
        <v-hover>
          <v-card slot-scope="{ hover }">
            <div :class="{primary: key===2}" class="pb-1">
              <v-img :src="frame.img">
                <v-layout v-if="hover" pa-2 align-center justify-space-between column fill-height
                          class="lightbox white--text">
                  <div>{{ frame.timestamp | moment('DD/MM, HH:mm:ss') }}</div>
                  <div>
                    <v-icon dark @click="rewind(frame.timestamp)">visibility</v-icon>
                    <v-icon dark @click="changeFrame(frame.timestamp)" :disabled="selected.length === 0">swap_vert
                    </v-icon>
                    <v-icon dark @click="addThumbnail(frame.timestamp)">add_a_photo</v-icon>
                  </div>
                </v-layout>
              </v-img>
            </div>
          </v-card>
        </v-hover>
      </v-flex>
      <v-flex xs1>
        <v-layout align-center justify-center row fill-height>
          <v-btn icon large @click="pushFrame">
            <v-icon large>chevron_right</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

let timeStampNow = offset => {
  let d = new Date()
  if (offset) {
    d.setDate(d.getDate() + offset)
  }
  return d / 1
}

export default {

  props: {
    timestamp: { default: timeStampNow(-1) },
    selected: { type: Array }
  },

  data () {
    return {
      localTimestamp: this.timestamp,
      numberOfScreenshot: 5,
      timeDeltaSlide: 200,
      frames: [],
      frameSource: document.createElement('video'),
      frameScaleFactor: 0.15
    }
  },

  computed: {
    ...mapGetters('files', [
      'image',
      'source'
    ])
  },

  watch: {
    timestamp (value) {
      this.localTimestamp = value
      this.frames = this.initFrames()
    },
    frames () {
      this.updateFrames()
    }
  },

  methods: {
    initFrames () {
      let frames = []
      let half = this.numberOfScreenshot / 2 ^ 0
      for (let i = -half; i <= half; i++) {
        frames.push({ timestamp: this.localTimestamp + i * this.timeDeltaSlide, img: '' })
      }
      return frames
    },
    updateFrames () {
      let p = Promise.resolve()
      this.frames.forEach((frame, frameIndex) => {
        if (!frame.img) {
          p = p.then(() => this.image(frame.timestamp)).then(image => { this.frames[frameIndex].img = image })
        }
      })
    },
    unshiftFrame () {
      this.frames.pop()
      this.frames.unshift({ timestamp: this.frames[0].timestamp - this.timeDeltaSlide, img: '' })
    },
    pushFrame () {
      this.frames.shift()
      this.frames.push({ timestamp: this.frames[this.frames.length - 1].timestamp + this.timeDeltaSlide, img: '' })
    },
    rewind (timestamp) {
      this.$emit('rewind', timestamp)
    },
    changeFrame (timestamp) {
      this.$emit('change', timestamp)
    },
    addThumbnail (timestamp) {
      this.$emit('thumbnail', timestamp)
    }
  },

  filters: {
    filterTime (value) {
      let d = new Date(value)
      return d.toTimeString().slice(0, 8) + '.' + d.getMilliseconds()
    }
  },

  created () {
    this.frames = this.initFrames()
    this.frameSource.setAttribute('crossOrigin', 'anonymous')
  }
}
</script>
