<template>
  <div class="detailed__setting">
    <div class="detailed__setting_name">{{ name }}</div>
    <div class="detailed__setting_body">
      <input class="color-picker" type="color"
        name="color" :id="`colorPicker_${id}`" v-model="color" v-on:input="
        $emit('update', keyGroup, keySetting, color)">
      <label :style="{backgroundColor: color}"
        class="color-picker__label" :for="`colorPicker_${id}`"></label>
    </div>
  </div>
</template>

<script> /* eslint-disable */
export default {
  name: 'ColorPicker',
  props: {
    name: String,
    id: Number,
    value: String,
    keyGroup: String,
    keySetting: String,
  },
  data: () => {
    return {
      color: null,
    };
  },
  watch: {
    value(_value) {
      this.color = _value;
    }
  },
  mounted() {
    this.color = this.value;
  },
};
</script>
