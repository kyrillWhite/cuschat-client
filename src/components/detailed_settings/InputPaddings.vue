<template> <!--eslint-disable-->
  <div class="detailed__setting">
    <div class="detailed__setting_name">{{ name }}</div>
    <div class="detailed__setting_body">
      <div class="input-paddings">
        <div class="input-paddings__borders"></div>
        <div class="input-padding input-paddings__top">
          <input class="input-paddings__input" 
            type="number" :id="`inputPaddings_${id}_top`" v-model="paddingTop"
            @change="$emit('update', keyGroup, keySetting, _toString())" min="0" max="999">
          <span class="input-paddings__units">px</span>
        </div>
        <div class="input-padding input-paddings__right">
          <input class="input-paddings__input"
            type="number" :id="`inputPaddings_${id}_right`" v-model="paddingRight"
            @change="$emit('update', keyGroup, keySetting, _toString())" min="0" max="999">
          <span class="input-paddings__units">px</span>
        </div>
        <div class="input-padding input-paddings__bottom">
          <input class="input-paddings__input"
            type="number" :id="`inputPaddings_${id}_bottom`" v-model="paddingBottom"
            @change="$emit('update', keyGroup, keySetting, _toString())" min="0" max="999">
          <span class="input-paddings__units">px</span>
        </div>
        <div class="input-padding input-paddings__left">
          <input class="input-paddings__input"
            type="number" :id="`inputPaddings_${id}_left`" v-model="paddingLeft"
            @change="$emit('update', keyGroup, keySetting, _toString())" min="0" max="999">
          <span class="input-paddings__units">px</span>
        </div>
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
    value: String,
    keyGroup: String,
    keySetting: String,
  },
  data: () => {
    return {
      paddingTop: null,
      paddingRight: null,
      paddingBottom: null,
      paddingLeft: null,
    };
  },
  watch: {
    value(_value) {
      this._fromString(_value);
    }
  },
  methods: {
    /**
     * Convert paddings setting to string.
     * @return {String} string formed paddings
     */
    _toString() {
      let paddingTop = this.paddingTop ? this.paddingTop : 0;
      let paddingRight = this.paddingRight ? this.paddingRight : 0;
      let paddingBottom = this.paddingBottom ? this.paddingBottom : 0;
      let paddingLeft = this.paddingLeft ? this.paddingLeft : 0;
      return `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;
    },

    /**
     * Convert paddings setting from string.
     * @param {String} value string formed paddings
     */
    _fromString(value) {
      const paddings = value.split(' ');
      this.paddingTop = paddings[0];
      this.paddingRight = paddings[1];
      this.paddingBottom = paddings[2];
      this.paddingLeft = paddings[3];
    },
  },
  mounted() {
    this._fromString(this.value);
  },
};
</script>
