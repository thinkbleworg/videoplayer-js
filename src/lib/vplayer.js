import configObject from './vplayer-config';
import VplayerUI from './vplayer-ui';
import VplayerEvents from './vplayer-events';

class Vplayer {
  constructor(el, options) {
    this.initialized = false;
    this.rootElem = el;
    this.config = Object.assign(configObject.Config, options);
    this.config.settings = configObject.Settings;

    this.videoList = this.config.src;
    // Set the videolist item to not-playing initially
    this.videoList.forEach((item) => { item.state = 'not-playing'; });
    this.currentVideo = this.config.src[0];
    this.currentVideo.state = 'playing';
  }

  init() {
    this.initialized = true;
    // Construct the UI if no custom ui
    if (!this.config.customUI) {
      // Construct the UI
      this.ui = new VplayerUI(this.rootElem, this.config);

      let wrapper = this.ui.init();
      let videoEl = wrapper.querySelector('.vplayer-stream');
      let config = this.config;
      let currentVideo = this.currentVideo;
      let videoList = this.videoList;
      let ui = this.ui;

      let eventParams = { ui, wrapper, videoEl, config, currentVideo, videoList };
      this.eventInstance = new VplayerEvents(eventParams);
      this.eventInstance.init();
    }
  }

  destroy() {
    this.eventInstance.destroy();
    this.videoList = null;
    this.currentVideo = null;

    // Reset Rootelem
    this.rootElem.style = '';
    this.rootElem.innerHTML = '';

    // Make initialized as false;
    this.initialized = false;
  }
}

export default Vplayer;
