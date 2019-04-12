import './range';

const setNonPlayingState = (videoData) => {
  return videoData.videoList.forEach((item) => { item.state = 'not-playing'; });
}

const view = {
  mouseOverViewClasses: ['playlist-open'],
  mouseOutViewClasses: ['video-paused'],

  toggleInfoLayers(wrapper, show) {
    if (show) {
      wrapper.classList.add('show-info-controls');
    } else {
      wrapper.classList.remove('show-info-controls');
    }
  },

  canStateChange(wrapper, cls) {
    let state = true;
    cls.forEach((cl) => {
      state = !wrapper.classList.contains(cl);
    });
    return state;
  }
};

const playPausebtnControls = {
  playBtn: null,
  videoBottomGradient: null,
  videoTopLayer: null,
  videoTopGradient: null,

  init() {
    this.playBtn = this.videoData.wrapper.querySelector('.vplayer-btn--play');
    this.videoBottomGradient = this.videoData.wrapper.querySelector('.vplayer-gradient-bottom');
    this.videoTopLayer = this.videoData.wrapper.querySelector('.vplayer-top-layer');
    this.videoTopGradient = this.videoData.wrapper.querySelector('.vplayer-gradient-top');
  },

  /**
   * togglePlayPause - Toggle between video Play and Pause
   */
  togglePlayPause() {
    if ( this.videoData.videoEl.paused || this.videoData.videoEl.ended ) {
      this.playVideo();
    } else {
      this.pauseVideo();
    }
  },

  /**
   * playVideo - Method to play video
   * reset video currentTime to 0 if video is ended
   * Change the Play btn to Pause btn
   *
   * @param  {autoPlay} bool Force play the video by setting the video to mute
   */
  playVideo(autoplay) {
    if (autoplay) {
      // this.eventObj.volumeControls.toggleMuted();
      // this.videoData.videoEl.muted = true;
      this.videoData.videoEl.play();
      // TODO: Unmute the video after playing
    } else {
      if ( this.videoData.videoEl.ended ) {
        this.videoData.videoEl.currentTime = 0;
      }
      this.videoData.videoEl.play();
    }
    this.playBtnUIHandler('pause');
  },

  /**
   * pauseVideo - Method to pause video
   * Change the Pause btn to Play btn
   */
  pauseVideo() {
    this.videoData.videoEl.pause();
    this.playBtnUIHandler('play');
  },

  /**
   * playBtnUIHandler - Modify the SVG ui of play and pause btn along with the title
   *
   * @param  {type} action holds the string (play/pause/reload) to change the svg and title accordingly
   */
  playBtnUIHandler(action) {
    var svg = this.playBtn.querySelector('svg');
    let svgPath = svg.querySelector('path');
    let svgD = svgPath.getAttribute('d');
    let playD = 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z';
    let pauseD = 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z';
    let reloadD = 'M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z';
    if (action === 'play') {
      svgPath.setAttribute('d', playD);
      this.playBtn.setAttribute('title', 'Play');
    } else if (action === 'pause') {
      svgPath.setAttribute('d', pauseD);
      this.playBtn.setAttribute('title', 'Pause');
    } else {
      svgPath.setAttribute('d', reloadD);
      this.playBtn.setAttribute('title', 'Reload');
    }
  },

  onAutoPlay() {
    this.playVideo(true);
  }
};

const prevNextbtnControls = {
  prevBtn: null,
  nextBtn: null,
  previewWrapper: null,
  currentVideoIndex: null,

  init() {
    this.prevBtn = this.videoData.wrapper.querySelector('.vplayer-btn--prev');
    this.nextBtn = this.videoData.wrapper.querySelector('.vplayer-btn--next');
    this.previewWrapper = this.videoData.wrapper.querySelector('.vplayer-tooltip-wrapper');

    this.currentVideoIndex = this.videoData.videoList.findIndex((item) => { return item.state === 'playing'; });
  },

  getNextVideoData() {
    let nextVideoIndex = this.currentVideoIndex + 1;
    let nextVideo = this.videoData.videoList[nextVideoIndex];

    return nextVideo;
  },

  getPrevVideoData() {
    let prevVideoIndex = this.currentVideoIndex - 1;
    let prevVideo = this.videoData.videoList[prevVideoIndex];

    return prevVideo;
  },

  playPrevVideo() {
    setNonPlayingState(this.videoData);
    this.videoData.currentVideo = this.getPrevVideoData();
    this.videoData.currentVideo.state = 'playing';
    this.resetConfigOptions();

    this.eventObj.addVideoData();
  },

  playNextVideo() {
    setNonPlayingState(this.videoData);
    this.videoData.currentVideo = this.getNextVideoData();
    this.videoData.currentVideo.state = 'playing';
    this.resetConfigOptions();

    this.eventObj.addVideoData();
  },

  resetConfigOptions() {
    let videoToBePlayedLangObj = this.videoData.currentVideo.lang.find((item) => { return item.playingState; });
    let language = videoToBePlayedLangObj.language;

    this.videoData.config.lang = language;
    this.videoData.config.speed = 1.0;
  },

  previewVideo(type) {
    if (type === 'next') {
      let nextVideo = this.getNextVideoData();
      let videoObj = nextVideo.lang.find((item) => { return item.playingState; });

      let opt = {
        eventType: 'next',
        bgImage: videoObj.poster,
        videoTitle: videoObj.info.title,
        videoPageType: 'Next'
      };
      this.eventObj.toolTipControls.setPreview(opt);
    } else if (type === 'prev') {
      let prevVideo = this.getPrevVideoData();
      let videoObj = prevVideo.lang.find((item) => { return item.playingState; });

      let opt = {
        eventType: 'prev',
        bgImage: videoObj.poster,
        videoTitle: videoObj.info.title,
        videoPageType: 'Prev'
      };
      this.eventObj.toolTipControls.setPreview(opt);
    } else if (type === 'timeline') {
      // TODO: Add Timeline preview
    }
  },

  closePreview() {
    this.eventObj.toolTipControls.reset();
  }
}

const fullScreenControls = {
  fullScreenBtn: null,
  videoBottomGradient: null,
  videoTopLayer: null,
  videoTopGradient: null,

  init() {
    this.fullScreenBtn = this.videoData.wrapper.querySelector(".vplayer-btn--fullscreen"),
    this.videoBottomGradient = this.videoData.wrapper.querySelector('.vplayer-gradient-bottom');
    this.videoTopLayer = this.videoData.wrapper.querySelector('.vplayer-top-layer');
    this.videoTopGradient = this.videoData.wrapper.querySelector('.vplayer-gradient-top');
  },

  /**
   * fullScreenClickHandler - Click function to toggle Full screen mode
   *
   * @return {function} Return Calls the toggleFullScreen fn with the param as bool
   */
  fullScreenClickHandler() {
    return this.isVideoFullScreen() ? this.toggleFullScreen(false) : this.toggleFullScreen(true);
  },

  isVideoFullScreen() {
    return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
  },

  /**
   * toggleFullScreen - Toggles the fullscreen mode by adding/remove fs-mode class in videoWrapper
   * Initializes the keypress event on fullScreen
   *
   * @param  {bool} fullscreen - sets the isVideoFullScreen
   */
  toggleFullScreen(fullScreen) {
    if (fullScreen) {
      this.toggleFullScreenWrapperClass(true);
      if (this.videoData.wrapper.requestFullScreen) this.videoData.wrapper.requestFullScreen();
    	else if (this.videoData.wrapper.webkitRequestFullScreen) this.videoData.wrapper.webkitRequestFullScreen();
    	else if (this.videoData.wrapper.mozRequestFullScreen) this.videoData.wrapper.mozRequestFullScreen();
    } else {
      this.toggleFullScreenWrapperClass(false);
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  },

  toggleFullScreenWrapperClass(isFullScreen) {
    let videoModalElem = null;
    if (this.videoData.config.isModal) {
      videoModalElem = document.querySelector(`.${this.videoData.config.modalClass}`);
    }

    if (isFullScreen) {
      this.videoData.wrapper.classList.add('fs-mode');
      if (this.videoData.config.isModal) {
        videoModalElem.classList.add('vplayer-modal--fs-mode');
      }
    } else {
      this.videoData.wrapper.classList.remove('fs-mode');
      if (this.videoData.config.isModal) {
        videoModalElem.classList.remove('vplayer-modal--fs-mode');
      }
    }
    this.fullScreenBtnHandler(isFullScreen);
  },

  /**
   * fullScreenBtnHandler - Modify the full screen btn ui
   * @param  {bool} fullScreen - true/false sets the respective icon
   */
  fullScreenBtnHandler: function(fullScreen) {
    let svgIcon = '<svg height="100%" viewBox="0 0 36 36" width="100%"> <g class="corner-0"><use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path> </g> <g class="corner-1"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path> </g> <g class="corner-2"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path> </g> <g class="corner-3"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path> </g> </svg>';
    let svgIconFSMode = '<svg height="100%" viewBox="0 0 36 36" width="100%"> <g class="corner-2"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z"></path>\ </g> <g class="corner-3"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z"></path> </g> <g class="corner-0"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z"></path> </g> <g class="corner-1"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z"></path> </g> </svg>';

    let svg = this.fullScreenBtn.querySelector('svg');

    if (fullScreen) {
      svg.parentNode.removeChild(svg);
      this.fullScreenBtn.innerHTML = svgIconFSMode;
    } else {
      svg.parentNode.removeChild(svg);
      this.fullScreenBtn.innerHTML = svgIcon;
    }
    this.fullScreenBtn.blur();
  }
};

const progressBarControls = {
  playProgressInterval: 0,
  progressHolder: null,
  progressContainer: null,
  playProgressBar: null,
  scrubberContainer: null,
  scrubbingMouseDownEvent: null,

  init() {
    this.progressHolder = this.videoData.wrapper.querySelector(".vplayer-progress-bar");
    this.progressContainer = this.progressHolder.querySelector('.vplayer-progress-bar-container');
    this.playProgressBar = this.progressHolder.querySelector(".vplayer-play-progress");
    this.scrubberContainer = this.progressHolder.querySelector(".vplayer-scrubber-container");
    this.loadProgressBar = this.progressHolder.querySelector('.vplayer-load-progress');

    this.videoScrubbing();
  },

  startTrackPlayProgress() {
    var self = this;
    (function progressTrack() {
      self.updatePlayProgress();
      self.playProgressInterval = setTimeout(progressTrack, 50);
    })();
  },

  stopTrackPlayProgress() {
    clearTimeout(this.playProgressInterval);
  },

  updatePlayProgress() {
    let playerPos = ((this.videoData.videoEl.currentTime / this.videoData.videoEl.duration) * (this.progressHolder.offsetWidth));
    this.playProgressBar.style.width = playerPos + "px";
    this.scrubberContainer.style.transform = 'translateX(' + (playerPos) + 'px)';
  },

  videoScrubbing() {
    this.progressHolder.addEventListener("mousedown", this.scrubbingMouseDownEvent = () => {
      this.stopTrackPlayProgress();
      // playPausebtnControls.togglePlayPause();

      document.onmousemove = (e) => {
        this.setPlayProgress(e.pageX);
      }

      this.progressHolder.onmouseup = (e) => {
        document.onmouseup = null;
        document.onmousemove = null;

        // this.videoData.videoEl.play();
        this.setPlayProgress(e.pageX);
        this.startTrackPlayProgress();
      }
    }, true);
  },

  setPlayProgress(clickX) {
    var newVal = Math.max(0, Math.min(1, (clickX - this.findPosX(this.progressHolder)) / this.progressHolder.offsetWidth));
    this.videoData.videoEl.currentTime = newVal * this.videoData.videoEl.duration;
    this.playProgressBar.style.width = newVal * (this.progressHolder.offsetWidth)  + "px";
  },

  findPosX(progressHolder) {
    var curleft = progressHolder.offsetLeft;
    while (progressHolder = progressHolder.offsetParent) {
      curleft += progressHolder.offsetLeft;
    }
    return curleft;
  },

  loadProgress() {
    let range = 0;
    let bf = this.videoData.videoEl.buffered;
    let time = this.videoData.videoEl.currentTime;
    let duration = this.videoData.videoEl.duration;

    while(!(bf.start(range) <= time && time <= bf.end(range))) {
      range += 1;
    }
    let loadStartPercentage = bf.start(range) / duration;
    let loadEndPercentage = bf.end(range) / duration;
    let loadPercentage = parseFloat((loadEndPercentage - loadStartPercentage).toFixed(2)) * 100;

    let loadProgress = this.loadProgressBar || this.videoData.wrapper.querySelector('.vplayer-load-progress');
    loadProgress.style.width = `${loadPercentage}%`;
  },

  destroy() {
    // this.stopTrackPlayProgress();
    // this.loadProgress = () => {};
    this.progressHolder.removeEventListener("mousedown", this.scrubbingMouseDownEvent);
    this.scrubbingMouseDownEvent = null;
  }
};

const volumeControls = {
  volumeBtnParent: null,
  volumeBtn: null,
  controlsElem: null,
  volumePanel: null,
  isMuted: null,
  volume: 0,
  volumeSliderObj: null,

  init() {
    this.volumeBtn = this.videoData.wrapper.querySelector('.vplayer-btn--volume').parentNode;
    this.controlsElem = this.videoData.wrapper.querySelector('.vplayer-controls');
    this.volumePanel = this.videoData.wrapper.querySelector('.vplayer-volume-panel');
    this.initializeVolumeSlider();
  },

  /**
   * volumeHoverEffects - Hovering volume btn triggering the function. Volume slider active is toggled on hovering
   *
   * @param  {boolean} hover if true, slider will be shown, else slider will animate to none.
   */
  volumeHoverEffects(hover) {
    if (hover) {
      this.controlsElem.classList.add('vplayer-volume-slider-active');
      this.volumePanel.classList.add('vplayer-volume-control-hover');
    } else {
      this.controlsElem.classList.remove('vplayer-volume-slider-active');
      this.volumePanel.classList.remove('vplayer-volume-control-hover');
    }
  },

  /**
   * toggleMuted - toggle volume mute, and changes the ui of slider and volume btn
   */
  toggleMuted() {
    this.isMuted = !this.isMuted;
    this.videoData.videoEl.muted = this.isMuted;
    let vol = this.isMuted ? 0 : this.videoData.videoEl.volume * 100;
    let volSliderDrag = this.volumeBtn.querySelector('.vplayer-volume-slider-handle');
    if (this.isMuted) {
      this.volumeSliderObj = {
        'leftPos': volSliderDrag.style.left
      };
      volSliderDrag.style.left = 0 + 'px';
    } else {
      volSliderDrag.style.left = (this.volumeSliderObj!== null) ? this.volumeSliderObj.leftPos : 0 +'px';
    }
    this.volumeBtnHandler(vol);
  },

  /**
   * initializeVolumeSlider - Initializes the volume slider obj
   */
  initializeVolumeSlider() {
    var sliderPanel = this.controlsElem.querySelector('.vplayer-volume-panel'),
        sliderRangeInput = sliderPanel.querySelector('#volumeRangeSlider'),
        slider = sliderPanel.querySelector('.vplayer-volume-slider')

    if (slider === null) {
      rangejs(sliderRangeInput, {
        css: true,
        rangeClass: 'vplayer-volume-slider',
        rangeTag: 'div',
        draggerClass: 'vplayer-volume-slider-handle',
        draggerTag: 'div',
        isAriaEnabled: true,
        wrapper: sliderPanel,
        callbackFn: (volume) => { this.setVolume(volume); }
      });
    }
  },

  /**
   * setVolume - Callback fn from slider obj
   * @param  {float} volume - holds the volume to be set
   */
  setVolume(volume) {
    console.log('setVolume');

    this.volume = volume/100;
    if (this.volume == 0) {
      this.isMuted = true;
    } else {
      this.isMuted = false;
    }
    this.videoData.videoEl.volume = this.volume;
    this.videoData.videoEl.muted = this.isMuted;
    this.volumeBtnHandler(volume);
  },

  volumeBtnHandler(volume) {
    let svgMuted = '<svg height="100%" viewBox="0 0 36 36" width="100%"><path class=vplayer-svg-fill d="m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z"></path></svg>';
    let svgNormalVolume = '<svg height=100% viewBox="0 0 36 36"width=100%><use class=vplayer-svg-shadow xlink:href=""></use><use class=vplayer-svg-shadow xlink:href=""></use><defs><clipPath id=vplayer-svg-volume-animation-mask><path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"></path><path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"></path><path d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z"class=vplayer-svg-volume-animation-mover transform="translate(0, 0)"></path></clipPath><clipPath id=vplayer-svg-volume-animation-slash-mask><path d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z"class=vplayer-svg-volume-animation-mover transform="translate(0, 0)"></path></clipPath></defs><path d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z"class="vplayer-svg-fill vplayer-svg-volume-animation-speaker"clip-path=url(#vplayer-svg-volume-animation-mask) fill=#fff></path><path d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z"class="vplayer-svg-fill vplayer-svg-volume-animation-hider"clip-path=url(#vplayer-svg-volume-animation-slash-mask) fill=#fff style=display:none></path></svg>';
    let svgFullVolume = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-14"></use><use class="ytp-svg-shadow" xlink:href="#ytp-id-15"></use><defs><clipPath id="ytp-svg-volume-animation-mask"><path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"></path><path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"></path><path class="ytp-svg-volume-animation-mover" d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z" transform="translate(0, 0)"></path></clipPath><clipPath id="ytp-svg-volume-animation-slash-mask"><path class="ytp-svg-volume-animation-mover" d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z" transform="translate(0, 0)"></path></clipPath></defs><path class="ytp-svg-fill ytp-svg-volume-animation-speaker" clip-path="url(#ytp-svg-volume-animation-mask)" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z" fill="#fff" id="ytp-id-14"></path><path class="ytp-svg-fill ytp-svg-volume-animation-hider" clip-path="url(#ytp-svg-volume-animation-slash-mask)" d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z" fill="#fff" id="ytp-id-15" style="display: none;"></path></svg>';

    let svgVolumeBtn = this.videoData.wrapper.querySelector('.vplayer-btn--volume');
    let svg = svgVolumeBtn.querySelector('svg');

    svg.parentNode.removeChild(svg);

    if (volume == 0) {
      svgVolumeBtn.setAttribute('title', 'UnMute (M)');
      svgVolumeBtn.innerHTML = svgMuted;
    } else {
      svgVolumeBtn.setAttribute('title', 'Mute (M)');
      if (volume > 50) {
        svgVolumeBtn.innerHTML = svgFullVolume;
      } else {
        svgVolumeBtn.innerHTML = svgNormalVolume;
      }
    }
  }
};

const timerInfo = {
  timeDisplay: null,
  currentTimeEl: null,
  durationEl: null,

  init() {
    this.timeDisplay = this.videoData.wrapper.querySelector('.vplayer-time-display');
    this.currentTimeEl = this.videoData.wrapper.querySelector('.vplayer-time-current');
    this.durationEl = this.videoData.wrapper.querySelector('.vplayer-time-duration');
    this.updateVideoDuration();
  },

  updateTime() {
    let currentMin = parseInt(this.videoData.videoEl.currentTime / 60, 10);
    let currentSec = parseInt(this.videoData.videoEl.currentTime % 60, 10);

    currentSec = currentSec < 10 ? ('0' + currentSec) : currentSec;
    this.currentTimeEl.innerHTML = currentMin + ':' + currentSec;
  },

  updateVideoDuration() {
    let durationMin = parseInt(this.videoData.videoEl.duration / 60, 10);
    let durationSec = parseInt(this.videoData.videoEl.duration % 60, 10);

    durationSec = durationSec < 10 ? ('0' + durationSec) : durationSec;
    this.durationEl.innerHTML = durationMin + ':' + durationSec;
  }
};

const customTracksControls = {
  captionBtn: null,
  isCaptionEnabled: false,
  trackEl: null,
  allTrackEl: null,
  mode: null,
  captionBlock: null,
  captionWindow: null,
  cueChangeEvents: null,

  init() {
    this.captionBtn = this.videoData.wrapper.querySelector('.vplayer-btn--subtitles');
    this.trackEl = this.videoData.wrapper.querySelector('.vplayer-track');
    this.allTrackEl = this.videoData.wrapper.querySelectorAll('.vplayer-track');
    this.captionBlock = this.videoData.wrapper.querySelector('.caption-block');
    this.captionWindow = this.videoData.wrapper.querySelector('.caption-window');
    this.isCaptionEnabled = this.videoData.config.enableCaptions;
    this.captionBtn.setAttribute('aria-pressed', this.isCaptionEnabled);

    if (this.trackEl) {
      this.toggleCaptionBtnState(false);

      this.videoData.videoEl.textTracks.forEach((textTrack) => {
        textTrack.mode = 'hidden';
      });

      if (this.isCaptionEnabled) {
        this.createTracks();
      } else {
        this.removeTracks();
      }
    } else {
      this.destroy();
    }
  },

  toggleCaptionBtnState(disable) {
    if (disable) {
      this.captionBtn.classList.add('vplayer-btn--disabled')
    } else {
      this.captionBtn.classList.remove('vplayer-btn--disabled');
    }
  },

  toggleCaptioning() {
    this.isCaptionEnabled = !this.isCaptionEnabled;
    this.captionBtn.setAttribute('aria-pressed', this.isCaptionEnabled);

    if (!this.isCaptionEnabled) {
      this.removeTracks();
    } else {
      this.createTracks();
    }
  },

  createTracks() {
    let currentTrack = this.videoData.videoEl.parentNode.querySelector('track.vplayer-track--default');

    if (currentTrack !== null) {
      currentTrack.track.mode = 'hidden';

      if (currentTrack.track.oncuechange !== undefined) {
        currentTrack.track.addEventListener('cuechange', this.cueChangeEvents = (e) => {
          console.log('cuechange',e);
          e.preventDefault();
          this.showCustomTracks(true, this.trackEl);
        }, false);
      } else {
        // firefox older version support to be added using timeupdate event listener
      }
    }
  },

  removeTracks() {
    let currentTrack = this.videoData.videoEl.parentNode.querySelector('track.vplayer-track--default');

    if (currentTrack !== null) {
      this.showCustomTracks(false);

      currentTrack.track.mode = 'disabled';
    }
  },

  showCustomTracks(isShow, el) {
    if (isShow) {
      let _track = el.track;
      if (_track.activeCues.length > 0 && _track.activeCues[0].text) {
        this.captionBlock.innerHTML = '<span>' + _track.activeCues[0].text + '</span>';
      } else {
        this.captionBlock.innerText = '';
      }
    } else {
      this.captionBlock.innerHTML = '';
    }
  },

  destroy () {
    // disable the CC btn
    this.toggleCaptionBtnState(true);

    let currentTrack = this.videoData.videoEl.parentNode.querySelector('track.vplayer-track');

    if (currentTrack && currentTrack.track) {
      currentTrack.track.removeEventListener('cuechange', this.cueChangeEvents, false);
      currentTrack.parentNode.removeChild(currentTrack);
    }

    this.allTrackEl.forEach((item) => {
      item.parentNode.removeChild(item);
    });

    this.showCustomTracks(false);
  }
};

const settingsControls = {
  settingsBtn: null,
  settingsPopupEl: null,
  isShow: false,
  settingsObj: null,
  isLanguagePresent: false,
  panelHeaderClickEvent: null,
  menuClickEvent: null,

  init() {
    this.settingsBtn = this.videoData.wrapper.querySelector('.vplayer-btn--settings');
    this.settingsPopupEl = this.videoData.wrapper.querySelector('.vplayer-settings-menu');

    this.buildSettingsMainMenu();
  },

  isSettingsViewVisible() {
    let state = this.settingsBtn.getAttribute('aria-expanded');
    return state && state === 'true'
  },

  toggleSettingsView() {
    if (this.isSettingsViewVisible()) {
      this.settingsBtn.setAttribute('aria-expanded', false);
    } else {
      this.settingsBtn.setAttribute('aria-expanded', true);
    }
    // toggle menu visibility
    if (!this.isShow) {
      this.settingsPopupEl.removeAttribute('aria-hidden');
    } else {
      this.settingsPopupEl.setAttribute('aria-hidden', true);
    }

    // Add height restriction
    if (this.videoData.wrapper.offsetWidth < 600) {
      this.settingsPopupEl.classList.add('vplayer-settings-menu--restrict');
    } else {
      this.settingsPopupEl.classList.remove('vplayer-settings-menu--restrict');
    }

    this.isShow = !this.isShow;
  },

  buildSettingsObj(config, currentVideo) {
    // Deep copying the config settings
    let settings  = JSON.parse(JSON.stringify(config.settings));
    let langObjPresent = false;
    let modifiedSettings = settings.map((item) => {
      if (item.label === 'autoplay') {
        item.value = config.autoplay;
      }

      if (item.label === 'speed') {
        let options = item.options
        options.find((opt) => {
          if (String(opt.value) === String(config.speed)) {
            opt.selected = true;
          }
        });
      }
      return item;
    });
    if (currentVideo.hasOwnProperty('lang')) {
      this.isLanguagePresent = true;
      let languages = {
        label: 'lang',
        title: 'Language',
        role: 'dropdown',
        options: []
      };
      currentVideo.lang.forEach((item) => {
        let playingState = (item.language === String(config.lang)) || false;
        languages.options.push({
          'label': item.language.toUpperCase(),
          'value': item.language,
          'selected': playingState
        });
      });
      modifiedSettings = modifiedSettings.filter(i => i.label !== 'lang');
      modifiedSettings.push(languages);
    }
    //  else {
    //   modifiedSettings = modifiedSettings.filter(i => i.label !== 'lang');
    // }
    this.videoData.config.settings = modifiedSettings;
    this.settingsObj = modifiedSettings;
    return this.settingsObj;
  },

  buildSettingsMainMenu() {
    this.buildSettingsObj(this.videoData.config, this.videoData.currentVideo);
    this.settingsPopupEl.innerHTML = '';
    this.videoData.ui.buildSettingsMenu(this.settingsObj, this.settingsPopupEl);
  },

  checkboxToggle(target, attr) {
    if (target !== null) {
      let isChecked = (target.getAttribute('aria-checked') === 'true');
      target.setAttribute('aria-checked', !isChecked);
      let currentSettingsObj = this.settingsObj.find((item) => {
        return item.label === attr;
      });
      currentSettingsObj.value = !isChecked;

      this.videoData.config[attr] = !isChecked;
    }
  },

  showDropdownOpt(target, attr) {
    if (target !== null) {
      let currentSettingsObj = this.settingsObj.find((item) => {
        return item.label === attr;
      });
      this.settingsPopupEl.innerHTML = '';
      this.videoData.ui.buildSettingsMenuOptions(currentSettingsObj.options, this.settingsPopupEl, currentSettingsObj.title, attr);
    }
  },

  selectMenuOption(target, attr) {
    if (target !== null) {
      let isChecked = (target.getAttribute('aria-checked') === 'true');
      target.setAttribute('aria-checked', !isChecked);

      let otherChildrenElems = target.parentElement.children;
      for (var child = 0; child < otherChildrenElems.length; child++) {
        if (target !== otherChildrenElems[child]) {
          otherChildrenElems[child].setAttribute('aria-checked', false);
        }
      }

      let parentAttr = target.getAttribute('data-parent-attr');
      let currentSettingsObj = this.settingsObj.find((item) => {
        return item.label === parentAttr;
      });
      //Set current option as selected
      let valueAttr = target.getAttribute('data-value');
      currentSettingsObj.options.forEach((item) => {
        if (String(item.value) === valueAttr) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      });
      if (this.videoData.config.hasOwnProperty(parentAttr)) {
        this.videoData.config[parentAttr] = valueAttr;
      }
      this.backToSettingsMainMenu();
    }
  },

  backToSettingsMainMenu() {
    this.buildSettingsMainMenu();
  },

  handleSettingsMenuEvents(target) {
    let currentTarget = target.closest('.vplayer-menu-item') || target.closest('.vplayer-panel-header');
    let attr;
    if (currentTarget.getAttribute('data-attr') !== null) {
      attr = currentTarget.getAttribute('data-attr');
    } else {
      attr = '';
    }

    if (currentTarget.getAttribute('aria-disabled')) {
      return;
    }

    switch (attr) {
      case 'autoplay':
        this.checkboxToggle(currentTarget, attr);
        this.eventObj.playPausebtnControls.onAutoPlay();
        break;

      case 'speed':
        this.showDropdownOpt(currentTarget, attr);
        break;

      case 'speed-options':
        var val = currentTarget.getAttribute('data-value');
        this.selectMenuOption(currentTarget, attr);
        this.toggleSettingsView();
        this.eventObj.speedControls.trigger(parseFloat(val));
        break;

      case 'speed-options-header':
        this.backToSettingsMainMenu();
        break;

      case 'lang':
        this.showDropdownOpt(currentTarget, attr);
        break;

      case 'lang-options':
        var val = currentTarget.getAttribute('data-value');
        this.selectMenuOption(currentTarget, attr);
        this.toggleSettingsView();
        this.changeLanguage(val);
        break;

      case 'lang-options-header':
        this.backToSettingsMainMenu();
        break;

    }
  },

  changeLanguage(language) {
    let currentVideo = this.videoData.currentVideo;
    let videoLangObjToBePlayed = currentVideo.lang.find((item) => { return item.language === language; });
    let currentLangPlaying = currentVideo.lang.find((item) => { return item.playingState; });
    currentLangPlaying.playingState = false;
    videoLangObjToBePlayed.playingState = true;
    this.eventObj.addVideoData();
  }
}

const keyboardEvents = {
  init() {
    document.addEventListener('keydown', this.keyEvents = (e) => {
      this.onKeyPress(event, 32, this.eventObj.playPausebtnControls, 'togglePlayPause');
      this.onKeyPress(event, 27, this.eventObj.fullScreenControls, 'toggleFullScreen', false);
      this.onKeyPress(event, 77, this.eventObj.volumeControls, 'toggleMuted', false);
    }, false);
  },

  /**
   * onKeyPress - Utils for keydown events
   *
   * @param  {obj} e   event - handles the key pressed
   * @param  {int} keyCode holds the keycode pressed
   * @param  {function} callbackFn holds the function to be called
   * @param  {obj} ref holds the parent ref object
   */
  onKeyPress(e, keyCode, ref, callbackFn, callbackArgs) {
    e = e || window.event;
    if ( (e.keyCode || e.which) === keyCode ) {
      ref[callbackFn](callbackArgs);
    }
  },

  destroy() {
    document.removeEventListener('keydown', this.keyEvents);
    this.keyEvents = null;
  }
};

const toolTipControls = {
  toolTipWrapper: null,
  toolTipBgImageEl: null,
  toolTipInfoEl: null,
  toolTipBgDuration: null,
  toolTipInfoText: null,
  toolTipInfoTitle: null,

  init() {
    this.toolTipWrapper = this.videoData.wrapper.querySelector('.vplayer-tooltip-wrapper');

    this.toolTipBgImageEl = this.toolTipWrapper.querySelector('.vplayer-tooltip-bg-image');
    this.toolTipInfoEl = this.toolTipWrapper.querySelector('.vplayer-tooltip-info-wrapper');
    this.toolTipBgDuration = this.toolTipBgImageEl.querySelector('.vplayer-tooltip-bg-duration');
    this.toolTipInfoText = this.toolTipInfoEl.querySelector('.vplayer-tooltip-info-text');
    this.toolTipInfoTitle = this.toolTipInfoEl.querySelector('.vplayer-tooltip-info-title');
  },

  positionToolTip(eventType) {
    if (eventType === 'next' || eventType === 'prev') {
      let control = this.videoData.wrapper.querySelector('.vplayer-bottom-layer');
      let prevBtn = this.eventObj.prevNextbtnControls.prevBtn;
      let nextBtn = this.eventObj.prevNextbtnControls.nextBtn;
      let controlBoundaries = control.getBoundingClientRect();

      let toolTipBoundaries = {
        width: this.toolTipWrapper.offsetWidth,
        height: this.toolTipWrapper.offsetHeight
      };

      let wrapperBoundaries = this.videoData.wrapper.getBoundingClientRect();
      let left = 0;
      if (eventType === 'next') {
        left = nextBtn.offsetLeft;
      } else if (eventType === 'prev') {
        left = prevBtn.offsetLeft;
      }
      let top = wrapperBoundaries.height - controlBoundaries.height - toolTipBoundaries.height;

      let style = `left: ${left}px; top: ${top}px`;

      this.toolTipWrapper.setAttribute('style', style);
    }
  },

  setPreview(opt) {
    let previewW = 160,
      previewH = 90;

    if (opt.bgImage) {
      let styleObj = {
        'background-image': `url(${opt.bgImage})`,
        'background-position': '0px 0px',
        'background-size': '160px 90px'
      };
      let style = '';
      styleObj.forEach((attr, key) => {
        style += `${key}:${attr};`;
      });
      style += `width: ${previewW}px; height: ${previewH}px;`;
      this.toolTipBgImageEl.setAttribute('style', style);
      this.toolTipWrapper.classList.add('vplayer-tooltip-wrapper--preview');
    }

    if (opt.videoDuration) {
      this.toolTipBgDuration.innerText = opt.videoDuration;
      this.toolTipWrapper.classList.add('vplayer-tooltip-has-duration');
    }

    if (opt.videoTitle) {
      this.toolTipInfoText.innerText = opt.videoTitle;
      this.toolTipWrapper.classList.add('vplayer-tooltip-text');
    }

    if (opt.videoPageType) {
      this.toolTipInfoTitle.innerText = opt.videoPageType;
    }

    this.positionToolTip(opt.eventType);
    this.toolTipWrapper.setAttribute('aria-hidden', false);
  },

  reset() {
    this.toolTipWrapper.classList.remove('vplayer-tooltip-wrapper--preview');
    this.toolTipWrapper.classList.remove('vplayer-tooltip-text');
    this.toolTipWrapper.classList.remove('vplayer-tooltip-has-duration');
    this.toolTipBgImageEl.removeAttribute('style');
    this.toolTipBgDuration.innerText = '';
    this.toolTipInfoText.innerText = '';
    this.toolTipInfoTitle.innerText = '';

    this.toolTipWrapper.setAttribute('aria-hidden', true);
  }
};

const bookmarkControls = {
  bookmarkBtn: null,

  init() {
    this.bookmarkBtn = this.videoData.wrapper.querySelector('.vplayer-btn--bookmarks');
    if (this.videoData.config.bookmarkURL && this.videoData.config.bookmarkURL !== '') {
      this.toggleBookmarkBtnVisiblity(true);
    } else {
      this.toggleBookmarkBtnVisiblity(false);
    }
  },

  toggleBookmarkBtnVisiblity(enable) {
    if (enable) {
      this.bookmarkBtn.classList.remove('vplayer-btn--disabled');
      this.bookmarkBtn.classList.remove('vplayer-btn--hide');
    } else {
      this.bookmarkBtn.classList.add('vplayer-btn--disabled');
      this.bookmarkBtn.classList.add('vplayer-btn--hide');
    }
  },

  bookmarkRequest() {
    // Make XHR request
    // ajax.request({
    //   method: 'GET',
    //   url: 'https://swapi.co/api/people/',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).then((data) => {
    //   console.log('data request', data);
    // }, (err) => {
    //   console.log('error', err);
    // });
  }
};

const playListControls = {
  playListBtn: null,
  drawerEl: null,
  drawerHeader: null,
  drawerHeaderText: null,
  drawerClose: null,
  drawerCloseEvent: null,

  init() {
    this.playListBtn = this.videoData.wrapper.querySelector('.vplayer-btn--cards');
    this.drawerEl = this.videoData.wrapper.querySelector('.vplayer-drawer');
    this.drawerHeader = this.drawerEl.querySelector('.vplayer-drawer-header');
    this.drawerHeaderText = this.drawerHeader.querySelector('.vplayer-drawer-header-text');
    this.drawerClose = this.drawerHeader.querySelector('.vplayer-drawer-btn--close');
    this.drawerContent = this.drawerEl.querySelector('.vplayer-drawer-content');


    if (this.videoData.videoList.length > 1) {
      this.togglePlayListBtnVisibility(true);
    } else {
      this.togglePlayListBtnVisibility(false);
    }
    this.drawerHeaderText.innerText = 'Playlist';

    this.videoData.ui.buildPlayListCards(this.videoData.videoList, this.drawerContent);
  },

  togglePlayListBtnVisibility(enable) {
    if (enable) {
      this.playListBtn.classList.remove('vplayer-btn--disabled');
      this.playListBtn.classList.remove('vplayer-btn--hide');
    } else {
      this.playListBtn.classList.add('vplayer-btn--disabled');
      this.playListBtn.classList.add('vplayer-btn--hide');
    }
  },

  togglePlayListView(enable) {
    if (enable) {
      this.toggleWrapperClass(true);
      view.toggleInfoLayers(this.videoData.wrapper, false);
      this.togglePlayListBtnVisibility(false);
      this.drawerEl.removeAttribute('aria-hidden');
      this.drawerEl.classList.add('vplayer-drawer--open');
      this.initCardEvents();
    } else {
      this.destroyCardEvents();
      this.toggleWrapperClass(false);
      view.toggleInfoLayers(this.videoData.wrapper, true);
      this.drawerEl.classList.remove('vplayer-drawer--open');
      this.drawerEl.setAttribute('aria-hidden', true);
      this.togglePlayListBtnVisibility(true);
    }
  },

  toggleWrapperClass(add){
    if (add) {
      this.videoData.wrapper.classList.add('playlist-open');
    } else {
      this.videoData.wrapper.classList.remove('playlist-open');
    }
  },

  directPlayVideo(obj) {
    let { videoParentId, videoId } = obj;
    let videoToBePlayed = null;
    if (videoParentId) {
      let parentObj = this.videoData.videoList.find((item) => { return item.id === videoParentId; });
      if (parentObj.hasOwnProperty('lang')) {
        videoToBePlayed = parentObj.lang.find((item) => { return item.id === videoId; });
      } else {
        videoToBePlayed = parentObj;
      }
    } else {
      videoToBePlayed = this.videoData.videoList.find((item) => { return item.id === videoId; });
    }
    setNonPlayingState(this.videoData);
    this.videoData.currentVideo = videoToBePlayed;
    this.videoData.currentVideo.state = 'playing';
    this.togglePlayListView(false);
    this.eventObj.addVideoData();
  },

  initCardEvents() {
    let cardClickElems = this.drawerContent.querySelectorAll('.vplayer-card-click');
    cardClickElems.forEach((card) => {
      card.addEventListener('click', card.cardClickEvent = (e) => {
        let currentTarget = e.currentTarget;
        let videoId = currentTarget.getAttribute('data-video-id');
        let videoParentId = currentTarget.getAttribute('data-video-parent-id');
        console.log('card event videoId', videoId, 'parent id', videoParentId);
        this.directPlayVideo({ videoParentId, videoId });
      }, true);
    });
  },

  destroyCardEvents() {
    let cardClickElems = this.drawerContent.querySelectorAll('.vplayer-card-click');
    cardClickElems.forEach((card) => {
      card.removeEventListener("click", card.cardClickEvent, true);
      card.cardClickEvent = null;
    });
  }
};

const speedControls = {
  trigger(speed) {
    this.videoData.videoEl.playbackRate = speed;
  }
};

const ajax = {
  request (opts) {
    // Set up our HTTP request
    var xhr = window.ActiveX ? new ActiveXObject("Microsoft.XMLHTTP"): new XMLHttpRequest();

    var defaults =  {
      withCredentials: false,
      method: 'GET'
    };
    let options = Object.assign(defaults, opts);
    options.baseUrl = options.baseUrl || '';
    options.data = options.data || null;

    var defaultHeaders = {
      // 'Accept': 'text/plain',
      // 'Access-Control-Allow-Origin': 'http://localhost:8080/',
      // 'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    };

    options.headers = Object.assign(defaultHeaders, options.headers);

    function getUrlWithData (url, data, type) {
      if (type.toLowerCase() !== 'get' || !data) {
        return url;
      }
      var dataAsQueryString = objectToQueryString(data)
      var queryStringSeparator = url.indexOf('?') > -1 ? '&' : '?'
      return url + queryStringSeparator + dataAsQueryString;
    }

    function objectToQueryString (data) {
      return isObject(data) ? getQueryString(data) : data
    }

    function isObject (data) {
      return Object.prototype.toString.call(data) === '[object Object]'
    }

    function getQueryString (obj, prefix) {
      return Object.keys(obj).map(function (key) {
        if (obj.hasOwnProperty(key) && undefined !== obj[key]) {
          var val = obj[key]
          key = prefix ? prefix + '[' + key + ']' : key
          return val !== null && typeof val === 'object' ? getQueryString(val, key) : encode(key) + '=' + encode(val)
        }
      })
        .filter(Boolean)
        .join('&')
    }

    function encode (value) {
      return encodeURIComponent(value)
    }

    function setHeaders (xhr, headers, data) {
      headers = headers || {}
      if (!hasContentType(headers)) {
        headers['Content-Type'] = isObject(data) ? 'application/json' : 'application/x-www-form-urlencoded';
      }
      Object.keys(headers).forEach((name) => {
        (headers[name] && xhr.setRequestHeader(name, headers[name]))
      });
    }

    function hasContentType (headers) {
      return Object.keys(headers).some(function (name) {
        return name.toLowerCase() === 'content-type'
      });
    }

    if (options.url) {
      options.url = options.baseUrl + options.url;

      let urlToRequest = getUrlWithData(options.url, options.data, options.method)

      xhr.open(options.method, urlToRequest, true);
      if (options.hasOwnProperty('withCredentials')) {
        xhr.withCredentials = options.withCredentials;
      }
      setHeaders(xhr, options.headers, options.data);
      // xhr.setRequestHeader('Accept', options.type || 'text/plain');
      xhr.send(isObject(options.data) ? JSON.stringify(options.data) : options.data);

      return new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            // Process our return data
          	if (xhr.status >= 200 && xhr.status < 300) {
          		console.log('success!', xhr);
              resolve(JSON.parse(xhr.responseText));
          	} else {
          		console.log('The request failed!');
              reject(xhr.status);
          	}
          } else {
            console.log("xhr processing going on");
          }
        }
      });
    } else {
      console.log('url not defined in ajax request');
    }
  }
};

class VplayerEvents {
  constructor(options) {
    this.videoData = options;
  }

  init() {
    this.addVideoData();
    this.initVideoBeforeLoadEvents();
  }

  addVideoData() {
    if (this.videoData.currentVideo) {
      this.videoData.ui.addVideoAttrs(this.videoData.currentVideo, this.videoData.videoEl, this.videoData.config);
      this.videoData.ui.setPrevNextBtnStates(this.videoData.videoList);
    }
  }

  initVideoBeforeLoadEvents() {
    let video = this.videoData.videoEl;
    if (video) {
      let events = ['loadeddata', 'loadedmetadata'];
      events.forEach(evt => video.addEventListener(evt, this, false));
    }
  }

  initControlsWithRef() {
    let dataObj = {'videoData': this.videoData, 'eventObj': this};
    this.playPausebtnControls = Object.assign({}, playPausebtnControls, dataObj);
    this.prevNextbtnControls = Object.assign({}, prevNextbtnControls, dataObj);
    this.fullScreenControls = Object.assign({}, fullScreenControls, dataObj);
    this.volumeControls = Object.assign({}, volumeControls, dataObj);
    this.progressBarControls = Object.assign({}, progressBarControls, dataObj);
    this.timerInfo = Object.assign({}, timerInfo, dataObj);
    this.settingsControls = Object.assign({}, settingsControls, dataObj);
    this.keyboardEvents = Object.assign({}, keyboardEvents, dataObj);
    this.toolTipControls = Object.assign({}, toolTipControls, dataObj);
    this.bookmarkControls = Object.assign({}, bookmarkControls, dataObj);
    this.playListControls = Object.assign({}, playListControls, dataObj);
    this.speedControls = Object.assign({}, speedControls, dataObj);
  }

  initControls() {
    this.playPausebtnControls.init();
    this.prevNextbtnControls.init();
    this.fullScreenControls.init();
    this.volumeControls.init();
    this.progressBarControls.init();
    this.timerInfo.init();
    this.settingsControls.init();
    this.keyboardEvents.init();
    this.toolTipControls.init();
    this.bookmarkControls.init();
    this.playListControls.init();
    //this.speedControls.init();

    if (this.videoData.config.autoplay) {
      this.playPausebtnControls.onAutoPlay(true)
    } else {
      this.playPausebtnControls.playBtnUIHandler('play');
    }

    this.initVideoAfterLoadEvents();
  }

  initVideoAfterLoadEvents() {
    let videoElementEvents = ['play', 'pause', 'ended', 'timeupdate', 'progress'];
    videoElementEvents.forEach(evt => this.videoData.videoEl.addEventListener(evt, this, false));

    let wrapperEvents = ['click', 'mouseover', 'mouseout', 'dblclick'];
    wrapperEvents.forEach(evt => this.videoData.wrapper.addEventListener(evt, this, false));

    let documentEvents = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'];
    documentEvents.forEach(evt => document.addEventListener(evt, this, false));
  }

  handleEvent(evt) {
    let handler = `on${evt.type}Event`;
    if (typeof this[handler] === "function") {
      evt.preventDefault();
      return this[handler](evt);
    }
  }

  onloadeddataEvent(event) {
    let video = event.target;
    if (video.readyState >= 2) {
      console.log('onloadeddataEvent video ready');
      this.initControlsWithRef();
      this.initControls();
      this.volumeControls.setVolume(parseInt(this.videoData.config.volume));
    }
  }

  onloadedmetadataEvent() {
    console.log('onloadedmetadataEvent');
    let dataObj = {'videoData': this.videoData, 'eventObj': this};
    this.customTracksControls = Object.assign({}, customTracksControls, dataObj);
    this.customTracksControls.init();
  }

  onmouseoverEvent(event) {
    let target = event.target;

    if (target === this.prevNextbtnControls.nextBtn) {
      if (!target.classList.contains('vplayer-btn--disabled')) {
        this.prevNextbtnControls.previewVideo('next');
      }
    } else if (target === this.prevNextbtnControls.prevBtn) {
      if (!target.classList.contains('vplayer-btn--disabled')) {
        this.prevNextbtnControls.previewVideo('prev');
      }
    } else if (target.closest('.vplayer-volume-btn-wrapper') !== null) {
      this.volumeControls.volumeHoverEffects(true);
    }

    if (target === this.videoData.videoEl || target.closest('.vplayer-bottom-layer') !== null || target.closest('.vplayer-wrapper') !== null || target === this.videoData.wrapper) {
      if (view.canStateChange(this.videoData.wrapper, view.mouseOverViewClasses)) {
        view.toggleInfoLayers(this.videoData.wrapper, true);
      }
    }
  }

  onmouseoutEvent(event) {
    let target = event.target;

    if (target === this.prevNextbtnControls.nextBtn) {
      this.prevNextbtnControls.closePreview();
    } else if (target === this.prevNextbtnControls.prevBtn) {
      this.prevNextbtnControls.closePreview();
    } else if (target.closest('.vplayer-volume-btn-wrapper') !== null) {
      this.volumeControls.volumeHoverEffects(false);
    }

    if (target === this.videoData.videoEl || target.closest('.vplayer-bottom-layer') !== null || target.closest('.vplayer-wrapper') !== null || target === this.videoData.wrapper) {
      if (view.canStateChange(this.videoData.wrapper, view.mouseOutViewClasses)) {
        view.toggleInfoLayers(this.videoData.wrapper, false);
      }
    }
  }

  onclickEvent(event) {
    let target = event.target;
    console.log('on click event', target);

    if (this.settingsControls.isSettingsViewVisible() && target !== this.settingsControls.settingsBtn && target.closest('.vplayer-settings-menu') === null) {
      this.settingsControls.toggleSettingsView();
    }

    if (target === this.prevNextbtnControls.nextBtn) {
      this.prevNextbtnControls.playNextVideo();
    } else if (target === this.prevNextbtnControls.prevBtn) {
      this.prevNextbtnControls.playPrevVideo();
    } else if (target === this.fullScreenControls.fullScreenBtn) {
      this.fullScreenControls.fullScreenClickHandler();
    } else if (target.closest('.vplayer-volume-btn-wrapper') !== null) {
      this.volumeControls.toggleMuted();
    } else if ((target === this.customTracksControls.captionBtn) && this.customTracksControls.trackEl) {
      this.customTracksControls.toggleCaptioning();
    } else if (target === this.settingsControls.settingsBtn) {
      this.settingsControls.toggleSettingsView();
    } else if (target === this.bookmarkControls.bookmarkBtn) {
      this.bookmarkControls.bookmarkRequest();
    } else if (target === this.playListControls.playListBtn) {
      this.playListControls.togglePlayListView(true);
    } else if (target === this.playListControls.drawerClose) {
      this.playListControls.togglePlayListView(false);
    } else if (target.closest('.vplayer-settings-menu') !== null) {
      this.settingsControls.handleSettingsMenuEvents(target);
    } else if (target.closest('.vplayer-progress-bar-wrapper') === null) {
      // Target should not be in scrubber and controls
      if (target.closest('.vplayer-bottom-layer') !== null || target.closest('.vplayer-gradient-bottom') !== null || target.closest('.vplayer-top-layer') !== null || target.closest('.vplayer-gradient-top') !== null ||
      target.closest('.vplayer-container') !== null || target === this.playPausebtnControls.playBtn) {
          this.playPausebtnControls.togglePlayPause();
      }
    }
  }

  onplayEvent(event) {
    let target = event.target;

    console.log('on play event of videoEl', target);
    this.playPausebtnControls.playBtnUIHandler('pause');
    this.videoData.wrapper.classList.remove('video-paused');
    this.progressBarControls.startTrackPlayProgress();
  }

  onpauseEvent(event) {
    let target = event.target;

    this.playPausebtnControls.playBtnUIHandler('play');
    if (this.videoData.wrapper !== null) {
      this.videoData.wrapper.classList.add('video-paused');
    }
    view.toggleInfoLayers(this.videoData.wrapper, true);
    this.progressBarControls.stopTrackPlayProgress();
  }

  onendedEvent(event) {
    let target = event.target;

    console.log('on ended event of videoEl', target);

    this.playPausebtnControls.playBtnUIHandler('reload');
    view.toggleInfoLayers(this.videoData.wrapper, true);
    if (this.videoData.config.autoplay) {
      // Play Next Video
      this.prevNextbtnControls.playNextVideo();
    }
  }

  ondblclickEvent(event) {
    let target = event.target;
    console.log('on double click event', target);

    if (target === this.fullScreenControls.videoBottomGradient || target === this.fullScreenControls.videoTopLayer || target === this.fullScreenControls.videoTopGradient) {
      this.fullScreenControls.fullScreenClickHandler();
    } else if (target === this.videoData.videoEl || target === this.videoData.videoWrapper) {
      this.fullScreenControls.fullScreenClickHandler();
    }
  }

  ontimeupdateEvent(event) {
    let target = event.target;
    this.timerInfo.updateTime();
  }

  onprogressEvent(event) {
    let target = event.target;
    if (this.videoData.videoEl.readyState === 4) {
      this.progressBarControls.loadProgress();
    }
  }

  onfullscreenchangeEvent(event) {
    this.fullScreenControls.toggleFullScreenWrapperClass((document.fullScreen || document.fullscreenElement));
  }

  onwebkitfullscreenchangeEvent(event) {
    this.fullScreenControls.toggleFullScreenWrapperClass(document.webkitIsFullScreen);
  }

  onmozfullscreenchangeEvent(event) {
    this.fullScreenControls.toggleFullScreenWrapperClass(document.mozFullScreen);
  }

  onmsfullscreenchangeEvent(event) {
    this.fullScreenControls.toggleFullScreenWrapperClass(document.msFullscreenElement);
  }

  destroy() {
    //overrides
    this.playPausebtnControls.pauseVideo();

    this.progressBarControls.destroy();

    this.keyboardEvents.destroy();

    this.customTracksControls.destroy();

    this.videoData.videoEl.removeAttribute('src');
    this.videoData.videoEl.load();
    this.videoData.wrapper = null;
  }
}

export default VplayerEvents;
