import defaultConfig from './vplayer-config';
import ui from './vplayer-ui';
import events from './vplayer-events';

class Vplayer {
  constructor(el, options) {
    this.initialized = false;
    this.rootElem = el;
    this.config = Object.assign(defaultConfig, options);

    this.videoList = this.config.src;
    this.videoCount = this.videoList.length;
    this.currentVideo = this.config.src[0];
  }

  init() {
    this.initialized = true;
    // Construct the UI if no custom ui
    if (!this.config.customUI) {
      // Construct the UI
      this.wrapper = ui.init(this.rootElem, this.config);
      this.video = this.wrapper.querySelector('.vplayer-stream');

      events.init(this.wrapper, this.video, this.config);
    }
  }

  destroy() {
    this.videoList = null;
    this.currentVideo = null;
    this.videoCount = 0;

    // Reset Rootelem
    this.rootElem.style = '';
    this.rootElem.innerHTML = '';

    // Make initialized as false;
    this.initialized = false;
  }
}

export default Vplayer;
