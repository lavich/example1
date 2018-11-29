<template>
  <v-container>
    <v-layout row>
      <v-flex xs10>
        <vue-slider ref="slider" v-model="timestamp" :min="min" :max="max" :interval="interval" :lazy="true" :piecewise-label="true">
          <template slot="tooltip" slot-scope="{ value }">
            <div style="margin-top: 20px">
              <span class="label label-primary" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);">
                {{ $t('table.actions.mount') }}
              </span>
            </div>
          </template>
          <template slot="label" slot-scope="{ label }">
            <div style="margin-top: 30px">
              <span class="vue-slider-piecewise-label" v-if="checkLabels(label)">
                {{ formatLabel(label) }}
              </span>
            </div>
          </template>
        </vue-slider>
      </v-flex>
      <v-flex xs2>
        <v-btn-toggle v-model="scaleMode">
          <v-btn class="scale-btn" flat v-for="(range, index) in ranges" :key="range.value" @click="rangeId=index">
            {{ range.name }}
          </v-btn>
        </v-btn-toggle>

        <v-btn-toggle block v-model="rewindMode">
          <v-btn block class="scale-btn" flat value="fastbackward">
            &lt;&lt;
          </v-btn>
              <v-btn class="scale-btn" flat value="backward">
                &lt;
              </v-btn>
              <v-btn class="scale-btn" flat value="forward">
                &gt;
              </v-btn>
              <v-btn class="scale-btn" flat value="fastforward">
                &gt;&gt;
              </v-btn>
        </v-btn-toggle>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import vueSlider from 'vue-slider-component'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('videoslider')

export default {
  data: function () {
    return {
      rangeId: 0,
      ranges: [
        {
          name: '2н',
          value: 2 * 604800000,
          format: {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          }
        },
        {
          name: '1д',
          value: 86400000,
          format: {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          }
        },
        {
          name: '1ч',
          value: 3600000,
          format: {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }
        },
        {
          name: '1м',
          value: 60000,
          format: {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }
        }
      ],
      fastForwardRanges: [
        {
          x: 86400000,
          x2: 86400000
        },
        {
          x: 3600000,
          x2: 86400000
        },
        {
          x: 60000,
          x2: 3600000
        },
        {
          x: 1000,
          x2: 60000
        }
      ],
      files: null,
      rewindMode: 'forward',
      scaleMode: '2Н'
    }
  },
  watch: {
    timestamp_max: function () {
      if (this.timestamp > this.timestamp_max) {
        this.timestamp = this.timestamp_max
      }
    },
    timestamp_min: function () {
      if (this.timestamp < this.timestamp_min) {
        this.timestamp = this.timestamp_max
      }
    }
  },
  computed: {
    max: function () {
      let max = Math.round(
        this.timestamp + this.ranges[this.rangeId].value / 2
      )
      return max < this.timestamp_max ? max : this.timestamp_max
    },
    min: function () {
      let min = Math.round(
        this.timestamp - this.ranges[this.rangeId].value / 2
      )
      return min > this.timestamp_min ? min : this.timestamp_min
    },
    interval: function () {
      return (this.max - this.min) / 500
    },
    timestamp: {
      get: function () {
        return this.$store.state.videoslider.timestamp
      },
      set: function (timestamp) {
        this.$store.commit('videoslider/updateSliderTimestamp', Math.floor(timestamp))
      }
    },
    ...mapState([
      'timestamp_max',
      'timestamp_min'
    ])
  },
  methods: {
    checkLabels: function (value) {
      return (
        (value - this.min) % Math.round((this.max - this.min) / 4.9) <=
        this.interval
      )
    },
    formatLabel: function (value) {
      let dateFormat = new Date(value)
      return dateFormat.toLocaleString('en', this.ranges[this.rangeId].format)
    },
    formatTooltip: function (value) {
      let dateFormat = new Date(value)
      let format = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }
      return dateFormat.toLocaleString('ru', format)
    },
    fastForward: function (value) {
      console.log('fast forwar value', value)
      this.timestamp += value
    }
    // emitTimestamp: function (v) {
    //   console.log(v)
    // }
  },
  components: {
    vueSlider
  }
  //   created: function () {
  //     bus.$on('seekbar-set-range', (min, max) => {
  //       this.timestamp_min = min
  //       this.timestamp_max = max
  //     })
  //     bus.$on('video-time-update', (time) => {
  //       this.timestamp = time
  //     })
  //   }
}
</script>

<style scoped>
.scale-btn {
  min-width: 2.8em;
}
</style>
