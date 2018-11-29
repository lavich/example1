<template>
  <!--<v-container fluid grid-list-md>-->
  <!--<v-layout row wrap align-center fill-height>-->
  <!--<v-btn @click="createParts(timestamp)" flat small>-->
  <!--<v-icon left>library_add</v-icon>-->
  <!--{{ $t('buttons.add') }}-->
  <!--</v-btn>-->
  <!--<v-btn @click="clearParts" :disabled="parts.length === 0" flat small>-->
  <!--<v-icon left>clear</v-icon>-->
  <!--{{ $t('buttons.clear') }}-->
  <!--</v-btn>-->
  <!--<v-btn @click="dialog = true" :disabled="parts.length === 0" flat small>-->
  <!--<v-icon left>save</v-icon>-->
  <!--{{ $t('buttons.save') }}-->
  <!--</v-btn>-->
  <!--<save-dialog v-model="dialog"-->
  <!--:disabled="localParts.length === 0"-->
  <!--:parts="partsForSave"-->
  <!--:harris="harris"-->
  <!--:name="name"-->
  <!--:thumbnail="thumbnail"-->
  <!--:date="datetime.slice(0, 10)"-->
  <!--:time="datetime.slice(11, 16)"-->
  <!--:editable="!harris || !datetime"-->
  <!--@success="clearParts"-->
  <!--&gt;</save-dialog>-->
  <!--</v-layout>-->
  <!--<v-divider></v-divider>-->
  <v-layout row wrap align-center fill-height>
    <!--<v-layout row class="pt-2 elevation-4 grey lighten-2">-->

    <v-flex v-for="(part, partIndex) in parts" :key="partIndex" xl2 lg3 xs4 md3>
      <!--header-->
      <v-hover>
        <div slot-scope="{ hover }" style="border-style: solid; border-width: 1px; height: 40px">
          <div v-if="hover">
            <v-btn flat small block @click="removePart(partIndex)">
              {{ $t('buttons.clear') }}
              <v-icon right>clear</v-icon>
            </v-btn>
          </div>
          <div v-else>
            <span class="caption">{{ part[0].timestamp | moment('DD/MM, HH:mm:ss') }}</span>
            <span class="caption" style="float: right">{{ part[1].timestamp | moment('DD/MM, HH:mm:ss') }}</span>
          </div>
        </div>
      </v-hover>
      <!--film-strip-->
      <v-card class="grey darken-2 py-1">
        <div class="film-strip"></div>
        <v-layout row wrap>
          <v-flex v-for="(frame, frameIndex) in part"
                  :key="frameIndex"
                  xl6 lg6 xs6>
                <span @click="selectFrame(partIndex, frameIndex)">
                  <div class="pb-1">
                    <v-img v-if="!!frame.img" :src="frame.img"></v-img>
                    <div v-else class="image_placeholder"></div>
                  </div>
                </span>
          </v-flex>
        </v-layout>
        <div class="film-strip"></div>
      </v-card>
    </v-flex>
  </v-layout>
  <!--</v-container>-->
</template>

<script>

import SaveDialog from '@/components/savebutton/SaveButton'

import { mapActions, mapGetters } from 'vuex'

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
      clear: 'удалить',
      save: 'сохранить'
    }
  }
}
export default {
  name: 'Parts',

  i18n: {
    messages: messages
  },

  components: {
    SaveDialog
  },

  data () {
    return {
      selectedPart: [],
      dialog: false
    }
  },

  computed: {
    ...mapGetters('files', [
      'files'
    ]),
    ...mapGetters('parts', [
      'parts'
    ]),
    ...mapGetters('timestamp', [
      'timestamp'
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
    ...mapActions('parts', {
      createParts: 'create',
      clearParts: 'clear',
      removePart: 'remove',
      setImage: 'set'
    }),
    ...mapActions('timestamp', {
      changeTimestamp: 'change'
    }),
    selectFrame (partIndex, frameIndex) {
      if (this.selectedPart[0] === partIndex && this.selectedPart[1] === frameIndex) {
        this.selectedPart = []
      } else {
        this.selectedPart = [partIndex, frameIndex]
      }
      this.changeTimestamp(this.parts[partIndex][frameIndex].timestamp)
    },
    changeFrame (timestamp) {
      if (this.selectedPart.length > 0) {
        this.$set(this.localParts[this.selectedPart[0]], this.selectedPart[1], { timestamp: timestamp, img: '' })
        this.localParts.sort((a, b) => a[0].timestamp - b[0].timestamp)
        this.getImage()
      }
    }
  }
}
</script>

<style scoped>
  .image_placeholder {
    width: 160px;
    height: 70px;
  }

  .film-strip {
    background-image: linear-gradient(to right, white 50%, transparent 50%);
    background-size: 15px 100%;
    background-repeat: repeat-x;
    width: 100%;
    height: 5px;
  }
</style>
