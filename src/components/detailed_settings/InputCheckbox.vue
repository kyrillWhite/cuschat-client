<template>
  <div class="detailed__setting">
    <div class="detailed__setting_name">{{ name }}</div>
    <div class="detailed__setting_body">
      <input class="input-checkbox" type="checkbox" :id="`inputCheckbox_${id}`" v-model="checked"
        @change="$emit('update', keyGroup, keySetting, checked)">
      <label class="input-checkbox__label input-checkbox__label_dark"
        :for="`inputCheckbox_${id}`"></label>
    </div>
  </div>
</template>

<script>  /* eslint-disable */
export default {
  name: 'InputCheckbox',
  props: {
    name: String,
    id: Number,
    value: Boolean,
    keyGroup: String,
    keySetting: String,
  },
  data: () => {
    return {
      checked: null,
    };
  },
  watch: {
    value(_value) {
      this.checked = _value;
    }
  },
  mounted() {
    this.checked = this.value;
  },
};
</script>
