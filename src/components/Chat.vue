<template>
  <!--eslint-disable-->
  <div class="chat__wrapper" :style="styleChat">
    <ul class="chat unstyled-list">
      <transition-group name="messages" tag="li">
        <li class="message" :style="styleMessage" v-for="message in messages"
          :key="`message_${message.id}`">
          <div class="message__header" :style="styleHeader" :key="`header_${message.id}`">
            <img class="message__icon" :style="styleIcon"
              :src="require(`../assets/images/${message.service}Logo.png`)"
              :key="`icon_${message.id}`"/><div class="message__author"
              :style="styleAuthor"
              :key="`author_${message.id}`">{{ message.author }}<span class="message__colon" :style="styleColon">:</span></div>
          </div><div class="message__text" :style="styleText"
            :key="`text_${message.id}`"><template v-for="(textPart, textPartIndex) in message.text">
              <span v-if="textPart.type == 'text'"
              :key="`textT_${message.id}_${textPartIndex}`">{{ textPart.value }}
              </span><img v-else-if="settings.emotesEnable && textPart.type == 'emote' &&
                (textPart.emoteType == 0 ||
                (textPart.emoteType != 0 && settings.emotesBetterTTV))"
              :style="styleEmote" :src="textPart.value"
              :key="`textE_${message.id}_${textPartIndex}`"/><span v-else
              :key="`textA_${message.id}_${textPartIndex}`">{{ textPart.alt }}</span>
            </template>
          </div>
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script> /* eslint-disable */
import axios from 'axios';
import zlib from 'zlib';
import * as _detailedSettingsPresets from '@/assets/js/detailedSettingsPresets.json';
import cssProperties from '@/assets/js/cssProperties.js';
import config from '@/config.js';

const EMOTE_TWITCH_TYPE = 0;
const EMOTE_BETTERTTV_TYPE = 1;
const EMOTE_FRANKERFACEZ_TYPE = 2;

export default {
  name: 'Chat',
  data() {
    return {
      maxMessages: 30,
      messages: [],
      newMessages: [],
      lastMessageTime: 0,
      urlParams: null,
      services: {
        youtube: {
          sourceType: 'video',
        },
        twitch: {
          sourceType: 'channel',
          token: null,
        },
      },
      allServices: ['youtube', 'twitch'],
      getMessagesInterval: null,
      updateMessagesInterval: null,
      settings: {},
      betterTTVEmotes: {},
    };
  },
  props: {
    settingsProp: Object,
    gettingNewMessages: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    /**
     * Get tokens for special transmitted services.
     * @returns {boolean} Was got tokens for all special transmitted services.
     */
    async connect() {
      let connected = 0;
      let tokenServiceCount = 0;

      for (let service in this.services) {
        if ('token' in this.services[service]) {
          tokenServiceCount++;

          try {
            let host = `http://${config.host}:${config.apiPort}`;
            let apiPath = `api/${service}/connect`;
            let url = `${host}/${apiPath}`;

            // Prepare query params for request to api
            let queryParams = {
              params: {
                channel: this.urlParams.get(service),
              }
            };

            // Get token from api
            let response = await axios.get(url, queryParams);
            this.services[service].token = response.data.token;
            connected++;
          }
          catch(e) {
            console.log(e);
          }
        }
      }

      return connected == tokenServiceCount;
    },

    /**
     * Get channel and global betterTTV emotes.
     */
    async getBetterTTVEmotes() {
      if (this.urlParams.has('twitch')) {
        let channel = this.urlParams.get('twitch');
        let channelResponse = await axios.get(`https://emotes.adamcy.pl/v1/channel/${channel}/id`);
        let channelId = channelResponse.data.id;
        let channelEmotesResponse = await axios.get(`https://api.betterttv.net/3/cached/users/twitch/${channelId}`);
        let globalEmotesResponse = await axios.get(`https://api.betterttv.net/3/cached/emotes/global`);
        let channelFrankerfacezEmotesResponse = await axios.get(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${channelId}`);
        let globalFrankerfacezEmotesResponse = await axios.get(`https://api.betterttv.net/3/cached/frankerfacez/emotes/global`);

        this.betterTTVEmotes = [...globalEmotesResponse.data.map(e => ({id: e.id, code: e.code, type: EMOTE_BETTERTTV_TYPE})),
          ...channelEmotesResponse.data.channelEmotes.map(e => ({id: e.id, code: e.code, type: EMOTE_BETTERTTV_TYPE})),
          ...channelEmotesResponse.data.sharedEmotes.map(e => ({id: e.id, code: e.code, type: EMOTE_BETTERTTV_TYPE})),
          ...channelFrankerfacezEmotesResponse.data.map(e => ({id: e.id, code: e.code, type: EMOTE_FRANKERFACEZ_TYPE})),
          ...globalFrankerfacezEmotesResponse.data.map(e => ({id: e.id, code: e.code, type: EMOTE_FRANKERFACEZ_TYPE}))];
      }
    },

    /**
     * Create array of random messages.
     * @returns {Array} Messages with random content.
     */
    generateRandomMessages() {
      // Return empty array if new messages not need
      if (!this.gettingNewMessages) {
        return [];
      }

      let newMessages = [];
      let messagesCount = Math.floor(Math.random() * 5);
      let curTime = Date.now();

      for (let i = 0; i < messagesCount; i++) {
        let service = this.allServices[Math.floor(Math.random() * this.allServices.length)];
        let author = `lorem${Math.floor(Math.random() * 1000)}`;
        let words = [];
        let wordsCount = Math.floor(Math.random() * 25) + 2;
        let emotes = [{ id: 25, positions: [], }];

        // Generate words and emotes
        for (let j = 0; j < wordsCount; j++) {
          if (Math.random() > 0.1 || service == 'youtube') {
            words.push({
              type: 'text',
              value: ' ' + 'loremipsumdo'.slice(0, Math.floor(Math.random() * 8)) + ' ',
            });
          } else if (Math.random() > 0.5) {
            words.push({
              type: 'emote',
              value: `https://static-cdn.jtvnw.net/emoticons/v2/25/default/light/3.0`,
              alt: 'Kappa',
              emoteType: EMOTE_TWITCH_TYPE,
            });
          } else {
            words.push({
              type: 'emote',
              value: `https://cdn.betterttv.net/emote/566c9f6365dbbdab32ec0532/3x`,
              alt: 'ConcernDoge',
              emoteType: EMOTE_BETTERTTV_TYPE,
            });
          }
        }

        // Push new message
        newMessages.push({
          service: service, 
          author: author,
          text: words,
          emotes: emotes,
          time: curTime, // time of message out
          id: Math.floor(Math.random() * 1000000),
        });

        // Add random time between messages
        curTime += Math.floor(Math.random() / messagesCount * 1000);
      }

      return newMessages;
    },

    /**
     * Get new messages for all services from api.
     */
    async getMessages() {
      let newMessages = [];
      let servicePromices = [];

      for (let service in this.services) {
        let host = `http://${config.host}:${config.apiPort}`;
        let source = this.urlParams.get(service);
        let apiPath = `api/${service}/chat`;
        let url = `${host}/${apiPath}`;

        // Create query parameters for request
        let queryParams = {
          params: {
            last_message_time: this.lastMessageTime,
          }
        }
        queryParams.params[`${this.services[service].sourceType}`] = source;

        if ('token' in this.services[service] && this.services[service].token) {
          queryParams.params['token'] = this.services[service].token;
        }
        servicePromices.push(axios.get(url, queryParams));
      }
      let responses = await this.allSettled(servicePromices);

      let i = 0;
      for (let service in this.services) {
        try {
          if (!this.urlParams.has(service)) {
            continue;
          }
          
          // There is not response
          let response = responses[i].value ? responses[i].value : null;
          if (!response) {
            i++;
            continue;

          }
          
          if ('token' in response.data) {
            // There is not new messages
            this.services[service].token = response.data.token;
          } else {
            // Map messages to array form including emotes
            newMessages = newMessages.concat(response.data.messages.map(m => {
              m.service = service;
              m.id = Math.floor(Math.random() * 1000000);
              let messageText = m.text;

              if (m.emotes) {
                m.text = [];
                m.emotes = [...m.emotes.map(e => ({...e, type: EMOTE_TWITCH_TYPE}))];

                if (this.settings.emotesBetterTTV) {
                  for (let emoteInfo of this.betterTTVEmotes) {
                    let match = null;
                    let emoteAdded = false;
                    let reg = new RegExp('(^|\\s)' + emoteInfo.code + '($|\\s)', 'g');

                    while ((match = reg.exec(messageText)) != null) {
                      reg.lastIndex--;
                      if (!emoteAdded) {
                        m.emotes.push({
                          id: emoteInfo.id,
                          type: emoteInfo.type,
                          positions: [],
                        });
                        emoteAdded = true;
                      }
                      m.emotes[m.emotes.length - 1].positions.push({
                        from: match.index == 0 ? 0 : match.index + 1, to: match.index + emoteInfo.code.length,
                      });
                    }
                  }
                }
                let emotes = m.emotes.reduce((arr, e) => [...arr, ...e.positions.map(p =>
                  ({from: parseInt(p.from), to: parseInt(p.to), id: e.id, type: e.type}))], []);
                emotes = emotes.sort((f, s) => f.from - s.from);
                emotes.unshift({ to: -1 });
                emotes.push({ from: messageText.length });

                for (let i = 0; i < emotes.length - 1; i++) {
                  if (emotes[i].id || emotes[i].betterTTVid) {
                    m.text.push({
                      type: 'emote',
                      value: ((type) => {
                        switch (type) {
                          case EMOTE_TWITCH_TYPE:
                            return `https://static-cdn.jtvnw.net/emoticons/v2/${emotes[i].id}/default/light/3.0`;
                          case EMOTE_BETTERTTV_TYPE:
                            return `https://cdn.betterttv.net/emote/${emotes[i].id}/3x`;
                          case EMOTE_FRANKERFACEZ_TYPE:
                            return `https://cdn.betterttv.net/frankerfacez_emote/${emotes[i].id}/4`;
                        }
                      })(emotes[i].type),
                      emoteType: emotes[i].type,
                      alt: messageText.slice(emotes[i].from, emotes[i].to + 1),
                    });
                  }

                  let intermediateText = messageText.slice(emotes[i].to + 1, emotes[i + 1].from);
                  m.text.push({
                    type: 'text',
                    value: intermediateText,
                  });
                }
              } else {
                m.text = [{type: 'text', value: messageText}];
              }
              return m;
            }));
          }
        } 
        catch(e) {
          console.log(e);
        } 
        finally {
          i++;
        }
      }

      // Generate random messages if services not transmitted
      if (Object.keys(this.services).length === 0) {
        newMessages = this.generateRandomMessages();
      }

      const lastMessageTime = newMessages.reduce((maxTime, message) => 
        (message.time > maxTime ? message.time : maxTime), 0);
        
      if (lastMessageTime > this.lastMessageTime) {
        newMessages = newMessages.filter(message => message.time >= this.lastMessageTime);
        this.lastMessageTime = lastMessageTime;
        newMessages.sort((m1, m2) => m1.time - m2.time);
        this.newMessages = this.newMessages.concat(newMessages);
      }
    },

    /**
     * Add new messages to common pull of messages.
     */
    async updateMessages() {
      if (this.newMessages.length != 0) {
        let lastMessageTime = this.newMessages[0].time;

        while (this.newMessages.length != 0) {
          const temp = this.newMessages[0];
          setTimeout(() => {
            this.messages.push(temp);
            if (this.messages.length > this.maxMessages) {
              this.messages.shift();
            }
          }, temp.time - lastMessageTime);
          lastMessageTime = this.newMessages[0].time;
          this.newMessages.shift();
        }
      }

      // Remove messages when their time is over
      if (this.settings.disappearanceEnable) {
        let time = Date.now();

        while (this.messages.length != 0 &&
          this.messages[0].time +
          this.settings.disappearanceLifetime <= time) {
          this.messages.shift();
        }
      }
    },

    /**
     * Wait specified time.
     * @param {number} ms - wait time
     */
    async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Resolve all promises.
     * @param {array} promises 
     */
    async allSettled(promises) {
      return Promise.all(promises.map(p => Promise.resolve(p).then(_value => ({
        status: 'fulfilled',
        value: _value,
      }), error => ({
        status: 'rejected',
        reason: error,
      }))));
    },
    async setSettingsFromString(compressedString) {
      try {
        const zlibPromised = body => new Promise(((resolve, reject) => {
          zlib.unzip(body, (err, res) => {
            if (err) {
              return reject(err)
            };
            return resolve(res);
          });
        }));
        compressedString = compressedString.replaceAll('_', '+');
        compressedString = compressedString.replaceAll('-', '/');
        compressedString = compressedString.replaceAll('.', '=');
        let compressedArray = Buffer.from(compressedString, 'base64');
        let decompressedArray = await zlibPromised(compressedArray);
        let settingsString = decompressedArray.toString('utf8');
        this.settings = _detailedSettingsPresets.none.settings;
        let settingsStrArray = settingsString.split(';');
        let i = 0;
        for (let setting in this.settings) {
          let settingValue = settingsStrArray[i];
          if (settingValue[0] != '#' && settingValue.indexOf(' ') == -1) {
            if (settingValue.indexOf('.') > -1) {
              settingValue = Number.parseFloat(settingValue);
            } else if (settingValue[0] == 't') {
              settingValue = true;
            } else if (settingValue[0] == 'f') {
              settingValue = false;
            } else {
              settingValue = Number.parseInt(settingValue);
            }
          }
          this.settings[setting] = settingValue;
          i++;
        }
      } catch(e) {
        console.log(e);
      }
    }
  },
  async mounted() {
    this.urlParams = new URLSearchParams(window.location.search);

    // Leave only transmitted services.
    for (let service in this.services) {
      if (!this.urlParams.has(service)) {
        delete this.services[service];
      }
    }

    // Try connect while not connected
    while (!await this.connect()) {
      await this.sleep(1000);
    }

    // Set css settings of chat 
    if (this.urlParams.has('settings')) {
      await this.setSettingsFromString(this.urlParams.get('settings'));
    } else if (this.settingsProp) {
      this.settings = this.settingsProp;
    }

    this.getBetterTTVEmotes();
    this.getMessagesInterval = setInterval(async () => this.getMessages(), 1000);
    this.updateMessagesInterval = setInterval(async () => this.updateMessages(), 30);
  },
  watch: {
    settingsProp: {
      handler(_settingsProp) {
        this.settings = _settingsProp;
      },
      deep: true,
    },
  },
  computed: {
    styleChat() {
      if (Object.keys(this.settings).length != 0) {
        return cssProperties.styleChat(this.settings, !!this.settingsProp);
      } else {
        return {};
      }
    },
    styleMessage() {
      if (Object.keys(this.settings).length != 0) {
        return cssProperties.styleMessage(this.settings);
      } else {
        return {};
      }
    },
    styleIcon() {
      if (Object.keys(this.settings).length != 0) {
        return cssProperties.styleIcon(this.settings);
      } else {
        return {};
      }
    },
    styleAuthor() {
      if (Object.keys(this.settings).length != 0) {
        return cssProperties.styleAuthor(this.settings);
      } else {
        return {};
      }
    },
    styleColon() {
      if (Object.keys(this.settings).length != 0) {
        return cssProperties.styleColon(this.settings);
      } else {
        return {};
      }
    },
    styleText() {
      if (Object.keys(this.settings).length != 0) {
        return cssProperties.styleText(this.settings);
      } else {
        return {};
      }
    },
    styleHeader() {
      if (Object.keys(this.settings).length != 0) {
        return cssProperties.styleHeader(this.settings);
      } else {
        return {};
      }
    },
    styleEmote() {
      if (Object.keys(this.settings).length != 0) {
        return cssProperties.styleEmote(this.settings);
      } else {
        return {};
      }
    },
  },
  /**
   * Clear request interval.
   */
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
};
</script>


<style>
  .messages-enter-active {
    transition: all var(--appearance-time) ease-out;
  }

  .messages-leave-active {
    transition: all var(--disappearance-time) ease-out;
  }

  .messages-enter {
    opacity: var(--appearance-opacity);
    transform: translateX(var(--appearance-translate-x)) translateY(var(--appearance-translate-y));
  }

  .messages-leave-to {
    opacity: var(--disappearance-opacity);
    transform: translateX(var(--disappearance-translate-x)) translateY(var(--disappearance-translate-y));
  }
</style>