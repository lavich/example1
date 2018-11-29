<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs3>
        <v-text-field :label="$t('filter.search')" v-model="search"/>
      </v-flex>
      <v-flex xs3 offset-xs1>
        <v-text-field :label="$t('filter.folder')" v-model="folder"/>
      </v-flex>
      <v-spacer/>
      <v-tooltip top>
        <v-btn slot="activator" @click="update">
          <v-icon left>autorenew</v-icon>
          {{ $t("buttons.update.title") }}
        </v-btn>
        <span>{{ $t("buttons.update.span") }}</span>
      </v-tooltip>
      <v-tooltip top>
        <btn-upload-video slot="activator" editable @success="update">
          <v-icon left>cloud_upload</v-icon>
          {{ $t("buttons.upload.title") }}
        </btn-upload-video>
        <span>{{ $t("buttons.upload.span") }}</span>
      </v-tooltip>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="videos"
          :pagination.sync="pagination"
          :total-items="num_results"
          :loading="loading"
          hide-actions
        >
          <template slot="items" slot-scope="props">
            <td>{{ getFolder(props.item.path) }}</td>
            <td><a @click="$emit('click', props.item)">{{ props.item.name }}</a></td>
            <td class="justify-center layout px-0">
              <v-tooltip top>
                <v-btn icon class="mx-0" slot="activator"
                       :disabled="!accessRules.update"
                       @click="moveToTrash(props.item)">
                  <v-icon color="warning">delete</v-icon>
                </v-btn>
                <span>{{ $t("table.actions.toTrash") }}</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn icon class="mx-0" slot="activator"
                       :disabled="!accessRules.delete"
                       @click="deleteOnPlatformcraft(props.item.id)">
                  <v-icon color="error">delete</v-icon>
                </v-btn>
                <span>{{ $t("table.actions.delete") }}</span>
              </v-tooltip>

            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page"
                        :length="total_pages" :total-visible="10"
                        @input="update"
          />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import videosApi from '../api/videos'
import btnUploadVideo from './savebutton/SaveButton'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('auth')
const messages = {
  en: {
    buttons: {
      update: {
        title: 'Update',
        span: 'Update video list'
      },
      upload: {
        title: 'Upload',
        span: 'Upload video'
      }
    },
    filter: {
      search: 'Search',
      folder: 'Folder'
    },
    table: {
      header: {
        folder: 'Folder',
        title: 'Title',
        actions: 'Actions'
      },
      actions: {
        delete: 'Delete',
        toTrash: 'To trash'
      }
    }
  },
  ru: {
    buttons: {
      update: {
        title: 'Обновить',
        span: 'Обновить список видео'
      },
      upload: {
        title: 'Загрузить',
        span: 'Загрузить свое видео'
      }
    },
    filter: {
      search: 'Поиск',
      folder: 'Папка'
    },
    table: {
      header: {
        folder: 'Папка',
        title: 'Названия',
        actions: 'Действия'
      },
      actions: {
        delete: 'Удалить',
        toTrash: 'В корзину'
      }
    }
  }
}
export default {
  data () {
    return {
      videos: [],
      pagination: {
        rowsPerPage: 10
      },
      total_pages: 0,
      num_results: 0,
      folder: '',
      search: '',
      loading: false
    }
  },
  i18n: {
    messages: messages
  },
  computed: {
    ...mapGetters([
      'accessRules'
    ]),
    headers () {
      return [
        { text: this.$t('table.header.folder'), sortable: false },
        { text: this.$t('table.header.title'), sortable: false },
        { text: this.$t('table.header.actions'), align: 'center', sortable: false }
      ]
    }
  },
  watch: {
    pagination: {
      handler () {
        this.update()
      },
      deep: true
    },
    folder () {
      this.update()
    },
    search () {
      this.update()
    }
  },
  methods: {
    update () {
      this.loading = true
      videosApi.get({
        limit: this.pagination.rowsPerPage,
        start: this.pagination.rowsPerPage * (this.pagination.page - 1),
        search: this.search,
        folder: this.folder
      }, data => {
        this.loading = false
        if (!data) return
        this.videos = data.objects
        this.num_results = data.count
        this.total_pages = Math.ceil(this.num_results / this.pagination.rowsPerPage) || 0
      })
    },
    moveToTrash (object) {
      let regexTrash = new RegExp('^корзина/?(.*)')
      let oldFolder = this.getFolder(object.path)
      let isTrash = regexTrash.exec(oldFolder)
      let newFolder = '/'
      if (isTrash) {
        newFolder += isTrash[1]
      } else {
        newFolder = 'корзина'
        if (oldFolder != null) {
          newFolder += '/' + oldFolder
        }
      }
      videosApi.put({ folder: newFolder, id: object.id }, () => this.update())
    },
    deleteOnPlatformcraft (id) {
      videosApi.delete({ id: id }, () => this.update())
    },
    getFolder (value) {
      let regexFolder = new RegExp('^/(.*)/')
      let folder = regexFolder.exec(value)
      if (folder) {
        folder = folder[1]
        return folder
      }
    }
  },
  created () {
    this.update()
  },
  components: {
    btnUploadVideo
  }
}
</script>

<style scoped>

</style>
