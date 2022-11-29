<template>
  <form class="modal__link_body" @submit.prevent="copy">
    <input class="modal__link" type="text" ref = "linkStr" v-model="linkString" readonly>
    <button class="modal__button button button__small button_enabled"
      type="submit">{{ copied ? 'COPIED' : 'COPY' }}</button>
  </form>
</template>

<script>
export default { /* eslint-disable */
  name: 'ModalContentLink',
  data: () => {
    return {
      copied: false,
      linkString: '',
    };
  },
  props: {
    link: Promise,
  },
  methods: {
    async copy() {
      this.copied = true;
      this.$refs.linkStr.select();
      await document.execCommand('copy');
    },
  },
  async mounted() {
    this.linkString = await this.link;
  }
}
</script>
