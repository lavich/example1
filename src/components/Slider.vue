<template>
  <v-container fluid grid-list-xl>
    <v-layout row justify-center style="margin-top: 30px">
      <v-flex xl9 lg8 md8 xs10>
        <vue-slider ref="slider" :value="value"
                    :min="minTimestamp" :max="maxTimestamp" :interval="interval"
                    :lazy="true" :piecewise-label="true"
                    @callback="emitTimestamp"
        >
          <template slot="tooltip" slot-scope="{ value }">
            <v-chip style="margin-top: 20px">
              {{ formatTooltip(value) }}
            </v-chip>
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
      <v-flex xl2 lg3 md4 xs2>
        <v-btn-toggle v-model="scaleMode" style="width: 170px">
          <v-btn small block v-for="(range, index) in ranges"
                 :value="range.name"
                 :key="range.value"
                 @click="rangeId=index"
          >
            {{ range.name }}
          </v-btn>
        </v-btn-toggle>
        <v-btn-toggle block style="width: 170px">
          <v-btn v-for="(icon, index) in rewindIcons"
                 :key="index"
                 small block
                 @click="rewind(index)"
          >
            <v-icon>{{ icon }}</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import vueSlider from 'vue-slider-component'

let timeStampNow = offset => {
  let d = new Date()
  if (offset) {
    d.setDate(d.getDate() + offset)
  }
  return d / 1
}

const messages = {
  en: {
    sliderTimeLocale: 'en',
    week: 'W',
    day: 'D',
    hour: 'H',
    minute: 'M'
  },
  ru: {
    sliderTimeLocale: 'ru',
    week: 'Н',
    day: 'Д',
    hour: 'Ч',
    minute: 'М'
  }
}
export default {
  props: {
    value: {
      value: Number,
      default: timeStampNow()
    },
    min: {
      value: Number,
      default: timeStampNow(-14)
    },
    max: {
      value: Number,
      default: timeStampNow()
    }
  },
  data () {
    return {
      rangeId: 0,
      ranges: [
        {
          name: '2' + this.$t('week'),
          value: 2 * 604800000,
          format: {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          }
        },
        {
          name: this.$t('day'),
          value: 86400000,
          format: {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          }
        },
        {
          name: this.$t('hour'),
          value: 3600000,
          format: {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }
        },
        {
          name: this.$t('minute'),
          value: 60000,
          format: {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }
        }
      ],
      rewindIcons: ['fast_rewind', 'skip_previous', 'skip_next', 'fast_forward'],
      rewindRanges: [
        [-86400000, -86400000, 86400000, 86400000],
        [-86400000, -3600000, 3600000, 86400000],
        [-3600000, -60000, 60000, 3600000],
        [-60000, -1000, 1000, 60000]
      ],
      files: null,
      scaleMode: '1д'
    }
  },
  i18n: {
    messages: messages
  },
  computed: {
    maxTimestamp () {
      return Math.round(this.value + this.ranges[this.rangeId].value / 2)
    },
    minTimestamp () {
      return Math.round(this.value - this.ranges[this.rangeId].value / 2)
    },
    interval () {
      return (this.maxTimestamp - this.minTimestamp) / 500
    }
  },
  methods: {
    checkLabels (value) {
      return (value - this.minTimestamp) % Math.round((this.maxTimestamp - this.minTimestamp) / 4.9) < this.interval &&
        value !== this.minTimestamp
    },
    formatLabel (value) {
      let dateFormat = new Date(value)
      return dateFormat.toLocaleString(this.$t('sliderTimeLocale'), this.ranges[this.rangeId].format)
    },
    formatTooltip (value) {
      let dateFormat = new Date(value)
      let format = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }
      return dateFormat.toLocaleString(this.$t('sliderTimeLocale'), format)
    },
    rewind (index) {
      let offset = this.rewindRanges[this.rangeId][index]
      this.emitTimestamp(this.value + offset)
    },
    emitTimestamp (timestamp) {
      this.$emit('input', timestamp)
    }
  },
  components: {
    vueSlider
  }
}
</script>

<style scoped>
</style>
