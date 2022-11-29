<template>
  <div class="detailed__setting">
    <div class="detailed__setting_name">{{ name }}</div>
    <div class="detailed__setting_body">
      <input class="input-number" type="number" :id="`inputNumber_${id}`" v-model="num"
        v-on:input="$emit('update', keyGroup, keySetting, parseInt(num))" min="0" max="99999">
      {{ unitType }}
    </div>
  </div>
</template>

<script> /* eslint-disable */
export default {
  name: 'inputNumber',
  props: {
    name: String,
    id: Number,
    value: Number,
    keyGroup: String,
    keySetting: String,
    unitType: String,
  },
  data: () => {
    return {
      num: null,
    };
  },
  watch: {
    value(_value) {
      this.num = _value;
    }
  },
  mounted() {
    this.num = this.value;
  },
};
</script>
