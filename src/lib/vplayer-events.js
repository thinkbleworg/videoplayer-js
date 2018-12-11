import './range';

const videoData = {
  video: null,
  wrapper: null,
  config: null
};

const view = {
  toggleControlsViewEvents() {
    let bottomLayer = videoData.wrapper.querySelector('.vplayer-bottom-layer')
    videoData.video.addEventListener('mouseover', () => {
      this.toggleInfoLayers(videoData.wrapper, true);
    }, false);

    bottomLayer.addEventListener('mouseover', () => {
      this.toggleInfoLayers(videoData.wrapper, true);
    }, false);

    videoData.video.addEventListener('mouseout', () => {
      if (!videoData.wrapper.classList.contains('video-paused')) {
        this.toggleInfoLayers(videoData.wrapper, false);
      }
    }, false);

    bottomLayer.addEventListener('mouseout', () => {
      if (!videoData.wrapper.classList.contains('video-paused')) {
        this.toggleInfoLayers(videoData.wrapper, false);
      }
    }, false);
  },

  toggleInfoLayers(wrapper, show) {
    if (show) {
      wrapper.classList.add('show-info-controls');
    } else {
      wrapper.classList.remove('show-info-controls');
    }
  }
};

const playPausebtnControls = {
  playBtn: null,
  videoBottomGradient: null,
  videoTopLayer: null,
  videoTopGradient: null,

  init() {
    this.playBtn = videoData.wrapper.querySelector('.vplayer-btn--play');
    this.videoBottomGradient = videoData.wrapper.querySelector('.vplayer-gradient-bottom');
    this.videoTopLayer = videoData.wrapper.querySelector('.vplayer-top-layer');
    this.videoTopGradient = videoData.wrapper.querySelector('.vplayer-gradient-top');

    videoData.video.addEventListener('click', () => { this.togglePlayPause(); }, false);
    this.playBtn.addEventListener('click', () => { this.togglePlayPause(); }, false);

    // When the play button is pressed,
    // switch to the "Pause" symbol.
    // Toggle play to pause
    videoData.video.addEventListener('play', () => {
      this.playBtnUIHandler('pause');
      videoData.wrapper.classList.remove('video-paused');
      progressBarControls.startTrackPlayProgress();
    }, false);

    // Toggle pause to play
    videoData.video.addEventListener('pause', () => {
      this.playBtnUIHandler('play');
      videoData.wrapper.classList.add('video-paused');
      view.toggleInfoLayers(videoData.wrapper, true);
      progressBarControls.stopTrackPlayProgress();
    }, false);

    // When the video has concluded, reload button is enabled.
    // Reload button enable
    videoData.video.addEventListener('ended', () => {
      this.playBtnUIHandler('reload');
      view.toggleInfoLayers(videoData.wrapper, true);
    }, false);

    videoData.wrapper.addEventListener('click', (e) => {
      if (e.target === this.videoBottomGradient || e.target === this.videoTopLayer || e.target === this.videoTopGradient) {
        this.togglePlayPause();
      }
    }, false);
  },

  /**
   * togglePlayPause - Toggle between video Play and Pause
   */
  togglePlayPause() {
    if ( videoData.video.paused || videoData.video.ended ) {
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
  playVideo(autoPlay) {
    if (autoPlay) {
      videoData.video.muted = true;
      videoData.video.play();
      // TODO: Unmute the video after playing
    } else {
      if ( videoData.video.ended ) {
        videoData.video.currentTime = 0;
      }
      videoData.video.play();
    }
    this.playBtnUIHandler('pause');
  },

  /**
   * pauseVideo - Method to pause video
   * Change the Pause btn to Play btn
   */
  pauseVideo() {
    videoData.video.pause();
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
  }
};

const fullScreenControls = {
  isVideoFullScreen: false,
  fullScreenBtn: null,
  videoBottomGradient: null,
  videoTopLayer: null,
  videoTopGradient: null,

  init() {
    this.fullScreenBtn = videoData.wrapper.querySelector(".vplayer-btn--fullscreen"),
    this.videoBottomGradient = videoData.wrapper.querySelector('.vplayer-gradient-bottom');
    this.videoTopLayer = videoData.wrapper.querySelector('.vplayer-top-layer');
    this.videoTopGradient = videoData.wrapper.querySelector('.vplayer-gradient-top');

    videoData.video.addEventListener('dblclick', (e) => {
      this.fullScreenClickHandler();
    }, false);

    // When the full screen button is pressed...
    this.fullScreenBtn.addEventListener("click", (e) => {
      this.fullScreenClickHandler();
    }, true);

    videoData.wrapper.addEventListener('dblclick', (e) => {
      if (e.target === this.videoBottomGradient || e.target === this.videoTopLayer || e.target === this.videoTopGradient) {
        this.fullScreenClickHandler();
      }
    }, false);
  },

  /**
   * fullScreenClickHandler - Click function to toggle Full screen mode
   *
   * @return {function} Return Calls the toggleFullScreen fn with the param as bool
   */
  fullScreenClickHandler() {
    return this.isVideoFullScreen ? this.toggleFullScreen(false) : this.toggleFullScreen(true);
  },

  /**
   * toggleFullScreen - Toggles the fullscreen mode by adding/remove fs-mode class in videoWrapper
   * Initializes the keypress event on fullScreen
   *
   * @param  {bool} fullscreen - sets the isVideoFullScreen
   */
  toggleFullScreen(fullScreen) {
    this.isVideoFullScreen = fullScreen;
    if (fullScreen) {
      videoData.wrapper.classList.add('fs-mode');
    } else {
      videoData.wrapper.classList.remove('fs-mode');
    }
    this.fullScreenBtnHandler(fullScreen);
  },

  /**
   * fullScreenBtnHandler - Modify the full screen btn ui
   * TODO: Title Support to be added
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

  init() {
    this.progressHolder = videoData.wrapper.querySelector(".vplayer-progress-bar");
    this.progressContainer = videoData.wrapper.querySelector('.vplayer-progress-bar-container');
    this.playProgressBar = videoData.wrapper.querySelector(".vplayer-play-progress");
    this.scrubberContainer = videoData.wrapper.querySelector(".vplayer-scrubber-container");

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
    let playerPos = ((videoData.video.currentTime / videoData.video.duration) * (this.progressHolder.offsetWidth));
    this.playProgressBar.style.width = playerPos + "px";
    this.scrubberContainer.style.transform = 'translateX(' + (playerPos) + 'px)';
  },

  videoScrubbing() {
    this.progressHolder.addEventListener("mousedown", () => {
      this.stopTrackPlayProgress();
      playPausebtnControls.togglePlayPause();

      document.onmousemove = (e) => {
        this.setPlayProgress(e.pageX);
      }

      this.progressHolder.onmouseup = (e) => {
        document.onmouseup = null;
        document.onmousemove = null;

        videoData.video.play();
        this.setPlayProgress(e.pageX);
        this.startTrackPlayProgress();
      }
    }, true);
  },

  setPlayProgress: function(clickX) {
    var newVal = Math.max(0, Math.min(1, (clickX - this.findPosX(this.progressHolder)) / this.progressHolder.offsetWidth));
    videoData.video.currentTime = newVal * videoData.video.duration;
    this.playProgressBar.style.width = newVal * (this.progressHolder.offsetWidth)  + "px";
  },

  findPosX: function(progressHolder) {
    var curleft = progressHolder.offsetLeft;
    while (progressHolder = progressHolder.offsetParent) {
      curleft += progressHolder.offsetLeft;
    }
    return curleft;
  }
};

const volumeControls = {
  volumeBtn: null,
  controlsElem: null,
  volumePanel: null,
  isMuted: null,
  volume: 0,
  volumeSliderObj: null,

  init() {
    this.volumeBtn = videoData.wrapper.querySelector('.vplayer-btn--volume').parentNode;
    this.controlsElem = videoData.wrapper.querySelector('.vplayer-controls');
    this.volumePanel = videoData.wrapper.querySelector('.vplayer-volume-panel');

    this.volumeBtn.addEventListener('mouseover', () => {
      this.volumeHoverEffects(true);
    }, false);

    this.volumeBtn.addEventListener('mouseout', () => {
      this.volumeHoverEffects(false);
    }, false);

    this.volumeBtn.addEventListener('click', () => {
      this.toggleMuted();
    }, false);

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
    videoData.video.muted = this.isMuted;
    let vol = this.isMuted ? 0 : videoData.video.volume * 100;
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
        sliderRangeInput = sliderPanel.querySelector('#volumeRangeSlider');

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
  },

  /**
   * setVolume - Callback fn from slider obj
   * @param  {float} volume - holds the volume to be set
   */
  setVolume(volume) {
    this.volume = volume/100;
    if (this.volume == 0) {
      this.isMuted = true;
    } else {
      this.isMuted = false;
    }
    videoData.video.volume = this.volume;
    videoData.video.muted = this.isMuted;
    this.volumeBtnHandler(volume);
  },

  volumeBtnHandler(volume) {
    let svgMuted = '<svg height="100%" viewBox="0 0 36 36" width="100%"><path class=vplayer-svg-fill d="m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z"></path></svg>';
    let svgNormalVolume = '<svg height=100% viewBox="0 0 36 36"width=100%><use class=vplayer-svg-shadow xlink:href=""></use><use class=vplayer-svg-shadow xlink:href=""></use><defs><clipPath id=vplayer-svg-volume-animation-mask><path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"></path><path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"></path><path d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z"class=vplayer-svg-volume-animation-mover transform="translate(0, 0)"></path></clipPath><clipPath id=vplayer-svg-volume-animation-slash-mask><path d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z"class=vplayer-svg-volume-animation-mover transform="translate(0, 0)"></path></clipPath></defs><path d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z"class="vplayer-svg-fill vplayer-svg-volume-animation-speaker"clip-path=url(#vplayer-svg-volume-animation-mask) fill=#fff></path><path d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z"class="vplayer-svg-fill vplayer-svg-volume-animation-hider"clip-path=url(#vplayer-svg-volume-animation-slash-mask) fill=#fff style=display:none></path></svg>';
    let svgFullVolume = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-14"></use><use class="ytp-svg-shadow" xlink:href="#ytp-id-15"></use><defs><clipPath id="ytp-svg-volume-animation-mask"><path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"></path><path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"></path><path class="ytp-svg-volume-animation-mover" d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z" transform="translate(0, 0)"></path></clipPath><clipPath id="ytp-svg-volume-animation-slash-mask"><path class="ytp-svg-volume-animation-mover" d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z" transform="translate(0, 0)"></path></clipPath></defs><path class="ytp-svg-fill ytp-svg-volume-animation-speaker" clip-path="url(#ytp-svg-volume-animation-mask)" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z" fill="#fff" id="ytp-id-14"></path><path class="ytp-svg-fill ytp-svg-volume-animation-hider" clip-path="url(#ytp-svg-volume-animation-slash-mask)" d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z" fill="#fff" id="ytp-id-15" style="display: none;"></path></svg>';

    let svgVolumeBtn = videoData.wrapper.querySelector('.vplayer-btn--volume');
    let svg = svgVolumeBtn.querySelector('svg');

    svg.parentNode.removeChild(svg);

    if (volume == 0) {
      svgVolumeBtn.setAttribute('title', 'UnMute');
      svgVolumeBtn.innerHTML = svgMuted;
    } else {
      svgVolumeBtn.setAttribute('title', 'Mute');
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
    this.timeDisplay = videoData.wrapper.querySelector('.vplayer-time-display');
    this.currentTimeEl = videoData.wrapper.querySelector('.vplayer-time-current');
    this.durationEl = videoData.wrapper.querySelector('.vplayer-time-duration');

    videoData.video.addEventListener('timeupdate', () => {
      this.updateTime();
    }, false);

    this.updateVideoDuration();
  },

  updateTime() {
    let currentMin = parseInt(videoData.video.currentTime / 60, 10);
    let currentSec = parseInt(videoData.video.currentTime % 60, 10);

    currentSec = currentSec < 10 ? ('0' + currentSec) : currentSec;
    this.currentTimeEl.innerHTML = currentMin + ':' + currentSec;
  },

  updateVideoDuration: function() {
    let durationMin = parseInt(videoData.video.duration / 60, 10);
    let durationSec = parseInt(videoData.video.duration % 60, 10);

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

  init() {
    this.captionBtn = videoData.wrapper.querySelector('.vplayer-btn--subtitles');
    this.trackEl = videoData.wrapper.querySelector('.vplayer-track');
    this.allTrackEl = videoData.wrapper.querySelectorAll('.vplayer-track');
    this.captionBlock = videoData.wrapper.querySelector('.caption-block');
    this.captionWindow = videoData.wrapper.querySelector('.caption-window');
    this.isCaptionEnabled = videoData.config.enableCaptions;
    this.captionBtn.setAttribute('aria-pressed', this.isCaptionEnabled);

    if (this.trackEl) {
      videoData.video.textTracks.forEach((textTrack) => {
        textTrack.mode = 'hidden';
      });

      if (this.isCaptionEnabled) {
        this.createTracks(true);
      } else {
        this.removeTracks();
      }

      this.captionBtn.addEventListener('click', () => {
        this.toggleCaptioning();
      }, false);
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

  createTracks(createEvent) {
    let currentTrack = videoData.video.parentNode.querySelector('track.vplayer-track--default');
    currentTrack.track.mode = 'hidden';

    if (createEvent) {
      if (currentTrack.track.oncuechange !== undefined) {
        currentTrack.track.addEventListener('cuechange', (e) => {
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
    let currentTrack = videoData.video.parentNode.querySelector('track.vplayer-track--default');
    this.showCustomTracks(false);

    currentTrack.track.mode = 'disabled';


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
  }
};

const settingsControls = {
  settingsBtn: null,

  init() {
    this.settingsBtn = videoData.wrapper.querySelector('.vplayer-btn--settings');

    this.settingsBtn.addEventListener('click', (e) => {
      this.animateSettingsBtn();
    });
  },

  animateSettingsBtn() {
    let state = this.settingsBtn.getAttribute('aria-expanded');
    if (state && state === 'true') {
      this.settingsBtn.setAttribute('aria-expanded', false);
    } else {
      this.settingsBtn.setAttribute('aria-expanded', true);
    }
  }
}

const keyboardEvents = {
  init() {
    document.addEventListener('keydown', (e) => {
      this.onKeyPress(event, 32, playPausebtnControls, 'togglePlayPause');
      this.onKeyPress(event, 27, fullScreenControls, 'toggleFullScreen', false);
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
};

const events = {
  init(wrapper, video, config) {
    videoData.wrapper = wrapper;
    videoData.video = video;
    videoData.config = config;

    if (video) {
      video.addEventListener('loadeddata', () => {
        if (video.readyState >= 2) {
          console.log('video ready');
          this.initControls();
        }
      }, false);

      video.addEventListener('loadedmetadata', () => {
        customTracksControls.init();
      }, false);
    }
  },

  initControls() {
    view.toggleControlsViewEvents();
    playPausebtnControls.init();
    fullScreenControls.init();
    volumeControls.init();
    progressBarControls.init();
    timerInfo.init();
    settingsControls.init();
    keyboardEvents.init();

    if (videoData.config.autoPlay) {
      playPausebtnControls.playVideo(true)
    } else {
      playPausebtnControls.playBtnUIHandler('play');
    }
  },

  destroy() {
    videoData.video = null;
    videoData.wrapper = null;
  },
}

export default events;
