<template>
  <v-layout column class="pt-2 elevation-4 grey lighten-2">
    <frame-line :timestamp="timestamp"
                :selected="selectedPart"
                @rewind="changeTimestamp"
                @change="changeFrame"
                @thumbnail="createThumbnail"
    ></frame-line>
    <v-divider></v-divider>
    <div>
      <v-btn @click="createParts(timestamp)" flat small>
        <v-icon left>library_add</v-icon>
        {{ $t('buttons.add') }}
      </v-btn>
      <v-btn @click="clearParts" :disabled="parts.length === 0" flat small>
        <v-icon left>clear</v-icon>
        {{ $t('buttons.clear') }}
      </v-btn>
      <v-btn @click="dialog = true" :disabled="parts.length === 0" flat small>
        <v-icon left>save</v-icon>
        {{ $t('buttons.save') }}
      </v-btn>
      <!--<save-dialog v-model="dialog"-->
                   <!--:parts="partsForSave"-->
                   <!--:harris="harris"-->
                   <!--:name="name"-->
                   <!--:thumbnail="thumbnail"-->
                   <!--:date="datetime.slice(0, 10)"-->
                   <!--:time="datetime.slice(11, 16)"-->
                   <!--:editable="!harris || !datetime"-->
                   <!--@success="clearParts"-->
      <!--&gt;</save-dialog>-->
    </div>
    <v-divider></v-divider>
    <parts></parts>

  </v-layout>
</template>

<script>

import Parts from './Parts'
import FrameLine from './FrameLine'
import SaveDialog from '@/components/savebutton/SaveButton'

import { mapActions, mapGetters } from 'vuex'

// let dateNow = () => {
//   return new Date().toISOString()
// }
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
    // parts: { type: Array },
    // timestamp: { type: Number },
    // harris: { type: String },
    // name: { type: String },
    // datetime: {
    //   type: String,
    //   default: dateNow()
    // }
  },

  i18n: {
    messages: messages
  },

  components: {
    FrameLine,
    Parts,
    SaveDialog
  },

  data () {
    return {
      // localParts: [],
      selectedPart: [],
      // thumbnailImg: null,
      dialog: false
    }
  },

  // watch: {
  //   parts () {
  //     this.initParts()
  //     this.getImage()
  //   },
  //   localParts (parts) {
  //     this.$emit('save', parts)
  //   }
  // },

  computed: {
    ...mapGetters('files', [
      'files',
      'image',
      'source'
    ]),
    ...mapGetters('parts', [
      'parts'
    ]),
    ...mapGetters('timestamp', [
      'timestamp'
    ]),
    ...mapGetters('thumbnail', [
      'thumbnail'
    ])
    // partsForSave () {
    //   let saveParts = []
    //   this.localParts.forEach(part => {
    //     let start = part[0].timestamp
    //     let end = part[1].timestamp
    //     const contentFolder = '/content/'
    //
    //     this.files.forEach(file => {
    //       let part = {}
    //       // find start
    //       if (file.start <= start && file.end > start) {
    //         part.file = contentFolder + file.name
    //         part.start = (start - file.start) / 1000
    //       }
    //       // find end
    //       if (file.start < end && file.end >= end) {
    //         part.file = contentFolder + file.name
    //         part.end = (end - file.start) / 1000
    //       }
    //       // Check inner
    //       if (file.start > start && file.end < end) {
    //         part.file = contentFolder + file.name
    //         part.start = 0
    //         part.end = (file.end - file.start) / 1000
    //       }
    //       if (part.file) {
    //         saveParts.push(part)
    //       }
    //     })
    //   })
    //   return saveParts
    // }
  },

  methods: {
    ...mapActions('parts', {
      createParts: 'create',
      clearParts: 'clear',
      removePart: 'remove',
      setImage: 'set'
    }),
    ...mapActions('thumbnail', {
      setThumbnail: 'set'
    }),
    ...mapActions('timestamp', {
      changeTimestamp: 'change'
    }),
    // initParts () {
    //   let localParts = []
    //   this.parts.forEach(part => {
    //     localParts.push([
    //       { timestamp: part.start, img: '' },
    //       { timestamp: part.end, img: '' }
    //     ])
    //   })
    //   this.localParts = localParts
    // },
    // rewind (timestamp) {
    //   this.$emit('click', timestamp)
    // },
    // selectFrame (partIndex, frameIndex) {
    //   if (this.selectedPart[0] === partIndex && this.selectedPart[1] === frameIndex) {
    //     this.selectedPart = []
    //   } else {
    //     this.selectedPart = [partIndex, frameIndex]
    //     this.rewind(this.localParts[partIndex][frameIndex].timestamp)
    //   }
    // },
    changeFrame (timestamp) {
      if (this.selectedPart.length > 0) {
        // this.$set(this.localParts[this.selectedPart[0]], this.selectedPart[1], { timestamp: timestamp, img: '' })
        // this.localParts.sort((a, b) => a[0].timestamp - b[0].timestamp)
        // this.getImage()
      }
    },
    createThumbnail (timestamp) {
      this.image(timestamp).then(img => { this.setThumbnail(img) })
    }
  }
}
</script>

<style scoped>

</style>
