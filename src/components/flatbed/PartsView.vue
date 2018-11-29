<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap align-center fill-height>

      <!--thumbnail-->
      <v-flex v-if="thumbnail" xl1 lg2 xs2 md2>
        <v-hover>
          <v-card slot-scope="{ hover }">
            <v-img :src="thumbnail">
              <v-layout v-if="hover" pa-2 align-center justify-center fill-height class="lightbox white--text">
                <v-btn small block @click="resetThumbnail">
                  {{ $t('buttons.clear') }}
                  <v-icon dark right>clear</v-icon>
                </v-btn>
              </v-layout>
            </v-img>
          </v-card>
        </v-hover>
      </v-flex>

      <!--parts-->
      <v-flex v-for="(part, partIndex) in parts" :key="partIndex" xl2 lg3 xs4 md3>
        <!--header-->
        <v-hover>
          <div slot-scope="{ hover }" style="border-style: solid; border-width: 1px; height: 40px">
            <div v-if="hover">
              <v-btn flat small block @click="deletePart(partIndex)">
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
                  <div class="pb-1" :class="selectedClass(partIndex, frameIndex)">
                    <v-img v-if="!!frame.img" :src="frame.img" alt=""></v-img>
                  </div>
                </span>
            </v-flex>
          </v-layout>
          <div class="film-strip"></div>
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
const messages = {
  en: {
    buttons: {
      clear: 'delete'
    }
  },
  ru: {
    buttons: {
      clear: 'удалить'
    }
  }
}
export default {
  name: 'partsView',

  props: [
    'parts',
    'selected',
    'thumbnail'
  ],

  data () {
    return {
      count: 0
    }
  },

  i18n: {
    messages: messages
  },

  methods: {
    resetThumbnail () {
      this.$emit('resetThumbnail')
    },
    selectFrame (partIndex, frameIndex) {
      this.$emit('select', partIndex, frameIndex)
    },
    deletePart (partIndex) {
      this.$emit('delete', partIndex)
    },
    selectedClass (partIndex, frameIndex) {
      return { primary: this.selected[0] === partIndex && this.selected[1] === frameIndex }
    }
  },

  filters: {
    filterTime (value) {
      let d = new Date(value)
      return d.toTimeString().slice(0, 8) + '.' + d.getMilliseconds()
    }
  }
}
</script>

<style scoped>
  .film-strip {
    background-image: linear-gradient(to right, white 50%, transparent 50%);
    background-size: 15px 100%;
    background-repeat: repeat-x;
    width: 100%;
    height: 5px;
  }
</style>
