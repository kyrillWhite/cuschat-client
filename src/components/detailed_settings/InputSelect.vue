<template>
  <div class="detailed__setting">
    <div class="detailed__setting_name">{{ name }}</div>
    <div class="detailed__setting_body">
      <select @change="$emit('update', keyGroup, keySetting, selected)"
        class="input-select" v-model="selected">
        <option v-for="(option, index) in list"
          :key="index" :value="index">
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script> /* eslint-disable */
export default {
  name: 'InputSelect',
  props: {
    name: String,
    id: Number,
    value: Number,
    list: Array,
    keyGroup: String,
    keySetting: String,
  },
  data: () => {
    return {
      selected: null,
    };
  },
  watch: {
    value(_value) {
      this.selected = _value;
    }
  },
  mounted() {
    this.selected = this.value;
  },
};
</script>
