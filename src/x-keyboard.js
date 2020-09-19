import { newKeyboardLayout } from './x-keyboard-layout.js';
import { svgContent, drawKey, drawDK } from './content.js';
import css from './style.js';

/**
 * Custom Element
 */

const setFingerAssignment = (root, ansiStyle) => {
  (ansiStyle
    ? ['l5', 'l4', 'l3', 'l2', 'l2', 'r2', 'r2', 'r3', 'r4', 'r5']
    : ['l5', 'l5', 'l4', 'l3', 'l2', 'l2', 'r2', 'r2', 'r3', 'r4'])
    .forEach((attr, i) => {
      root.getElementById(`Digit${(i + 1) % 10}`).setAttribute('finger', attr);
    });
};

const getKeyChord = (root, key) => {
  if (!key || !key.id) {
    return [];
  }
  const element = root.getElementById(key.id);
  const chord = [ element ];
  if (key.level > 1) { // altgr
    chord.push(root.getElementById('AltRight'));
  }
  if (key.level % 2) { // shift
    chord.push(root.getElementById(element.getAttribute('finger')[0] === 'l'
      ? 'ShiftRight' : 'ShiftLeft'));
  }
  return chord;
};

const guessPlatform = () => {
  const p = navigator.platform.toLowerCase();
  if (p.startsWith('win')) {
    return 'win';
  }
  if (p.startsWith('mac')) {
    return 'mac';
  }
  if (p.startsWith('linux')) {
    return 'linux';
  }
  return '';
};

const template = document.createElement('template');
template.innerHTML = `<style>${css}</style>${svgContent}`;

class Keyboard extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));
    this._state = {
      geometry: this.getAttribute('geometry') || '',
      platform: this.getAttribute('platform') || '',
      theme:    this.getAttribute('theme')    || '',
      layout:   newKeyboardLayout(),
    };
    this.geometry = this._state.geometry;
    this.platform = this._state.platform;
    this.theme    = this._state.theme;
  }

  /**
   * User Interface: color theme, shape, layout.
   */

  get theme() {
    return this._state.theme;
  }

  set theme(value) {
    this._state.theme = value;
    this.root.querySelector('svg').setAttribute('theme', value);
  }

  get geometry() {
    return this._state.geometry;
  }

  set geometry(value) {
    /**
     * Supported geometries (besides ANSI):
     * - Euro-style [Enter] key:
     *     ISO  = ANSI + IntlBackslash
     *     ABNT = ISO + IntlRo + NumpadComma
     *     JIS  = ISO + IntlRo + IntlYen - IntlBackslash
     *                + NonConvert + Convert + KanaMode
     * - Russian-style [Enter] key:
     *     ALT = ANSI - Backslash + IntlYen
     *     KS = ALT + Lang1 + Lang2
     * - Ortholinear:
     *     OL60 = TypeMatrix 2030
     *     OL50 = OLKB Preonic
     *     OL40 = OLKB Planck
     */
    const supportedShapes = {
      alt:  'alt intlYen',
      ks:   'alt intlYen ks',
      jis:  'iso intlYen intlRo jis',
      abnt: 'iso intlBackslash intlRo',
      iso:  'iso intlBackslash',
      ansi: '',
      ol60: 'ergo ol60',
      ol50: 'ergo ol50',
      ol40: 'ergo ol40',
    };
    if (value && !(value in supportedShapes)) {
      return;
    }
    this._state.geometry = value;
    const geometry = value || this.layout.geometry || 'ansi';
    const shape = supportedShapes[geometry];
    this.root.querySelector('svg').className.baseVal = shape;
    setFingerAssignment(this.root, !shape.startsWith('iso'));
  }

  get platform() {
    return this._state.platform;
  }

  set platform(value) {
    const supportedPlatforms = {
      win: 'win',
      mac: 'mac',
      linux: 'gnu',
    };
    this._state.platform = value in supportedPlatforms ? value : '';
    const platform = this._state.platform || guessPlatform();
    this.layout.platform = platform;
    this.root.querySelector('svg')
      .setAttribute('platform', supportedPlatforms[platform]);
  }

  get layout() {
    return this._state.layout;
  }

  set layout(value) {
    this._state.layout = value;
    this._state.layout.platform = this.platform;
    this.geometry = this._state.geometry;
    Array.from(this.root.querySelectorAll('.key'))
      .forEach((key) => drawKey(key, value.keyMap));
  }

  setKeyboardLayout(keyMap, deadKeys, geometry) {
    this.layout = newKeyboardLayout(keyMap, deadKeys, geometry);
  }

  /**
   * KeyboardEvent helpers
   */

  keyDown(event) {
    const code = event.code.replace(/^OS/, 'Meta'); // https://bugzil.la/1264150
    if (!code) {
      return '';
    }
    const element = this.root.getElementById(code);
    if (!element) {
      return '';
    }
    element.classList.add('press');
    const dk  = this.layout.pendingDK;
    const rv  = this.layout.keyDown(code); // updates `this.layout.pendingDK`
    const alt = this.layout.modifiers.altgr;
    if (alt) {
      this.root.querySelector('svg').classList.add('altgr');
    }
    if (dk) { // a dead key has just been unlatched, hide all key hints
      if (!element.classList.contains('specialKey')) {
        this.root.querySelector('svg').classList.remove('dk');
        Array.from(this.root.querySelectorAll('.dk'))
          .forEach((span) => {
            span.textContent = '';
          });
      }
    } else if (this.layout.pendingDK) { // show hints for this dead key
      Array.from(this.root.querySelectorAll('.key')).forEach((key) => {
        drawDK(key, this.layout.keyMap, this.layout.pendingDK);
      });
      this.root.querySelector('svg').classList.add('dk');
    }
    return (!alt && (event.ctrlKey || event.altKey || event.metaKey))
      ? '' : rv; // don't steal ctrl/alt/meta shortcuts
  }

  keyUp(event) {
    const code = event.code.replace(/^OS/, 'Meta'); // https://bugzil.la/1264150
    if (!code) {
      return;
    }
    const element = this.root.getElementById(code);
    if (!element) {
      return;
    }
    element.classList.remove('press');
    this.layout.keyUp(code);
    if (!this.layout.modifiers.altgr) {
      this.root.querySelector('svg').classList.remove('altgr');
    }
  }

  /**
   * Keyboard hints
   */

  clearStyle() {
    Array.from(this.root.querySelectorAll('[style]'))
      .forEach((element) => element.removeAttribute('style'));
    Array.from(this.root.querySelectorAll('.press'))
      .forEach((element) => element.classList.remove('press'));
  }

  showKeys(chars, cssText) {
    this.clearStyle();
    this.layout.getKeySequence(chars)
      .forEach((key) => {
        this.root.getElementById(key.id).style.cssText = cssText;
      });
  }

  showHint(keyObj) {
    let hintClass = '';
    Array.from(this.root.querySelectorAll('.hint'))
      .forEach((key) => key.classList.remove('hint'));
    getKeyChord(this.root, keyObj).forEach((key) => {
      key.classList.add('hint');
      hintClass += `${key.getAttribute('finger')} `;
    });
    return hintClass;
  }

  pressKey(keyObj) {
    this.clearStyle();
    getKeyChord(this.root, keyObj)
      .forEach((key) => {
        key.classList.add('press');
      });
  }

  pressKeys(str, duration = 250) {
    function* pressKeys(keys) {
      for (const key of keys) { // eslint-disable-line
        yield key;
      }
    }
    const it = pressKeys(this.layout.getKeySequence(str));
    const send = setInterval(() => {
      const { value, done } = it.next();
      // this.showHint(value);
      this.pressKey(value);
      if (done) {
        clearInterval(send);
      }
    }, duration);
  }
}

customElements.define('x-keyboard', Keyboard);
