
// Private methods

/**
 * defaultModalOptions - returns the object of default options configuration for modal
 *
 * @return {obj}  config object
 */
function defaultModalOptions () {
  return {
    onClose: null,
    onOpen: null,
    beforeOpen: null,
    beforeClose: null,
    cssClass: [],
    closeIconPosition: 'inside', // inside / outside
    closeMethods: ['overlay', 'button', 'escape']
  };
}

/**
 * _buildUI - creates the Modal UI
 */
function _buildUI() {
  this.modal = document.createElement('div');
  this.modal.classList.add('vplayer-modal');

  this.opts.cssClass.forEach((cssCl) => {
    this.modal.classList.add(cssCl);
  });

  this.modal.style.display = 'none';

  if (this.opts.closeMethods.includes('overlay')) {
    this.modal.classList.add('vplayer-modal--no-overlay-close');
  }

  // close btn
  if (this.opts.closeMethods.includes('button')) {
    this.modalCloseBtn = document.createElement('button');
    this.modalCloseBtn.type = 'button'
    this.modalCloseBtn.classList.add('vplayer-modal-close');

    let svgCloseIcon = '<svg class="vplayer-modal-close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>';
    this.modalCloseBtn.innerHTML = svgCloseIcon;
  }

  this.modalContentBox = document.createElement('div');
  this.modalContentBox.classList.add('vplayer-modal-content-box');

  this.modalContent = document.createElement('div');
  this.modalContent.classList.add('vplayer-modal-content');

  this.modalContentBox.appendChild(this.modalContent);

  this.modal.appendChild(this.modalContentBox);

  if (this.opts.closeMethods.includes('button')) {
    if (this.opts.closeIconPosition === 'inside') {
      this.modalCloseBtn.classList.add('vplayer-modal-close--inside');
      this.modalContentBox.appendChild(this.modalCloseBtn);
    } else {
      this.modal.appendChild(this.modalCloseBtn);
    }
  }
}

/**
 * _bindEvents - bind the modal related events
 */
function _bindEvents() {
  this.events = {
    clickCloseBtn: this.close.bind(this),
    clickOverlay: _handleClickOverlay.bind(this),
    keyboardNav: _handleKeyboardNav.bind(this)
  };

  if (this.opts.closeMethods.includes('button')) {
    this.modalCloseBtn.addEventListener('click', this.events.clickCloseBtn);
  }

  this.modal.addEventListener('mousedown', this.events.clickOverlay);
  document.addEventListener('keydown', this.events.keyboardNav);
}

/**
 * _unbindEvents - unbind the events of modal
 */
function _unbindEvents() {
  if (this.opts.closeMethods.includes('button')) {
    this.modalCloseBtn.removeEventListener('click', this.events.clickCloseBtn);
  }

  // this.modal.removeEventListener('mousedown', this.events.clickOverlay);
}

/**
 * _handleClickOverlay - handle click event on overlay when clicked outside the modal and close the modal if passes the condition
 *
 * @param  {object} event event
 */
function _handleClickOverlay(event) {
  // if click is outside the modal
  if (this.opts.closeMethods.includes('overlay') && !_findAncestor(event.target, 'vplayer-modal') && event.clientX < this.modal.clientWidth) {
    this.close();
  }
}

/**
 * _handleKeyboardNav - handle close on escape press
 *
 * @param  {object} event description
 * @return {type}       description
 */
function _handleKeyboardNav(event) {
   // escape key
   if (this.opts.closeMethods.indexOf('escape') !== -1 && event.which === 27 && this.isOpen()) {
      this.close();
   }
 }

/**
 * _findAncestor - find the closest ancestor with the  class name of an input element
 *
 * @param  {DOMElement} el  element for which ancestor to be found
 * @param  {string} cls ancestor className
 * @return {DOMElement} return the element
 */
function _findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}


function _transitionEvents() {
  let el = document.createElement('vplayer-modal-transition-element');
  let transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  }
  for (var t in transitions) {
    if (el.style[t] !== undefined) {
        return transitions[t];
    }
  }
}

class Modal {
  constructor(options) {
    let defaults = defaultModalOptions();
    this.opts = Object.assign(defaults, options);
    this.transitionEvent = _transitionEvents();
    this.init();
  }

  init() {
    // If modal is already present, do not call the subsequent codes and return false.
    if (this.modal) {
      return;
    }

    _buildUI.call(this);
    _bindEvents.call(this);

    // Insert the modal in DOM
    if (this.modal) {
      document.body.appendChild(this.modal);
    }
  }

  busy(state) {
    this.isBusy = state;
  }

  open() {
    if (this.isBusy) {
      return ;
    }

    this.busy(true);

    if (typeof this.opts.beforeOpen === 'function') {
      this.opts.beforeOpen();
    }

    if (this.modal.style.removeProperty) {
       this.modal.style.removeProperty('display')
    } else {
       this.modal.style.removeAttribute('display')
    }

    // prevent background scrolling
    this._scrollPosition = window.pageYOffset;
    document.body.classList.add('vplayer-modal--enabled');

    this.modal.classList.add('vplayer-modal--visible');
    let _transitionEvt = this.transitionEvent;
    if (_transitionEvt) {
      let _self = this;
      this.modal.addEventListener(_transitionEvt, function handler() {
        if (typeof _self.opts.onOpen === 'function') {
          _self.opts.onOpen.call(_self);
        }

        _self.modal.removeEventListener(_transitionEvt, handler, false);
        _self.busy(false);
      }, false);
    } else {
      if (typeof this.opts.onOpen === 'function') {
        this.opts.onOpen.call(this);
      }
      this.busy(false);
    }
  }

  isOpen() {
    return !!this.modal.classList.contains('vplayer-modal--visible');
  }

  close(force) {
    if (this.isBusy) {
      return ;
    }
    this.busy(true);

    force = force || false;

    if (typeof this.opts.beforeClose === 'function') {
      let close = this.opts.beforeClose.call(this);
      if (!close) return;
    }

    document.body.classList.remove('vplayer-modal--enabled');
    window.scrollTo(0 , this._scrollPosition);

    this.modal.classList.remove('vplayer-modal--visible');

    let _transitionEvt = this.transitionEvent;

    if (_transitionEvt && !force) {
      let _self = this;
      this.modal.addEventListener(_transitionEvt, function handler() {
        // detach event after transition end (so it doesn't fire multiple onClose)
        _self.modal.removeEventListener(_transitionEvt, handler, false);
        _self.modal.style.display = 'none'

        // on close callback
        if (typeof _self.opts.onClose === 'function') {
            _self.opts.onClose.call(this)
        }

        _self.busy(false)
      }, false);
    } else {
      this.modal.style.display = 'none';
      if (typeof this.opts.onClose === 'function') {
        this.opts.onClose.call(this);
      }
      this.busy(false);
    }
  }

  destroy() {
    // Check for the modal being destroyed already
    if (this.modal === null) {
      return;
    }

    if (this.isOpen()) {
      this.close(true);
    }

    // Unbind all events
    _unbindEvents.call(this);

    // Remove from DOM
    this.modal.parentNode.removeChild(this.modal);

    // Set the object to null;
    this.modal = null;
  }

  getContent() {
    return this.modalContent;
  }

  setContent(content) {
    // check type of content : String or Node
    if (typeof content === 'string') {
      this.modalContent.innerHTML = content;
    } else {
      this.modalContent.innerHTML = '';
      this.modalContent.appendChild(content);
    }
  }
}

export default Modal;
