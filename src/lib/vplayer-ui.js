
/**
 * _createElements - create DOM Elements and wrapper it in elToAppend
 *
 * @param  {obj} opt        include classnames, tags, attrs, content for dom element
 * @param  {DOMobj} elToAppend wrapper to wrap the created element
 * @return {DOMobj} returns the newly created element
 */
function _createElements(opt, elToAppend) {
  let el = document.createElement(opt.tagName || 'div');
  let classNameList = opt.classNames;
  let attributesList = opt.attrs;
  let innerContent = opt.content;

  if (classNameList) {
    classNameList.forEach((val) => {
      el.classList.add(val);
    });
  }

  if (attributesList) {
    attributesList.forEach((attr, key) => {
      el.setAttribute(key, attr);
    });
  }

  if (innerContent) {
    el.innerHTML = innerContent;
  }

  if (elToAppend) {
    elToAppend.appendChild(el);
  }
  return el;
}

function _removeDOMElement(className, wrapperEl, removeAllMatching) {
  if (removeAllMatching) {
    let elems = wrapperEl.querySelectorAll(`.${className}`);
    elems.forEach((el) => {
      el.parentNode.removeChild(el);
    })
  } else {
    let elem = wrapperEl.querySelector(`.${className}`);
    elem.parentNode.removeChild(elem);
  }
}


/**
 * _buildVideoElOptions - build the video layer
 *
 * @param  {obj} config user config
 * @return {obj} returns videoElementOptions, tracks in video, source list of video, and title of current video
 */
function _buildVideoElOptions(config) {
  let tracks = null;
  let videoList = null;
  let titleObj = null;

  let videoElOpt = {
    tagName: 'video',
    classNames: ['vplayer-stream'],
    attrs: {
      controlslist: config.controlslist,
      tabindex: "-1",
      preload: config.preload,
      crossorigin: config.crossorigin || 'anonymous',
    }
  };

  if (config.autoPlay) {
    videoElOpt.attrs.autoPlay = '';
  }

  return { videoElOpt, tracks, videoList, titleObj };
}

/**
 * _buildTrackElOptions - build video track options
 *
 * @param  {obj} track track object from list of tracks
 * @return {obj}  returns the trackElementOptions
 */
function _buildTrackElOptions(track) {
  let trackElOpt = {
    tagName: 'track',
    classNames: ['vplayer-track'],
    attrs: {
      src: track.src,
      lang: track.lang,
      label: track.label,
      kind: track.kind,
      mode: track.mode
    }
  };

  if (track.default) {
    trackElOpt.classNames.push('vplayer-track--default');
    trackElOpt.attrs.default = '';
  }

  return trackElOpt;
}

/**
 * _buildCustomTracks - builds the custom track inside the video Layer
 *
 * @param  {DOMObj} wrapperEl wrapper element in which track layers needs to be appended
 * @return {DOMObj}  return the custom track element
 */
function _buildCustomTracks(wrapperEl) {
  let captionWindowElOpt = {
    classNames: ['caption-window', 'caption-window--bottom'],
    attrs: {
      dir: 'ltr',
      tabindex: 0
    }
  };
  let captionWindowEl = _createElements(captionWindowElOpt, wrapperEl);
  let captionWindowHTML = '<span class="caption-text"><span class="caption-block"><span></span></span></span>';
  captionWindowEl.innerHTML = captionWindowHTML;

  return captionWindowEl;
}

/**
 * _buildTopLayer - build the top info layer of the video
 *
 * @param  {DOMObj} wrapperEl wrapper element inside which top layer needs to be appended
 * @param  {obj} titleObj  holds the title options
 * @return {DOMObj} returns topLayer element
 */
function _buildTopLayer(wrapperEl, titleObj) {
  let topLayer = _createElements({classNames: ['vplayer-top-layer']}, wrapperEl);
  let titleLayer = _createElements({classNames: ['vplayer-title']}, topLayer);
  let text = _createElements({classNames: ['vplayer-title-text']}, titleLayer);

  return topLayer;
}

/**
 * _buildTitleLayer - build Title Layer Opts
 *
 * @param  {obj} titleObj  title object passed from top layer function
 * @return {obj} returns the title element options
 */
function _buildTitleLayer(titleObj) {
  let titleLinkElOpt = {
    tagName: 'a',
    classNames: ['vplayer-title-link'],
    attrs: {}
  }
  if (titleObj) {
    titleObj.forEach((attribute, key) => {
      if (key !== 'content') {
        titleLinkElOpt.attrs[key] = attribute;
      } else {
        titleLinkElOpt.content = attribute;
      }
    });
  }

  return titleLinkElOpt;
}

/**
 * _buildBottomLayer - build bottom layer with controls
 *
 * @param  {DOMObj} wrapperEl wrapperElement inside which bottom layer needs to be appended
 * @return {DOMObj} returns the bottom layer
 */
function _buildBottomLayer(wrapperEl) {
  let bottomLayer = _createElements({classNames: ['vplayer-bottom-layer']}, wrapperEl);

  let bottomPadder = _createElements({classNames: ['vplayer-bottom-padder']}, bottomLayer);

  let timerHTML = '<div class="vplayer-time-display"><span class="vplayer-time-current">0:00</span><span class="vplayer-time-separator"> / </span> <span class="vplayer-time-duration">0:00</span> </div>';

  bottomPadder.innerHTML += timerHTML;

  let progressBarEl = _createElements({classNames: ['vplayer-progress-bar-wrapper']}, bottomPadder);

  let progressBarHTML = '<div class="vplayer-progress-bar-container"><div class="vplayer-progress-bar" tabindex="0"><div class="vplayer-progress-bar-padding"></div><div class="vplayer-progress-list"> <div class="vplayer-play-progress vplayer-swatch-bg" ></div><div class="vplayer-load-progress"></div><div class="vplayer-hover-progress vplayer-hover-progress-light" ></div></div><div class="vplayer-scrubber-container"> <div class="vplayer-scrubber-button vplayer-swatch-bg" style=""><div class="vplayer-scrubber-pull-indicator"></div></div></div></div></div>';

  progressBarEl.innerHTML = progressBarHTML;

  let controlsEl = _createElements({classNames: ['vplayer-controls']}, bottomPadder);

  let leftControlsEl = _createElements({classNames: ['vplayer-controls-left']}, controlsEl);
  let rightControlsEl = _createElements({classNames: ['vplayer-controls-right']}, controlsEl);

  let prevBtnHTML = '<a class="vplayer-btn vplayer-btn--prev" title="Previous"> <svg height="100%" viewBox="0 0 36 36" width="100%"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="m 12,12 h 2 v 12 h -2 z m 3.5,6 8.5,6 V 12 z"></path> </svg> </a>';

  let playBtnHTML = '<button type="button" class="vplayer-btn vplayer-btn--play" title="Play"> <svg class="vplayer-svg-play" height="100%" viewBox="0 0 36 36" width="100%"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"> </path> </svg></button>';

  let nextBtnHTML = '<a class="vplayer-btn vplayer-btn--next" title="Next"> <svg height="100%" viewBox="0 0 36 36" width="100%"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z"></path> </svg> </a>';

  let volumeBtnHTML = '<span class="vplayer-volume-btn-wrapper"> <button class="vplayer-btn vplayer-btn--volume" title="Mute (M)"> <svg height="100%" viewBox="0 0 36 36" width="100%"> <use class="vplayer-svg-shadow" xlink:href=""></use> <use class="vplayer-svg-shadow" xlink:href=""></use> <defs> <clipPath id="vplayer-svg-volume-animation-mask"> <path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"></path> <path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"></path> <path class="vplayer-svg-volume-animation-mover" d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z" transform="translate(0, 0)"></path> </clipPath> <clipPath id="vplayer-svg-volume-animation-slash-mask"> <path class="vplayer-svg-volume-animation-mover" d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z" transform="translate(0, 0)"></path> </clipPath> </defs> <path class="vplayer-svg-fill vplayer-svg-volume-animation-speaker" clip-path="url(#vplayer-svg-volume-animation-mask)" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z" fill="#fff" id=""></path> <path class="vplayer-svg-fill vplayer-svg-volume-animation-hider" clip-path="url(#vplayer-svg-volume-animation-slash-mask)" d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z" fill="#fff" id="" style="display: none;"></path> </svg> </button> <div class="vplayer-volume-panel" aria-valuemin="0" aria-valuemax="100" tabindex="0" aria-valuenow="100" aria-valuetext="100% volume"> <input type="hidden" id="volumeRangeSlider" min="0" max="100" step="1"/> </div></span>';

  leftControlsEl.innerHTML = prevBtnHTML + playBtnHTML + nextBtnHTML + volumeBtnHTML;

  let captionBtnHTML = '<button class="vplayer-btn--subtitles vplayer-btn" aria-pressed="false" title="Subtitles/closed captions"> <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path d="M11,11 C9.89,11 9,11.9 9,13 L9,23 C9,24.1 9.89,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 Z M17,17 L15.5,17 L15.5,16.5 L13.5,16.5 L13.5,19.5 L15.5,19.5 L15.5,19 L17,19 L17,20 C17,20.55 16.55,21 16,21 L13,21 C12.45,21 12,20.55 12,20 L12,16 C12,15.45 12.45,15 13,15 L16,15 C16.55,15 17,15.45 17,16 L17,17 L17,17 Z M24,17 L22.5,17 L22.5,16.5 L20.5,16.5 L20.5,19.5 L22.5,19.5 L22.5,19 L24,19 L24,20 C24,20.55 23.55,21 23,21 L20,21 C19.45,21 19,20.55 19,20 L19,16 C19,15.45 19.45,15 20,15 L23,15 C23.55,15 24,15.45 24,16 L24,17 L24,17 Z" fill="#fff" id=""> </path> </svg> </button>';

  let settingsBtnHTML = '<button class="vplayer-btn vplayer-btn--settings" aria-haspopup="true" aria-expanded="false"> <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z" fill="#fff"></path> </svg> </button>';

  let fullScreenBtnHTML = '<button class="vplayer-btn vplayer-btn--fullscreen" title="Full screen"> <svg height="100%" viewBox="0 0 36 36" width="100%"> <g class="corner-0"><use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path> </g> <g class="corner-1"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path> </g> <g class="corner-2"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path> </g> <g class="corner-3"> <use class="vplayer-svg-shadow" xlink:href=""></use> <path class="vplayer-svg-fill" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path> </g> </svg></button>';


  rightControlsEl.innerHTML = captionBtnHTML + settingsBtnHTML + fullScreenBtnHTML;

  return bottomLayer;
}


function _buildTooltipLayer(wrapperEl) {
  let tooltipWrapperElOpt = {
    classNames: ['vplayer-tooltip-wrapper'],
    attrs: {
      'aria-hidden': true
    }
  };

  let tooltipWrapperEl = _createElements(tooltipWrapperElOpt, wrapperEl);

  let bgImageTooltipEl = '<div class="vplayer-tooltip-bg-image"> <div class="vplayer-tooltip-bg-duration"></div></div>';

  let infoTooltipEl = ' <div class="vplayer-tooltip-info-wrapper"> <div class="vplayer-tooltip-info-image"></div><div class="vplayer-tooltip-info-title"></div><span class="vplayer-tooltip-info-text"></span> </div>';

  tooltipWrapperEl.innerHTML = bgImageTooltipEl + infoTooltipEl;

  return tooltipWrapperEl;
}

const ui = {
  config: null,

  init(rootEl, config) {
    this.config = config;
    this.wrapper = null;
    return this.createUI(rootEl, config);
  },

  createUI(rootEl, config) {
    let docFrag = document.createDocumentFragment();
    let wrapperElOpt = {
      tagName: 'div',
      classNames: ['vplayer-wrapper'],
      attrs: {}
    };

    if (config.width) {
      wrapperElOpt.attrs.style = `width:${config.width}px;`;
    }

    if (config.height) {
      wrapperElOpt.attrs.style += ` height:${config.height}px;`;
    }

    let wrapper = _createElements(wrapperElOpt);
    let container = _createElements({classNames: ['vplayer-container']}, wrapper);

    let { videoElOpt, tracks, videoList, titleObj } = _buildVideoElOptions(config);
    let videoEl = _createElements(videoElOpt, container);
    videoEl.removeAttribute('controls');

    let customTrackUI = _buildCustomTracks(wrapper);

    let tooltipLayer = _buildTooltipLayer(wrapper);

    let topGradient = _createElements({classNames: ['vplayer-gradient-top']}, wrapper);

    // let topLayer = _buildTopLayer(wrapper, this.titleObj);
    let topLayer = _buildTopLayer(wrapper);

    let bottomGradient = _createElements({classNames: ['vplayer-gradient-bottom']}, wrapper);

    let bottomLayer = _buildBottomLayer(wrapper);

    docFrag.appendChild(wrapper);
    rootEl.appendChild(docFrag);

    this.wrapper = wrapper;

    return wrapper;
  },

  removeDOMElements(className, wrapperEl, removeAllMatching) {
    return _removeDOMElement(className, wrapperEl, removeAllMatching);
  },

  addVideoAttrs(video, el) {
    let attrs = {
      src: video.url,
      'data-video-id': video.id,
      type: video.type
    };

    if (video.poster && video.poster !== null) {
      attrs.poster = video.poster;
    } else {
      attrs.poster = null;
    }

    attrs.forEach((attr, key) => {
      el.setAttribute(key, attr);
    });

    let tracks = null;
    // If any track is present add captions
    if (Array.isArray(video.tracks) && video.tracks.length) {
      tracks = video.tracks;

      if (el.querySelectorAll('.vplayer-track').length > 0) {
        _removeDOMElement('vplayer-track', el, true);
      }

      tracks.forEach((track) => {
        let trackElOpt = _buildTrackElOptions(track);
        let trackEl = _createElements(trackElOpt, el);
      });
    } else {
      if (el.querySelectorAll('.vplayer-track').length > 0) {
        _removeDOMElement('vplayer-track', el, true);
      }
    }

    let titleObj = null;
    //Store the title of current video in object
    if (video.info) {
      titleObj = {
        title: video.info.title,
        content: video.info.title,
        link: video.info.titleExternalLink || '',
        target: video.info.titleLinkTarget || '_blank'
      }
      let textTopLayer = this.wrapper.querySelector('.vplayer-title-text');
      textTopLayer.innerHTML = '';
      let titleLinkElOpt = _buildTitleLayer(titleObj);
      let titleLink = _createElements(titleLinkElOpt, textTopLayer);
    }
  },

  setPrevNextBtnStates(playlist) {
    let prevBtn = this.wrapper.querySelector('.vplayer-btn--prev');
    let nextBtn = this.wrapper.querySelector('.vplayer-btn--next');

    let classLists = ['vplayer-btn--disabled', 'vplayer-btn--hide'];

    classLists.forEach((className) => {
      prevBtn.classList.remove(className);
      nextBtn.classList.remove(className);
    });

    if (playlist.length > 1) {
      let currentVideoIndex = playlist.findIndex((item) => { return item.state === 'playing'; });

      if (currentVideoIndex === 0) {
        // disable the prev btn
        classLists.forEach((className) => {
          prevBtn.classList.add(className);
        });
      } else if (currentVideoIndex === playlist.length - 1) {
        // disable the next btn
        classLists.forEach((className) => {
          nextBtn.classList.add(className);
        });
      }
    } else {
      // Disable next and prev btns as there is only one video
      classLists.forEach((className) => {
        prevBtn.classList.add(className);
        nextBtn.classList.add(className);
      });
    }
  }
};

export default ui;
