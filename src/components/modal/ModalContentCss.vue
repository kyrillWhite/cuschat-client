<template>
  <form class="modal__css" @submit.prevent="copy">
    <textarea ref = "cssStr" class="modal__css_input" type="text"
      rows="20" v-model="css" readonly></textarea>
    <button class="modal__button button button__small button_enabled"
      type="submit">{{ copied ? 'COPIED' : 'COPY' }}</button>
  </form>
</template>

<script>
export default { /* eslint-disable */
  name: 'ModalContentCss',
  data: () => {
    return {
      copied: false,
    };
  },
  props: {
    css: String,
  },
  methods: {
    async copy() {
      this.copied = true;
      this.$refs.cssStr.select();
      await document.execCommand('copy');
    },
  },
}
</script>
