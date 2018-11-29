<template>
  <v-layout column class="pt-2 elevation-4 grey lighten-2">
    <frame-line :timestamp="timestamp"
                :selected="selectedPart"
                @rewind="rewind"
                @change="changeFrame"
                @thumbnail="createThumbnail"
    ></frame-line>
    <v-divider></v-divider>
    <div>
      <v-btn @click="createParts(timestamp)" flat small>
        <v-icon left>library_add</v-icon>
        {{ $t('buttons.add') }}
      </v-btn>
      <v-btn @click="clearParts" :disabled="localParts.length === 0" flat small>
        <v-icon left>clear</v-icon>
        {{ $t('buttons.clear') }}
      </v-btn>
      <v-btn @click="dialog = true" :disabled="localParts.length === 0" flat small>
        <v-icon left>save</v-icon>
        {{ $t('buttons.save') }}
      </v-btn>
      <save-dialog v-model="dialog"
                   :disabled="localParts.length === 0"
                   :parts="partsForSave"
                   :harris="harris"
                   :name="name"
                   :thumbnail="thumbnail"
                   :date="datetime.slice(0, 10)"
                   :time="datetime.slice(11, 16)"
                   :editable="!harris || !datetime"
                   @success="clearParts"
      ></save-dialog>
    </div>
    <v-divider></v-divider>
    <parts-view :parts="localParts"
                :selected="selectedPart"
                :thumbnail="thumbnail"
                @resetThumbnail="setThumbnail = ''"
                @select="selectFrame"
                @delete="deleteParts"
    ></parts-view>

  </v-layout>
</template>

<script>

import PartsView from './PartsView'
import FrameLine from './FrameLine'
import SaveDialog from '@/components/savebutton/SaveButton'

import { mapActions, mapGetters } from 'vuex'

let dateNow = () => {
  return new Date().toISOString()
}
const messages = {
  en: {
    buttons: {
      add: 'add',
      clear: 'clear',
      save: 'save video'
    }
  },
  ru: {
    buttons: {
      add: 'добавить',
      clear: 'очистить',
      save: 'сохранить'
    }
  }
}
export default {
  name: 'FlatBed',

  props: {
    parts: { type: Array },
    timestamp: { type: Number },
    harris: { type: String },
    name: { type: String },
    datetime: {
      type: String,
      default: dateNow()
    }
  },

  i18n: {
    messages: messages
  },

  components: {
    FrameLine,
    PartsView,
    SaveDialog
  },

  data () {
    return {
      localParts: [],
      selectedPart: [],
      // thumbnailImg: null,
      dialog: false
    }
  },

  watch: {
    parts () {
      this.initParts()
      this.getImage()
    },
    localParts (parts) {
      this.$emit('save', parts)
    }
  },

  computed: {
    ...mapGetters('files', [
      'files',
      'image',
      'source'
    ]),
    ...mapGetters('thumbnail', [
      'thumbnail'
    ]),
    partsForSave () {
      let saveParts = []
      this.localParts.forEach(part => {
        let start = part[0].timestamp
        let end = part[1].timestamp
        const contentFolder = '/content/'

        this.files.forEach(file => {
          let part = {}
          // find start
          if (file.start <= start && file.end > start) {
            part.file = contentFolder + file.name
            part.start = (start - file.start) / 1000
          }
          // find end
          if (file.start < end && file.end >= end) {
            part.file = contentFolder + file.name
            part.end = (end - file.start) / 1000
          }
          // Check inner
          if (file.start > start && file.end < end) {
            part.file = contentFolder + file.name
            part.start = 0
            part.end = (file.end - file.start) / 1000
          }
          if (part.file) {
            saveParts.push(part)
          }
        })
      })
      return saveParts
    }
  },

  methods: {
    ...mapActions('thumbnail', {
      setThumbnail: 'set'
    }),
    initParts () {
      let localParts = []
      this.parts.forEach(part => {
        localParts.push([
          { timestamp: part.start, img: '' },
          { timestamp: part.end, img: '' }
        ])
      })
      this.localParts = localParts
    },
    rewind (timestamp) {
      this.$emit('click', timestamp)
    },
    selectFrame (partIndex, frameIndex) {
      if (this.selectedPart[0] === partIndex && this.selectedPart[1] === frameIndex) {
        this.selectedPart = []
      } else {
        this.selectedPart = [partIndex, frameIndex]
        this.rewind(this.localParts[partIndex][frameIndex].timestamp)
      }
    },
    changeFrame (timestamp) {
      if (this.selectedPart.length > 0) {
        this.$set(this.localParts[this.selectedPart[0]], this.selectedPart[1], { timestamp: timestamp, img: '' })
        this.localParts.sort((a, b) => a[0].timestamp - b[0].timestamp)
        this.getImage()
      }
    },
    getImage () {
      let chain = Promise.resolve()
      this.localParts.forEach((part, partIndex) => {
        part.forEach((frame, frameIndex) => {
          if (!this.localParts[partIndex][frameIndex].img) {
            chain = chain.then(() => this.image(frame.timestamp)).then(img => {
              this.localParts[partIndex][frameIndex].img = img
            })
          }
        })
      })
    },
    createThumbnail (timestamp) {
      this.image(timestamp).then(img => { this.setThumbnail(img) })
    },
    createParts (timestamp) {
      let start = timestamp
      let end = timestamp
      if (this.localParts.length > 0) {
        this.localParts.forEach(part => {
          part.forEach(frame => {
            if (frame.timestamp > timestamp) {
              if (end > frame.timestamp || end === timestamp) {
                end = frame.timestamp
              }
            }
            if (frame.timestamp < timestamp) {
              if (start < frame.timestamp || start === timestamp) {
                start = frame.timestamp
              }
            }
          })
        })
        // удалить отрезок, если он разбивается на два
        this.localParts.forEach((part, partIndex) => {
          if (part[0].timestamp === start && part[1].timestamp === end) {
            this.localParts.splice(partIndex, 1)
          }
        })
        // Вставка новых отрезков
        if (start !== timestamp) {
          this.localParts.push([{ timestamp: start, img: '' }, { timestamp: timestamp, img: '' }])
        }
        if (end !== timestamp) {
          this.localParts.push([{ timestamp: timestamp, img: '' }, { timestamp: end, img: '' }])
        }
      } else {
        this.localParts.push([{ timestamp: timestamp, img: '' }, { timestamp: timestamp + 1000, img: '' }])
      }
      // Сортировка по возрастанию
      this.localParts.sort((a, b) => a[0].timestamp - b[0].timestamp)
      this.getImage()
    },
    deleteParts (partIndex) {
      this.localParts.splice(partIndex, 1)
    },
    clearParts () {
      this.$emit('clear')
      this.localParts = []
      this.thumbnailImg = ''
    }
  }
}
</script>

<style scoped>

</style>
