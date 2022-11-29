<template>
  <form class="service__form" @submit.prevent="connectToService">
    <div class="service__part service__name">
      <img class="service__logo" :src="require(`../assets/images/${name}Logo.png`)">
      <label class="service__title">{{ title }}</label>
    </div>
    <div class="service__input_wrapper">
      <div class="service__input">
        <input v-show="!source && !validating" class="service__input-text"
          type="text" :placeholder="placeHolder" v-model="url">
        <label v-bind:class="{'service__input_label': !source,
         'service__input_label-text': source || validating}">
          <span v-if="error" class="service__input-error">{{ error }}</span>
          <span v-else-if="validating" class="service__input-validating">Validating...</span>
          <span v-else-if="source" class="service__input-connected">
            '{{ source }}' is correct {{ sourceType }}
          </span>
          <span v-else>Enter {{ sourceType }} link</span>
        </label>
      </div>
    </div>
    <div class="service__part">
      <button class="service__button button button__normal"
        v-bind:class="{'button_enabled': !validating, 'button_disabled': validating}" type="submit">
        <span v-if="!source">SELECT</span>
        <span v-else>RESET</span>
      </button>
    </div>
  </form>
</template>


<script> /* eslint-disable */
import axios from 'axios';
import config from '@/config.js';

export default {
  name: 'Service',
  data: () => {
    return {
      error: null,
      url: null,
      source: null,
      validating: false,
    };
  },
  props: {
    name: String,
    title: String,
    sourceType: String,
    placeHolder: String,
  },
  methods: {
    /**
     * Try connect to service with source url.
     */
    async connectToService() {
      // Drop source if connected
      if (this.source) {
        this.source = null;
        this.$emit('update', this.name, this.source);
        return;
      }

      this.error = null;

      // Print error if url not entered
      if (!this.url) {
        this.error = 'Link not entered';
        return;
      }

      // Validate entered url by regex
      let regSource = this.validateUrl(this.url);
      if (!regSource) {
        this.error = 'Invalid link';
      }

      // Validate entered url by api
      if (!this.error) {
        let host = `http://${config.host}:${config.apiPort}`;
        let source = regSource[1];

        let apiPath = `api/${this.name}/validation?${this.sourceType}=${source}`;
        let url = `${host}/${apiPath}`;

        // Validate process started
        this.validating = true;

        // Attempt get request to api
        try {
          await axios.get(url);
          this.source = source;
          this.$emit('update', this.name, this.source);
        } catch(e) {
          this.error = `Invalid ${this.sourceType}`;
        }

        // Validate process finished
        this.validating = false;
      }
    },
    /**
     * Regex validate of url.
     * @param {String} url - entered url. 
     */
    validateUrl(url) {
      switch (this.name) {
        case 'youtube':
          return url.match(/^.*youtube.com\/watch\?v=(.+)/);
        case 'twitch':
          return url.match(/^.*twitch.tv\/(.+)/);
        default:
          return null;
      }
    },
  },
};
</script>
