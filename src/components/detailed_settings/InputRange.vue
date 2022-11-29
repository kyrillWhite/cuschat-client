<template>
  <div class="detailed__setting">
    <div class="detailed__setting_name">{{ name }}</div>
    <div class="detailed__setting_body">
      <input @mouseover="hovered = true" @mouseleave="hovered = false"
        :style="{ background: createBackgroundString }"
        class="input-range" type="range" :id="`inputRange_${id}`" v-model="num"
        v-on:input="$emit('update', keyGroup, keySetting, parseFloat(num))"
        min="0" max="1" step="0.01">
      <span class="input-range__value">{{ parseInt(num * 100) }}%</span>
    </div>
  </div>
</template>

<script> /* eslint-disable */
export default { 
  name: 'InputRange',
  props: {
    name: String,
    id: Number,
    value: Number,
    keyGroup: String,
    keySetting: String,
  },
  data: () => {
    return {
      hovered: false,
      num: null,
    };
  },
  watch: {
    value(_value) {
      this.num = _value;
    }
  },
  computed: {
    createBackgroundString() {
      let valueColor = this.hovered ? '--primary-color' : '--title-color';
      return `linear-gradient(to right, var(${valueColor}) 0%, var(${valueColor}) ${this.num * 100}%,
        var(--secondary-color) ${this.num * 100}%, var(--secondary-color) 100%)`;
    }
  },
  mounted() {
    this.num = this.value;
  }
};
</script>
