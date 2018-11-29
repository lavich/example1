<template>
  <v-dialog v-model="value" persistent max-width="600px">
    <v-card>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-title primary-title class="primary">
          <span class="headline white--text">{{ $t('form.title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field :label="$t('form.video_title')" v-model="name"
                              :rules="[v => !!v || 'Недопустимое название']"
                              required></v-text-field>
              </v-flex>
              <v-flex xs12 v-if="!parts">
                <upload-file @input="(filename) => this.filename = filename"
                             @file="(file) => this.file = file"
                ></upload-file>
              </v-flex>
              <v-flex xs12 sm6>
                <v-menu
                  ref="menuDate"
                  :close-on-content-click="false"
                  v-model="menuDate"
                  :nudge-right="40"
                  :return-value.sync="date"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                  required
                  :disabled="!editable"
                >
                  <v-text-field
                    slot="activator"
                    v-model="date"
                    :label="$t('form.start_date')"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="date" @input="$refs.menuDate.save(date)"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6>
                <v-menu
                  ref="menuTime"
                  :close-on-content-click="false"
                  v-model="menuTime"
                  :nudge-right="40"
                  :return-value.sync="time"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                  required
                  :disabled="!editable"
                >
                  <v-text-field
                    slot="activator"
                    v-model="time"
                    :label="$t('form.start_time')"
                    prepend-icon="access_time"
                    readonly
                  ></v-text-field>
                  <v-time-picker v-model="time" @change="$refs.menuTime.save(time)"></v-time-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete
                  :loading="loading"
                  :items="folderList"
                  :search-input.sync="searchFolder"
                  v-model="folder"
                  :label="$t('form.folder')"
                  prepend-icon="folder_open"
                  autocomplete
                  @blur="createFolder"
                  @keyup.enter="createFolder"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12>
                <v-switch :label="$t('form.create_player')" color="primary" v-model="is_player" disabled></v-switch>
              </v-flex>
              <v-flex xs12 v-if="is_player">
                <v-select
                  :items="geoList"
                  v-model="geo"
                  item-text="name"
                  item-value="value"
                  :label="$t('form.geo_limitations')"
                  prepend-icon="language"
                ></v-select>
              </v-flex>
              <v-flex xs12 v-if="is_player">
                <v-autocomplete
                  value=""
                  :items="qualityList"
                  v-model="quality"
                  item-text="name"
                  item-value="value"
                  :label="$t('form.resolution')"
                  prepend-icon="settings"
                  chips deletable-chips
                  multiple
                  autocomplete
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
          <small>{{ $t('form.mandatory_fields') }}</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="error" @click.native="$emit('input', false)">{{ $t('form.cancle') }}</v-btn>
          <v-spacer/>
          <v-btn v-if="!parts" color="success" :disabled="!valid" @click="uploadVideo">Сохранить</v-btn>
          <v-btn v-if="parts" color="success" :disabled="!valid" @click="makeVideo">{{ $t('form.create') }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import uploadFile from './uploadFile'
import videosApi from '../../api/videos'
import makeVideoApi from '../../api/make_video'
import { mapActions } from 'vuex'

let dateNow = () => {
  let date = new Date().toISOString()
  return date.slice(0, 10)
}

let timeNow = () => {
  let date = new Date().toISOString()
  return date.slice(11, 16)
}

const messages = {
  en: {
    form: {
      title: 'Save video',
      video_title: 'Title',
      start_date: 'Start date',
      start_time: 'Start time',
      folder: 'Folder',
      create_player: 'Create player',
      geo_limitations: 'Geo limitations',
      resolution: 'Video qualities',
      world: 'World',
      russia: 'Russia',
      cancle: 'cancle',
      create: 'create',
      mandatory_fields: '*mandatory fields'
    }
  },
  ru: {
    form: {
      title: 'Сохранение видео',
      video_title: 'Название',
      start_date: 'Дата начала',
      start_time: 'Время начала',
      folder: 'Папка',
      create_player: 'Создать плеер',
      geo_limitations: 'Разрешено к показу',
      world: 'Весь мир',
      russia: 'Россия',
      resolution: 'Разрешения плеера',
      cancle: 'Отмена',
      create: 'Создать',
      mandatory_fields: '*поля обязательные для заполнения'
    }
  }
}

export default {
  props: {
    value: { type: Boolean, default: false },
    title: { type: String },
    name: { type: String },
    harris: { type: String },
    thumbnail: { type: String },
    date: { type: String, default: dateNow() },
    time: { type: String, default: timeNow() },
    parts: { type: Array },
    editable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  i18n: {
    messages: messages
  },
  data: () => ({
    geoList: null,
    geo: {},
    qualityList: [
      { name: '360', value: '5676a27cf9cb101634000006' },
      { name: '480', value: '5676a27cf9cb101634000004' },
      { name: '720', value: '5676a27cf9cb101634000003' }
    ],
    quality: [],
    folder: '',
    folderList: [],
    loading: false,
    searchFolder: null,
    menuDate: false,
    menuTime: false,
    is_player: false,
    valid: true,
    filename: '',
    file: ''
  }),
  methods: {
    ...mapActions('thumbnail', {
      uploadThumbnail: 'upload'
    }),
    getMessage: function (key) {
      return this.$t(key)
    },
    queryFolders () {
      this.loading = true
      videosApi.getFolders(data => {
        this.folderList = data
        this.loading = false
      })
    },
    createFolder () {
      this.folderList.push(this.searchFolder)
      this.folder = this.searchFolder
    },
    uploadVideo () {
      if (this.$refs.form.validate() && this.file) {
        this.$emit('input', false)
        let formData = new FormData()
        let name = this.date + ' ' + this.time.replace(/:/gi, '.') + ' ' + this.name + ' ' + this.harris
        formData.append('file', this.file)
        formData.append('name', name)
        console.log(name)
        formData.append('folder', this.folder)
        if (this.is_player) {
          formData.append('create_player', true)
          formData.append('geo', JSON.stringify(this.geo))
          formData.append('presets', JSON.stringify(this.quality))
        }
        videosApi.post(formData, () => this.$emit('success'))
      }
    },
    makeVideo () {
      if (this.$refs.form.validate()) {
        this.$emit('input', false)

        let data = {}
        data.name = this.date + ' ' + this.time.replace(/:/gi, '.') + ' ' + this.name + ' ' + this.harris
        data.parts = JSON.stringify(this.parts)
        data.folder = this.folder
        data.create_player = this.is_player
        data.presets = JSON.stringify(this.quality)
        data.geo = this.geo

        this.uploadThumbnail(data.name)
        makeVideoApi.post(data, () => this.$emit('success'))
      }
    }
  },
  components: {
    uploadFile
  },

  created () {
    this.queryFolders()
    this.geoList = [
      { name: this.getMessage('form.world'), value: {} },
      { name: this.getMessage('form.russia'), value: { EU: { RU: true } } }
    ]
  }
}
</script>

<style scoped>

</style>
