<template> <!--eslint-disable-->
  <div class="detailed__setting">
    <div class="detailed__setting_name">{{ name }}</div>
    <div class="detailed__setting_body">
      <div class="input-borders">
        <input class="input-border__horizontal" type="checkbox" :id="`inputBorders_${id}_top`" v-model="borderTop"
          @change="$emit('update', keyGroup, keySetting, toInt())">
        <label class="input-border__top" :for="`inputBorders_${id}_top`"></label>
        <div class="input-borders__middle">
          <input class="input-border__vertical" type="checkbox" :id="`inputBorders_${id}_left`" v-model="borderLeft"
            @change="$emit('update', keyGroup, keySetting, toInt())">
          <label class="input-border__left" :for="`inputBorders_${id}_left`"></label>

          <input class="input-border__vertical" type="checkbox" :id="`inputBorders_${id}_right`" v-model="borderRight"
            @change="$emit('update', keyGroup, keySetting, toInt())">
          <label class="input-border__right" :for="`inputBorders_${id}_right`"></label>
        </div>
        <input class="input-border__horizontal" type="checkbox" :id="`inputBorders_${id}_bottom`" v-model="borderBottom"
          @change="$emit('update', keyGroup, keySetting, toInt())">
        <label class="input-border__down" :for="`inputBorders_${id}_bottom`"></label>
      </div>
    </div>
  </div>
</template>

<script> /* eslint-disable */
export default {
  name: 'InputBorders',
  props: {
    name: String,
    id: Number,
    value: Number,
    keyGroup: String,
    keySetting: String,
  },
  data: () => {
    return {
      borderTop: null,
      borderRight: null,
      borderBottom: null,
      borderLeft: null,
    };
  },
  watch: {
    value(_value) {
      this.fromInt(_value);
    }
  },
  methods: {
    /**
     * Convert borders setting to number.
     * @return {Number} number formed borders
     */
    toInt() {
      return this.borderTop << 3 | this.borderRight << 2 | this.borderBottom << 1 | this.borderLeft;
    },

    /**
     * Convert borders setting from number.
     * @param {Number} value number formed borders
     */
    fromInt(value) {
      this.borderLeft = !!(value & 1);
      value >>= 1;
      this.borderBottom = !!(value & 1);
      value >>= 1;
      this.borderRight = !!(value & 1);
      value >>= 1;
      this.borderTop = !!(value & 1);
    },
  },
  mounted() {
    this.fromInt(this.value);
  },
};
</script>
