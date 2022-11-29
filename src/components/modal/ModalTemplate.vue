<template>
  <div>
    <div class="bg_dark-mask" v-on:click="$emit('closeModal')"></div>
    <div class="modal">
      <div class="modal__header">
        <div class="modal__header_title" v-if="type == 'link'">CHAT LINK</div>
        <div class="modal__header_title" v-else-if="type == 'preview'">CHAT PREVIEW</div>
        <div class="modal__header_title" v-else-if="type == 'css'">CHAT CSS</div>
        <button class="modal__header_cross" v-on:click="$emit('closeModal')"></button>
      </div>
      <div class="modal__body">
        <ModalContentLink v-if="type == 'link'" :link="info.link"/>
        <ModalContentPreview v-else-if="type == 'preview'" :settingsProp="info"/>
        <ModalContentCss v-else-if="type == 'css'" :css="info.css"/>
      </div>
    </div>
  </div>
</template>

<script>
import ModalContentLink from './ModalContentLink';
import ModalContentPreview from './ModalContentPreview';
import ModalContentCss from './ModalContentCss';

export default {
  name: 'ModalTemplate',
  props: {
    type: String,
    info: Object,
  },
  components: {
    ModalContentLink,
    ModalContentPreview,
    ModalContentCss,
  },
};
</script>
