<template>
  <div>
    <v-layout row wrap>
      <v-flex xs3>
        <v-text-field :label="$t('filter.search')" v-model="search"></v-text-field>
      </v-flex>
      <v-flex xs3 offset-xs1>
        <v-badge color="info">
          <v-text-field :label="$t('filter.hide.label')" v-model="durationMin" mask="###"></v-text-field>
          <v-tooltip bottom max-width="300" slot="badge">
            <span slot="activator">?</span>
            <span>{{ $t('filter.hide.tooltip') }}</span>
          </v-tooltip>
        </v-badge>
      </v-flex>
      <v-flex xs5 class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" :value="page"
                      :length="pages" :total-visible="10"
                      @input="changePage"></v-pagination>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="broadcast"
          item-key="id"
          :pagination.sync="pagination"
          :loading="loading"
          hide-actions
        >
          <template slot="items" slot-scope="props">
            <tr :class="classRow(props.item)"
                @click="props.expanded = !props.expanded">
              <td class="justify-center layout px-0">
                <v-tooltip top>
                  <v-btn icon class="mx-0" slot="activator" @click="play(props.item)">
                    <v-icon color="primary">play_circle_outline</v-icon>
                  </v-btn>
                  <span>{{ $t('table.actions.play') }}</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn icon class="mx-0" slot="activator" @click="mount(props.item)">
                    <v-icon color="primary">theaters</v-icon>
                  </v-btn>
                  <span>{{ $t('table.actions.mount') }}</span>
                </v-tooltip>
              </td>
              <td>{{ $d(new Date(props.item.start), 'short') }}</td>
              <!--<td>{{ props.item.start | formatDate }}</td>-->
              <td>{{ $d(props.item.end ? new Date(props.item.end) : new Date(), 'short') }}</td>
              <!--<td>{{ props.item.end | formatDate }}</td>-->
              <td>{{ totalDuration(props.item.parts) | durationToString }}</td>
              <td>{{ props.item.title }}</td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat v-if="props.item.videos">
              <v-card-text>
                <!--{{ props.item.videos }}-->
                <div v-for="item in props.item.videos.objects" :key="item.id">
                  {{ item.name }}
                </div>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import scheduleApi from '../api/schedule'
import videosApi from '../api/videos'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('websockets')

const messages = {
  en: {
    filter: {
      search: 'Search',
      append: {
        label: 'Append, min',
        tooltip: 'append'
      },
      hide: {
        label: 'Hide, sec',
        tooltip: 'Hide'
      }

    },
    table: {
      header: {
        actions: 'Actions',
        start: 'Start',
        end: 'End',
        duration: 'Duration',
        title: 'Title'
      },
      actions: {
        play: 'Play',
        mount: 'Mount'
      },
      minute: ' m ',
      seconds: ' s '
    }
  },
  ru: {
    filter: {
      search: 'Поиск',
      append: {
        label: 'Объединить, мин',
        tooltip: 'Объединиить в одну передачу два отрезка с одинаковым HarrisID, если между ними интервал времени не более указанного'
      },
      hide: {
        label: 'Скрыть менее, сек',
        tooltip: 'Не показывать и не учитывать отрезки продолжительностью менее указанной'
      }
    },
    table: {
      header: {
        actions: 'Действия',
        start: 'Начало',
        end: 'Окончание',
        duration: 'Длина',
        title: 'Название'
      },
      actions: {
        play: 'Воспроизвести',
        mount: 'Монтировать'
      },
      minute: ' м ',
      seconds: ' с '
    }
  }
}
const dateTimeFormats = {
  'en': {
    short: {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
  },
  'ru': {
    short: {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
  }
}
function delay (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

export default {
  data () {
    return {
      schedule: [],
      harrises: {},
      offsetTop: 0,
      pagination: {
        rowsPerPage: 10
      },
      durationMin: 1, // время отрезков в сек, меньше которого не отдавать с бекэнда
      intervalMax: 10, // время в мин, меньше которого склеивать в один отрезок отрезки с одинаковым HarrisID
      last_id: 0, // переменная для фиксации ID, чтобы избежать записей-дубликатов при запросе с бекэнда
      search: '',
      loading: false,
      num_results: 0,
      total_pages: 0,
      page: 1
    }
  },
  i18n: {
    messages,
    dateTimeFormats
  },
  computed: {
    ...mapGetters([
      'lock_harris'
    ]),
    headers () {
      return [
        { text: this.$t('table.header.actions'), align: 'center', sortable: false },
        { text: this.$t('table.header.start'), align: 'center', sortable: false, value: 'start' },
        { text: this.$t('table.header.end'), align: 'center', sortable: false, value: 'end' },
        { text: this.$t('table.header.duration'), align: 'center', sortable: false, value: 'duration' },
        { text: this.$t('table.header.title'), align: 'center', sortable: false, value: 'title' }
      ]
    },
    broadcast () {
      let broadcast = []
      let j = 0
      let scheduleLength = this.schedule.length
      if (scheduleLength > 0) {
        broadcast.splice(0, 1, {
          parts: [
            {
              start: this.schedule[0].start,
              end: this.schedule[0].end
            }
          ],
          id: j,
          harris: this.schedule[0].harris,
          videos: this.harrises[this.schedule[0].harris],
          title: this.schedule[0].title
        })
      }

      for (let i = 1; i < scheduleLength; i++) {
        let startNow = new Date(this.schedule[i].start)
        let endNow = new Date(this.schedule[i].end)
        let startLast = new Date(this.schedule[i - 1].start)
        let endLast = new Date(this.schedule[i - 1].end)

        let diff = Math.abs(startNow - endLast) / 1000
        let diff2 = Math.abs(startLast - endNow) / 1000
        let delta = Number(this.intervalMax) * 60

        if ((this.schedule[i].harris === broadcast[j].harris) && (diff < delta || diff2 < delta)) {
          broadcast[j].parts.push({
            start: this.schedule[i].start,
            end: this.schedule[i].end,
            duration: (endNow - startNow) / 1000
          })
          broadcast[j].parts = broadcast[j].parts.sort((a, b) => new Date(a.start) - new Date(b.start))
        } else {
          broadcast[j].start = broadcast[j].parts[0].start
          broadcast[j].end = broadcast[j].parts[broadcast[j].parts.length - 1].end
          j += 1
          broadcast.splice(j, 1, {
            parts: [
              {
                start: this.schedule[i].start,
                end: this.schedule[i].end,
                duration: (endNow - startNow) / 1000
              }
            ],
            id: j,
            harris: this.schedule[i].harris,
            videos: this.harrises[this.schedule[i].harris],
            title: this.schedule[i].title
          })
        }
      }
      return broadcast
    },
    pages () {
      if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) return 0
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },
  watch: {
    pagination () {
      this.pagination.page = this.page
    },
    durationMin () {
      this.initSchedule()
    },
    intervalMax () {
      this.initSchedule()
    }
  },
  methods: {
    initSchedule () {
      this.schedule = []
      this.last_id = 0
      this.update()
    },
    update () {
      this.loading = true
      scheduleApi.get({ search: this.search, durationMin: this.durationMin, page: this.page }, data => {
        this.schedule = this.schedule.concat(
          data.objects.filter(row => row.id < this.last_id || this.last_id === 0))
        this.last_id = Math.min.apply(Math, data.objects.map((o) => o.id))
        this.num_results = data.num_results
        this.total_pages = data.total_pages
        this.loading = false
        this.checkHarris(data)
      })
    },
    checkHarris (data) {
      data.objects.forEach(object => {
        if (this.harrises[object.harris] === undefined) {
          this.$set(this.harrises, object.harris, undefined)
        }
      })

      let chain = Promise.resolve()
      for (let harris in this.harrises) {
        chain = chain.then(() => delay(200)).then(() => {
          if (this.harrises[harris] === undefined) {
            videosApi.get({ search: harris }, data => {
              if (data.count > 0) {
                this.$set(this.harrises, harris, data)
              } else {
                this.$set(this.harrises, harris, false)
              }
            })
          }
        })
      }
    },
    changePage (page) {
      this.page = page
      if (page === this.pages) {
        this.update()
      }
      if (page === 1) {
        this.initSchedule()
      }
    },
    totalDuration: parts => {
      let total = 0
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].duration > 0) {
          total += parts[i].duration
        }
      }
      return Math.round(total)
    },
    classRow (item) {
      return {
        success: item.videos,
        error: this.lock_harris.filter(elem => elem.harris === item.harris).length
      }
    },
    play (item) {
      this.$emit('play', item)
    },
    mount (item) {
      this.$emit('mount', item)
    }
  },
  filters: {
    formatDate: dateString => {
      if (!dateString) return
      let options = {
        month: 'short',
        day: 'numeric',
        // timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric'
      }
      let dateFormat = new Date(dateString)
      return dateFormat.toLocaleString('ru', options)
    },
    durationToString: seconds => {
      let min = Math.round(seconds / 60)
      if (min > 0) {
        min = min.toString() + ' m '
      } else {
        min = ''
      }
      let sec = seconds % 60
      sec = sec.toString() + ' s '
      return min + sec
    }
  },
  created () {
    this.update()
  }
}
</script>

<style scoped>
  .help-label {
    max-width: 200px;
  }
</style>
