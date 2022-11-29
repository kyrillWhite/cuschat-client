<template>
  <!--eslint-disable-->
  <div>
    <ModalTemplate v-if="modalOpened" v-on:closeModal="closeModal()" :info="modalInfo" :type="modalType" />
    <div class="page" v-bind:style="scrollLock">
      <header class="header">
        <div class="header__sub">
          <div class="nav container">
            <h1 class="nav__logo">CUSCHAT</h1>
            <nav class="nav__menu">
              <input v-model="menuOpened" id="nav__burger_checkbox" type="checkbox" />
              <label class="nav__burger" for="nav__burger_checkbox">

                <div class="nav__burger_lines">
                  <span></span>
                </div>
              </label>
              <ul class="nav__menu-right unstyled-list">
                <li @click="openModal('link', { link: createLink() });" class="nav__link">
                  <router-link to="" class="nav__link_link">
                    <div class="nav__link_text">
                      GENERATE LINK
                    </div>
                  </router-link>
                </li>
                <li @click="openModal('preview', chatFormSettings);" class="nav__link">
                  <router-link to="" class="nav__link_link">
                    <div class="nav__link_text">
                      PREVIEW
                    </div>
                  </router-link>
                </li>
                <li @click="openModal('css', createCss());" class="nav__link">
                  <router-link to="" class="nav__link_link">
                    <div class="nav__link_text">
                      GET CSS
                    </div>
                  </router-link>
                </li>
                <li @click="closeMenu()" class="nav__link">
                  <router-link to="#services" class="nav__link_link">
                    <div class="nav__link_text">
                      SERVICES
                    </div>
                  </router-link>
                </li>
                <li @click="closeMenu()" class="nav__link">
                  <router-link to="#presets" class="nav__link_link">
                    <div class="nav__link_text">
                      PRESETS
                    </div>
                  </router-link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <div class="page__content">
        <main class="page__main container">
          <ul class="settings container__menu unstyled-list">
            <li id="services" class="settings__element">
              <details open>
                <summary class="settings__element-title unselectable">
                  <div class="settings__element-arrow"></div>
                  <div class="settings__element-title-text">Services</div>
                </summary>
                <div class="settings__element-body_column">
                  <div class="service unstyled-list">
                    <Service name="youtube" title="YouTube" sourceType="video"
                      placeHolder="youtube.com/watch?v=y0UrvIDe0Id" @update="onServiceUpdate" />
                    <Service name="twitch" title="Twitch" sourceType="channel"
                      placeHolder="twitch.tv/0channelName0" @update="onServiceUpdate" />
                  </div>
                </div>
              </details>
            </li>
            <li id="presets" class="settings__element">
              <details open>
                <summary class="settings__element-title unselectable">
                  <div class="settings__element-arrow"></div>
                  <div class="settings__element-title-text">Presets</div>
                </summary>
                <div class="settings__element-body_column">
                  <div class="presets unstyled-list">
                    <template v-for="(preset, pKey, pIndex) in detailedSettingsPresets">
                      <div class="presets__start-indent"></div>
                      <div class="presets__preset">
                        <input type="radio" :id="`radio_${pKey}`" name="preset" :value="pKey" v-model="currentPreset">
                        <label :for="`radio_${pKey}`">{{preset.label}}</label>
                      </div>
                      <div class="presets__preset_description">
                        <p>{{preset.caption}}</p>
                      </div>
                    </template>
                  </div>
                </div>
              </details>
            </li>
            <li class="settings__element">
              <details>
                <summary class="settings__element-title unselectable">
                  <div class="settings__element-arrow"></div>
                  <div class="settings__element-title-text">Detailed settings</div>
                </summary>
                <div class="detailed settings__element-body">
                  <ul class="unstyled-list detailed__settings">
                    <li v-for="(group, gKey, gIndex) in detailedSettings" :key="gKey">
                      <ul class="unstyled-list">
                        <li class="detailed__settings_group-name">{{ group.name }}</li>
                        <li v-for="(setting, sKey, sIndex) in group.settings" :key="sKey">
                          <ColorPicker v-if="setting.control == 'colorPicker'" :name="setting.name"
                            :id="gIndex * 100 + sIndex" :value="setting.value" :keyGroup="gKey" :keySetting="sKey"
                            @update="onDetailedSettingUpdate" />
                          <InputRange v-else-if="setting.control == 'inputRange'" :name="setting.name"
                            :id="gIndex * 100 + sIndex" :value="setting.value" :keyGroup="gKey" :keySetting="sKey"
                            @update="onDetailedSettingUpdate" />
                          <InputNumber v-else-if="setting.control == 'inputNumber'" :name="setting.name"
                            :id="gIndex * 100 + sIndex" :value="setting.value" :keyGroup="gKey" :keySetting="sKey"
                            :unitType="setting.unitType" @update="onDetailedSettingUpdate" />
                          <InputCheckbox v-else-if="setting.control == 'inputCheckbox'" :name="setting.name"
                            :id="gIndex * 100 + sIndex" :value="setting.value" :keyGroup="gKey" :keySetting="sKey"
                            @update="onDetailedSettingUpdate" />
                          <InputBorders v-else-if="setting.control == 'inputBorders'" :name="setting.name"
                            :id="gIndex * 100 + sIndex" :value="setting.value" :keyGroup="gKey" :keySetting="sKey"
                            @update="onDetailedSettingUpdate" />
                          <InputSelect v-else-if="setting.control == 'select'" :name="setting.name"
                            :id="gIndex * 100 + sIndex" :value="setting.value" :keyGroup="gKey" :keySetting="sKey"
                            :list="setting.list" @update="onDetailedSettingUpdate" />
                          <InputPaddings v-else-if="setting.control == 'inputPaddings'" :name="setting.name"
                            :id="gIndex * 100 + sIndex" :value="setting.value" :keyGroup="gKey" :keySetting="sKey"
                            @update="onDetailedSettingUpdate" />
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <div class="detailed__preview">
                    <div class="detailed__preview_header">
                      <span class="detailed__preview_title">PREVIEW</span>
                      <div>
                        <input class="input-checkbox" type="checkbox" id="inputCheckbox_preview"
                          v-model="chatPreviewWorking">
                        <label class="input-checkbox__label input-checkbox__label_light"
                          for="inputCheckbox_preview"></label>
                      </div>
                    </div>
                    <div class="detailed__preview_body">
                      <Chat :settingsProp="chatFormSettings" :gettingNewMessages="chatPreviewWorking"/>
                    </div>
                  </div>
                </div>
              </details>
            </li>
          </ul>
        </main>
      </div>
      <footer class="footer">
        2022 - kyrillWhite<br>
        kiribel2000@gmail.com
      </footer>
    </div>
  </div>
</template>

<script>/* eslint-disable */
import * as _detailedSettings from '@/assets/js/detailedSettings.json';
import * as _detailedSettingsPresets from '@/assets/js/detailedSettingsPresets.json';
import Service from './Service';
import ModalTemplate from './modal/ModalTemplate';
import ColorPicker from './detailed_settings/ColorPicker';
import InputRange from './detailed_settings/InputRange';
import InputNumber from './detailed_settings/InputNumber';
import InputCheckbox from './detailed_settings/InputCheckbox';
import InputBorders from './detailed_settings/InputBorders';
import InputSelect from './detailed_settings/InputSelect';
import InputPaddings from './detailed_settings/InputPaddings';
import Chat from './Chat.vue';
import zlib from 'zlib';
import cssProperties from '@/assets/js/cssProperties.js';
import config from '@/config.js';

export default {
  name: 'Base',
  data: () => {
    return {
      modalOpened: false,
      menuOpened: false,
      services: {},
      detailedSettings: _detailedSettings,
      detailedSettingsPresets: _detailedSettingsPresets,
      chatPreviewWorking: true,
      modalInfo: {},
      modalType: '',
      currentPreset: 'none',
    };
  },
  components: {
    Service,
    ModalTemplate,
    ColorPicker,
    InputRange,
    InputNumber,
    InputCheckbox,
    InputBorders,
    InputSelect,
    InputPaddings,
    Chat
  },
  computed: {
    scrollLock() {
      return (this.modalOpened || this.menuOpened) ? { height: '100%', overflow: 'hidden' } : {};
    },
    chatFormSettings() {
      return this.detailedToChatSettings(this.detailedSettings);
    },
  },
  watch: {
    menuOpened(val) {
      document.documentElement.style.overflow = val ? 'hidden' : 'auto';
    },
    modalOpened(val) {
      document.documentElement.style.overflow = val ? 'hidden' : 'auto';
    },
    currentPreset(val) {
      this.applyPreset(val);
    },
  },
  methods: {
    /**
     * Open modal window with definite type.
     * @param {String} type - type of modal window
     * @param {Object} info - data of modal window
     */
    openModal(type, info) {
      this.menuOpened = false;
      this.modalOpened = true;

      this.modalInfo = info;
      this.modalType = type;
    },

    /**
     * Close modal window.
     */
    closeModal() {
      this.modalOpened = false;
    },

    /**
     * Close mobile menu.
     */
    closeMenu() {
      this.menuOpened = false;
    },

    /**
     * Update service's sources.
     * @param {String} name - name of service
     * @param {String} source - source of service
     */
    onServiceUpdate(name, source) {
      if (source) {
        this.services[name] = source;
      }
      else {
        delete this.services[name];
      }
    },

    /**
     * Update detailed setting.
     * @param {*} group - detailed setting's group
     * @param {*} setting - setting of group
     * @param {*} value - value of setting
     */
    onDetailedSettingUpdate(group, setting, value) {
      this.detailedSettings[group].settings[setting].value = value;
    },

    /**
     * Convert detailed settings to string.
     * @returns {String} settings string
     */
    async settingsToString() {
      const zlibPromised = body => new Promise(((resolve, reject) => {
        zlib.gzip(body, (err, res) => {
          if (err) {
            return reject(err)
          };
          return resolve(res.toString('base64'));
        });
      }));

      let stringSettings = Object.entries(this.detailedSettings).reduce((str, [_, group]) =>
        str + (str == '' ? '' : ';') + Object.entries(group.settings).reduce((gStr, [_, setting]) =>
          gStr + (gStr == '' ? '' : ';') + setting.value, ''), '');

      let encodedString = await zlibPromised(stringSettings);
      encodedString = encodedString.replaceAll('+', '_');
      encodedString = encodedString.replaceAll('/', '-');
      encodedString = encodedString.replaceAll('=', '.');
      return encodedString;
    },

    /**
     * Generate chat link.
     * @returns {String} link
     */
    async createLink() {
      
      let url = `${config.host}:${config.vuePort}/chat?`;
      let atributes = [];

      for (let service in this.services) {
        atributes.push(`${service}=${this.services[service]}`);
      }

      atributes.push(`settings=${encodeURI(await this.settingsToString())}`);
      let strAtributes = atributes.join('&');
      return url + strAtributes;
    },
    
    /**
     * Generate text css styles for chat.
     * @returns {String} css styles
     */
    createCss() {
      let settingsProp = structuredClone(this.detailedSettings);
      let settings = {};

      for (let group in settingsProp) {
        let _group = (({name, settings}) => settings)(settingsProp[group]);
        let convertedGroup = {};

        for (let setting in _group) {
          convertedGroup[group + setting.charAt(0).toUpperCase() + setting.slice(1)] =
            (({value, ...o}) => value)(_group[setting]);
        }

        settings = {...settings, ...convertedGroup};
      }

      let chatWrapper = {
        'overflow': 'hidden',
        'height': '100%',
        'width': '100%',
        'border-style': 'solid',
        ...cssProperties.styleChat(settings, false),
      };
      
      let chat = {
        'position': 'absolute',
        'bottom': '0',
        'left': '0',
        'width': '100%',
        'display': 'flex',
        'flex-direction': 'column',
      };

      let message = {
        'position': 'relative',
        'flex': '1',
        'border-style': 'solid',
        ...cssProperties.styleMessage(settings),
      };

      let messageHeader = {
        'flex': '1',
        ...cssProperties.styleHeader(settings),
      };

      let messageIcon =  {
        'object-fit': 'contain',
        'vertical-align': 'middle',
        ...cssProperties.styleIcon(settings),
      };

      let messageAuthor = {
        'flex': '1',
        ...cssProperties.styleAuthor(settings),
      };

      let messageColon = {
        ...cssProperties.styleColon(settings),
      };

      let messageText = {
        'flex': '2',
        ...cssProperties.styleText(settings),
      };

      let css = {
        'chat__wrapper': chatWrapper,
        'chat': chat,
        'message': message,
        'message__header': messageHeader,
        'message__icon': messageIcon,
        'message__author': messageAuthor,
        'message__colon': messageColon,
        'message__text': messageText,
      };

      return {css: Object.entries(css).map(([styleName, properties]) =>
        `.${styleName} {\n${Object.entries(properties).map(([propertyName, value]) =>
          `  ${propertyName}: ${value};`).join('\n')}\n}`).join('\n\n')};
    },

    /**
     * Simplify detailed settings to one object
     * @param {Object} _settings detailed settings
     * @return {Object} simplified settings
     */
    detailedToChatSettings(_settings) {
      let settingsProp = structuredClone(_settings);
      let settings = {};

      for (let group in settingsProp) {
        let _group = (({name, settings}) => settings)(settingsProp[group]);
        let convertedGroup = {};

        for (let setting in _group) {
          convertedGroup[group + setting.charAt(0).toUpperCase() + setting.slice(1)] =
            (({value, ...o}) => value)(_group[setting]);
        }

        settings = {...settings, ...convertedGroup};
      }

      return settings;
    },

    /**
     * Apply preset settings.
     * @param {String} presetName 
     */
    applyPreset(presetName) {
      let presetSettings = this.detailedSettingsPresets[presetName].settings;

      for (let group in this.detailedSettings) {
        for (let groupSetting in this.detailedSettings[group].settings) {
          let presetValue = presetSettings[`${group}${groupSetting.charAt(0).toUpperCase()}${groupSetting.slice(1)}`];
          this.detailedSettings[group].settings[groupSetting].value = presetValue;
        }
      }
    },
  }
};
</script>
