import './range';
import ui from './vplayer-ui';

let videoData = null;

const setNonPlayingState = () => {
  return videoData.videoList.forEach((item) => { item.state = 'not-playing'; });
}

const view = {
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
  },

  /**
   * togglePlayPause - Toggle between video Play and Pause
   */
  togglePlayPause() {
    if ( videoData.videoEl.paused || videoData.videoEl.ended ) {
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
      videoData.videoEl.muted = true;
      videoData.videoEl.play();
      // TODO: Unmute the video after playing
    } else {
      if ( videoData.videoEl.ended ) {
        videoData.videoEl.currentTime = 0;
      }
      videoData.videoEl.play();
    }
    this.playBtnUIHandler('pause');
  },

  /**
   * pauseVideo - Method to pause video
   * Change the Pause btn to Play btn
   */
  pauseVideo() {
    videoData.videoEl.pause();
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

const prevNextbtnControls = {
  prevBtn: null,
  nextBtn: null,
  previewWrapper: null,
  currentVideoIndex: null,

  init() {
    this.prevBtn = videoData.wrapper.querySelector('.vplayer-btn--prev');
    this.nextBtn = videoData.wrapper.querySelector('.vplayer-btn--next');
    this.previewWrapper = videoData.wrapper.querySelector('.vplayer-tooltip-wrapper');

    this.currentVideoIndex = videoData.videoList.findIndex((item) => { return item.state === 'playing'; });
  },

  getNextVideoData() {
    let nextVideoIndex = this.currentVideoIndex + 1;
    let nextVideo = videoData.videoList[nextVideoIndex];

    return nextVideo;
  },

  getPrevVideoData() {
    let prevVideoIndex = this.currentVideoIndex - 1;
    let prevVideo = videoData.videoList[prevVideoIndex];

    return prevVideo;
  },

  playPrevVideo() {
    setNonPlayingState();
    videoData.currentVideo = this.getPrevVideoData();
    videoData.currentVideo.state = 'playing';

    events.addVideoData();
  },

  playNextVideo() {
    setNonPlayingState();
    videoData.currentVideo = this.getNextVideoData();
    videoData.currentVideo.state = 'playing';

    events.addVideoData();
  },

  previewVideo(type) {
    if (type === 'next') {
      let nextVideo = this.getNextVideoData();

      let opt = {
        eventType: 'next',
        bgImage: nextVideo.poster,
        videoTitle: nextVideo.info.title,
        videoPageType: 'Next'
      };
      toolTipControls.setPreview(opt);
    } else if (type === 'prev') {
      let prevVideo = this.getPrevVideoData();

      let opt = {
        eventType: 'prev',
        bgImage: prevVideo.poster,
        videoTitle: prevVideo.info.title,
        videoPageType: 'Prev'
      };
      toolTipControls.setPreview(opt);
    } else if (type === 'timeline') {

    }
  },

  closePreview() {
    toolTipControls.reset();
  }
}

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
  scrubbingMouseDownEvent: null,

  init() {
    this.progressHolder = videoData.wrapper.querySelector(".vplayer-progress-bar");
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
    let playerPos = ((videoData.videoEl.currentTime / videoData.videoEl.duration) * (this.progressHolder.offsetWidth));
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

        // videoData.videoEl.play();
        this.setPlayProgress(e.pageX);
        this.startTrackPlayProgress();
      }
    }, true);
  },

  setPlayProgress(clickX) {
    var newVal = Math.max(0, Math.min(1, (clickX - this.findPosX(this.progressHolder)) / this.progressHolder.offsetWidth));
    videoData.videoEl.currentTime = newVal * videoData.videoEl.duration;
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
    let bf = videoData.videoEl.buffered;
    let time = videoData.videoEl.currentTime;
    let duration = videoData.videoEl.duration;

    while(!(bf.start(range) <= time && time <= bf.end(range))) {
      range += 1;
    }
    let loadStartPercentage = bf.start(range) / duration;
    let loadEndPercentage = bf.end(range) / duration;
    let loadPercentage = parseFloat((loadEndPercentage - loadStartPercentage).toFixed(2)) * 100;

    let loadProgress = this.loadProgressBar || videoData.wrapper.querySelector('.vplayer-load-progress');
    loadProgress.style.width = `${loadPercentage}%`;
  },

  destroy() {
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
    this.volumeBtn = videoData.wrapper.querySelector('.vplayer-btn--volume').parentNode;
    this.controlsElem = videoData.wrapper.querySelector('.vplayer-controls');
    this.volumePanel = videoData.wrapper.querySelector('.vplayer-volume-panel');

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
    videoData.videoEl.muted = this.isMuted;
    let vol = this.isMuted ? 0 : videoData.videoEl.volume * 100;
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

    if (slider !== null) {
      slider.parentNode.removeChild(slider);
    }

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
    console.log('setVolume');

    this.volume = volume/100;
    if (this.volume == 0) {
      this.isMuted = true;
    } else {
      this.isMuted = false;
    }
    videoData.videoEl.volume = this.volume;
    videoData.videoEl.muted = this.isMuted;
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
    this.timeDisplay = videoData.wrapper.querySelector('.vplayer-time-display');
    this.currentTimeEl = videoData.wrapper.querySelector('.vplayer-time-current');
    this.durationEl = videoData.wrapper.querySelector('.vplayer-time-duration');
    this.updateVideoDuration();
  },

  updateTime() {
    let currentMin = parseInt(videoData.videoEl.currentTime / 60, 10);
    let currentSec = parseInt(videoData.videoEl.currentTime % 60, 10);

    currentSec = currentSec < 10 ? ('0' + currentSec) : currentSec;
    this.currentTimeEl.innerHTML = currentMin + ':' + currentSec;
  },

  updateVideoDuration() {
    let durationMin = parseInt(videoData.videoEl.duration / 60, 10);
    let durationSec = parseInt(videoData.videoEl.duration % 60, 10);

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
    this.captionBtn = videoData.wrapper.querySelector('.vplayer-btn--subtitles');
    this.trackEl = videoData.wrapper.querySelector('.vplayer-track');
    this.allTrackEl = videoData.wrapper.querySelectorAll('.vplayer-track');
    this.captionBlock = videoData.wrapper.querySelector('.caption-block');
    this.captionWindow = videoData.wrapper.querySelector('.caption-window');
    this.isCaptionEnabled = videoData.config.enableCaptions;
    this.captionBtn.setAttribute('aria-pressed', this.isCaptionEnabled);

    if (this.trackEl) {
      this.toggleCaptionBtnState(false);

      videoData.videoEl.textTracks.forEach((textTrack) => {
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
    let currentTrack = videoData.videoEl.parentNode.querySelector('track.vplayer-track--default');

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
    let currentTrack = videoData.videoEl.parentNode.querySelector('track.vplayer-track--default');

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

    let currentTrack = videoData.videoEl.parentNode.querySelector('track.vplayer-track');

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

  init() {
    this.settingsBtn = videoData.wrapper.querySelector('.vplayer-btn--settings');
  },

  animateSettingsBtn() {
    let state = this.settingsBtn.getAttribute('aria-expanded');
    if (state && state === 'true') {
      this.settingsBtn.setAttribute('aria-expanded', false);
    } else {
      this.settingsBtn.setAttribute('aria-expanded', true);
    }
  },
}

const keyboardEvents = {
  init() {
    document.addEventListener('keydown', this.keyEvents = (e) => {
      this.onKeyPress(event, 32, playPausebtnControls, 'togglePlayPause');
      this.onKeyPress(event, 27, fullScreenControls, 'toggleFullScreen', false);
      this.onKeyPress(event, 77, volumeControls, 'toggleMuted', false);
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
    this.toolTipWrapper = videoData.wrapper.querySelector('.vplayer-tooltip-wrapper');
    this.toolTipBgImageEl = this.toolTipWrapper.querySelector('.vplayer-tooltip-bg-image');
    this.toolTipInfoEl = this.toolTipWrapper.querySelector('.vplayer-tooltip-info-wrapper');
    this.toolTipBgDuration = this.toolTipBgImageEl.querySelector('.vplayer-tooltip-bg-duration');
    this.toolTipInfoText = this.toolTipInfoEl.querySelector('.vplayer-tooltip-info-text');
    this.toolTipInfoTitle = this.toolTipInfoEl.querySelector('.vplayer-tooltip-info-title');
  },

  positionToolTip(eventType) {
    if (eventType === 'next' || eventType === 'prev') {
      let control = videoData.wrapper.querySelector('.vplayer-bottom-layer');
      let controlBoundaries = control.getBoundingClientRect();

      let toolTipBoundaries = {
        width: this.toolTipWrapper.offsetWidth,
        height: this.toolTipWrapper.offsetHeight
      };

      let wrapperBoundaries = videoData.wrapper.getBoundingClientRect();

      let left = controlBoundaries.left;
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

const events = {
  init(eventsObj) {
    videoData = eventsObj;
    this.addVideoData();
    this.initVideoBeforeLoadEvents();
  },

  addVideoData() {
    if (videoData.currentVideo) {
      ui.addVideoAttrs(videoData.currentVideo, videoData.videoEl);
      ui.setPrevNextBtnStates(videoData.videoList);
    }
  },

  initVideoBeforeLoadEvents() {
    let video = videoData.videoEl;
    if (video) {
      let events = ['loadeddata', 'loadedmetadata'];
      events.forEach(evt => video.addEventListener(evt, this, false));
    }
  },

  initControls() {
    playPausebtnControls.init();
    prevNextbtnControls.init();
    fullScreenControls.init();
    volumeControls.init();
    progressBarControls.init();
    timerInfo.init();
    settingsControls.init();
    keyboardEvents.init();
    toolTipControls.init();

    if (videoData.config.autoPlay) {
      playPausebtnControls.playVideo(true)
    } else {
      playPausebtnControls.playBtnUIHandler('play');
    }

    this.initVideoAfterLoadEvents();
  },

  initVideoAfterLoadEvents() {
    let videoElementEvents = ['play', 'pause', 'ended', 'timeupdate', 'progress'];
    videoElementEvents.forEach(evt => videoData.videoEl.addEventListener(evt, this, false));

    let wrapperEvents = ['click', 'mouseover', 'mouseout', 'dblclick'];
    wrapperEvents.forEach(evt => videoData.wrapper.addEventListener(evt, this, false));
  },

  handleEvent(evt) {
    let handler = `on${evt.type}Event`;
    if (typeof this[handler] === "function") {
      evt.preventDefault();
      return this[handler](evt);
    }
  },

  onloadeddataEvent(event) {
    let video = event.target;
    if (video.readyState >= 2) {
      console.log('onloadeddataEvent video ready');
      events.initControls();
    }
  },

  onloadedmetadataEvent() {
    console.log('onloadedmetadataEvent');
    customTracksControls.init();
  },

  onmouseoverEvent(event) {
    let target = event.target;

    if (target === prevNextbtnControls.nextBtn) {
      if (!target.classList.contains('vplayer-btn--disabled')) {
        prevNextbtnControls.previewVideo('next');
      }
    } else if (target === prevNextbtnControls.prevBtn) {
      if (!target.classList.contains('vplayer-btn--disabled')) {
        prevNextbtnControls.previewVideo('prev');
      }
    } else if (target.closest('.vplayer-volume-btn-wrapper') !== null) {
      volumeControls.volumeHoverEffects(true);
    }

    if (target === videoData.videoEl || target.closest('.vplayer-bottom-layer') !== null || target.closest('.vplayer-wrapper') !== null || target === videoData.wrapper) {
      view.toggleInfoLayers(videoData.wrapper, true);
    }
  },

  onmouseoutEvent(event) {
    let target = event.target;

    if (target === prevNextbtnControls.nextBtn) {
      prevNextbtnControls.closePreview();
    } else if (target === prevNextbtnControls.prevBtn) {
      prevNextbtnControls.closePreview();
    } else if (target.closest('.vplayer-volume-btn-wrapper') !== null) {
      volumeControls.volumeHoverEffects(false);
    }

    if (target === videoData.videoEl || target.closest('.vplayer-bottom-layer') !== null || target.closest('.vplayer-wrapper') !== null || target === videoData.wrapper) {
      if (!videoData.wrapper.classList.contains('video-paused')) {
        view.toggleInfoLayers(videoData.wrapper, false);
      }
    }
  },

  onclickEvent(event) {
    let target = event.target;
    console.log('on click event', target);
    debugger;
    if (target === prevNextbtnControls.nextBtn) {
      prevNextbtnControls.playNextVideo();
    } else if (target === prevNextbtnControls.prevBtn) {
      prevNextbtnControls.playPrevVideo();
    } else if (target === fullScreenControls.fullScreenBtn) {
      fullScreenControls.fullScreenClickHandler();
    } else if (target.closest('.vplayer-volume-btn-wrapper') !== null) {
      volumeControls.toggleMuted();
    } else if ((target === customTracksControls.captionBtn) && customTracksControls.trackEl) {
      customTracksControls.toggleCaptioning();
    } else if (target === settingsControls.settingsBtn) {
      settingsControls.animateSettingsBtn();
    } else if (target.closest('.vplayer-progress-bar-wrapper') === null) {
      // Target should not be in scrubber and controls
      if (target.closest('.vplayer-bottom-layer') !== null || target.closest('.vplayer-gradient-bottom') !== null || target.closest('.vplayer-top-layer') !== null || target.closest('.vplayer-gradient-top') !== null ||
      target.closest('.vplayer-container') !== null || target === playPausebtnControls.playBtn) {
          playPausebtnControls.togglePlayPause();
      }
    }
  },

  onplayEvent(event) {
    let target = event.target;

    console.log('on play event of videoEl', target);
    playPausebtnControls.playBtnUIHandler('pause');
    videoData.wrapper.classList.remove('video-paused');
    progressBarControls.startTrackPlayProgress();
  },

  onpauseEvent(event) {
    let target = event.target;
    
    playPausebtnControls.playBtnUIHandler('play');
    videoData.wrapper.classList.add('video-paused');
    view.toggleInfoLayers(videoData.wrapper, true);
    progressBarControls.stopTrackPlayProgress();
  },

  onendedEvent(event) {
    let target = event.target;

    console.log('on ended event of videoEl', target);

    playPausebtnControls.playBtnUIHandler('reload');
    view.toggleInfoLayers(videoData.wrapper, true);

    if (videoData.config.autoPlay) {
      // Play Next Video
      prevNextbtnControls.playNextVideo();
    }
  },

  ondblclickEvent(event) {
    let target = event.target;
    console.log('on double click event', target);

    if (target === fullScreenControls.videoBottomGradient || target === fullScreenControls.videoTopLayer || target === fullScreenControls.videoTopGradient) {
      fullScreenControls.fullScreenClickHandler();
    } else if (target === videoData.videoEl || target === videoData.videoWrapper) {
      fullScreenControls.fullScreenClickHandler();
    }
  },

  ontimeupdateEvent(event) {
    let target = event.target;
    timerInfo.updateTime();
  },

  onprogressEvent(event) {
    let target = event.target;
    progressBarControls.loadProgress();
  },

  destroy() {
    progressBarControls.destroy();
    keyboardEvents.destroy();
    customTracksControls.destroy();

    videoData.videoEl = null;
    videoData.wrapper = null;
  }
}

export default events;
