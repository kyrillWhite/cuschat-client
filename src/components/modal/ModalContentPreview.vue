<template>
  <div class="modal__preview">
    <div class="modal__preview_body">
      <Chat :settingsProp="settingsProp" :gettingNewMessages="true"/>
    </div>
  </div>
</template>

<script>
import Chat from '../Chat';

export default { /* eslint-disable */
  name: 'ModalContentPreview',
  props: {
    settingsProp: Object,
  },
  components: {
    Chat,
  },
}
</script>
