import { newKeyboardLayout, newKalamineLayout, isDeadKey } from './layout.js';


/*******************************************************************************
 * Shadow DOM
 */

const css = `
  /**
   * graphical keyboard layout, fixed size (664*230px)
   */

  ul {
    width: 664px;
    height: 230px;
    padding: 0;
    margin: 20px auto;
    position: relative;
  }


  /**************************************************************************
   * Default Keyboard Geometry (ANSI/pc104)
   */

  /* rows */
  li {
    list-style-type: none;
    clear: both;
    margin: 0;
    padding: 0;
  }
  #row_AD { position: absolute; top:  46px; }
  #row_AC { position: absolute; top:  92px; }
  #row_AB { position: absolute; top: 138px; }
  #row_AA { position: absolute; top: 184px; }

  /* keys */
  key {
    position: relative;
    float: left;
    clear: none;
    width: 40px;
    height: 40px;
    margin: 2px;
    border: 1px solid #aaa;
    border-radius: 5px;
  }
  key * {
    font-weight: inherit;
    font-style: inherit;
    color: #333;
  }
  key strong {
    position: absolute;
    top: 2px;
    left: 3px;
  }
  key em {
    position: absolute;
    bottom: 2px;
    left: 3px;
  }
  key .dk,
  key .altgr {
    left: auto;
    right: 5px;
    color: blue;
    opacity: 0.5;
  }
  key .dk {
    color: red;
  }
  key .deadKey {
    font-weight: bold;
    color: red;
  }

  /* special keys */
  .specialKey {
    background-color: #ddd;
  }
  .specialKey * {
    font-size: 13px;
    font-style: italic;
  }
  #row_AA    .specialKey   { width:  56px; }
  #row_AA     #ContextMenu { width:  40px; }
  #Space                   { width: 240px; }
  #Tab,       #Backspace   { width:  60px; }
  #CapsLock,  #Enter       { width:  73px; }
  #ShiftLeft, #ShiftRight  { width:  96px; }

  #Escape *, #Tab *, #CapsLock *, #ShiftLeft *, #ShiftRight *, #Enter * {
    font-size: 1.25em;
    font-style: normal;
  }
  #ContextMenu *, #Backspace * {
    font-style: normal;
  }

  /* hide LSGT for ANSI (default) */
  #IntlBackslash, #CapsLockISO, #EnterISO, #Escape {
    display: none;
  }


  /**************************************************************************
   * European Keyboard Geometry (ISO/pc105)
   */

  [shape="iso"] #ShiftLeft {
    width: 50px;
  }
  [shape="iso"] #Enter {
    width: 27px;
    height: 86px;
    margin-top: -44px;
    margin-left: 48px;
  }
  [shape="iso"] #Backslash {
    margin-top: 48px;
    margin-left: -31px;
  }
  [shape="iso"] #IntlBackslash {
    display: block;
  }
  /* visual tweaks for CapsLock and Return */
  [shape="iso"] #CapsLockISO,
  [shape="iso"] #EnterISO {
    background-color: #e8e8e8;
    display: block;
  }
  [shape="iso"] #CapsLock {
    width: 60px;
  }
  [shape="iso"] #CapsLock,
  [shape="iso"] #Enter {
    z-index: 1;
  }
  [shape="iso"] #CapsLockISO {
    margin-left: -64px;
    width: 73px;
  }
  [shape="iso"] #EnterISO {
    margin-top: -44px;
    margin-left: -44px;
    width: 40px;
  }


  /**************************************************************************
   * Ortholinear Keyboard Geometry (TypeMatrix, OLKB)
   */

  [shape^="ol"] #CapsLock {
    display: none;
  }
  [shape^="ol"] #Backslash {
    margin-top: 94px;
    margin-left: -96px;
  }
  [shape^="ol"] #Backquote,
  [shape^="ol"] #Tab,
  [shape^="ol"] #ShiftLeft,
  [shape^="ol"] #ControlLeft,
  [shape^="ol"] #Equal,
  [shape^="ol"] #BracketRight,
  [shape^="ol"] #ShiftRight,
  [shape^="ol"] #ControlRight,
  [shape^="ol"] #Backspace,
  [shape^="ol"] #Enter {
    width: 46px;
  }
  [shape^="ol"] #MetaLeft,
  [shape^="ol"] #AltLeft,
  [shape^="ol"] #MetaRight,
  [shape^="ol"] #AltRight {
    width: 63px;
  }
  [shape^="ol"] #ShiftLeft,
  [shape^="ol"] #ShiftRight {
    margin-top: -44px;
    height: 86px;
  }

  /* TypeMatrix-specific (TMx2030) */

  [shape="ol60"] #Backquote,
  [shape="ol60"] #Tab,
  [shape="ol60"] #ShiftLeft,
  [shape="ol60"] #ControlLeft { margin-left:  3px; }
  [shape="ol60"] #KeyA        { margin-left: 55px; /* XXX why not 54px? */ }
  [shape="ol60"] #Digit6,
  [shape="ol60"] #KeyY,
  [shape="ol60"] #KeyH,
  [shape="ol60"] #KeyN        { margin-left:   54px; }
  [shape="ol60"] #Backspace   { margin-left: -378px; height: 86px; }
  [shape="ol60"] #Enter       { margin-left: -326px; height: 86px; }
  [shape="ol60"] #ShiftRight  { margin-left:   48px; }
  [shape="ol60"] #Space {
    width: 230px;
  }

  /* OLKB-specific (Preonic, Planck)*/

  [shape="ol50"],
  [shape="ol40"] { width: 564px; padding: 0 50px; }
  [shape="ol50"] #Escape,
  [shape="ol40"] #Escape { display: inline-block; width: 46px; }
  [shape="ol50"] #KeyA,
  [shape="ol40"] #KeyA { margin-left: 54px; }
  [shape="ol50"] #Space,
  [shape="ol40"] #Space { width: 178px; }
  [shape="ol50"] #Enter,
  [shape="ol40"] #Enter { margin-top: -44px; }
  [shape="ol50"] #ContextMenu,
  [shape="ol40"] #ContextMenu,
  [shape="ol50"] .pinkyKey,
  [shape="ol40"] .pinkyKey { display: none; }

  [shape="ol40"] .numberKey { display: none; }
  [shape="ol40"] #ShiftLeft,
  [shape="ol40"] #ShiftRight,
  [shape="ol40"] #Enter     { margin-top: 2px; height: 40px; }
  [shape="ol40"] #Escape    { margin-top: 94px; }
  [shape="ol40"] #Backspace { margin: -90px 514px 0; /* XXX magic numbers */ }


  /**************************************************************************
   * Special Keys: position & icons
   */

  /* text labels on PC (win/linux) */
  #ControlLeft  em::before,
  #ControlRight em::before { content: 'Ctrl'; }
  #AltLeft      em::before { content: 'Alt';  }
  #AltRight     em::before { content: 'AltGr';}
  [platform="win"]   #MetaLeft  em::before,
  [platform="win"]   #MetaRight em::before { content: 'Win'; }
  [platform="linux"] #MetaLeft  em::before,
  [platform="linux"] #MetaRight em::before { content: 'Super'; }

  /* icon labels on Mac */
  [platform="mac"] #row_AA       em::before { font-style: normal; }
  [platform="mac"] #ControlLeft  em::before,
  [platform="mac"] #ControlRight em::before { font-size: 1.2em; content: '\u2303'; }
  [platform="mac"] #AltLeft      em::before,
  [platform="mac"] #AltRight     em::before { font-size: 1.2em; content: '\u2325'; }
  [platform="mac"] #MetaLeft     em::before,
  [platform="mac"] #MetaRight    em::before { font-size: 1.2em; content: '\u2318'; }

  /* swap the Command and Option keys on Mac */
  [platform="mac"] #MetaLeft,
  [platform="mac"] #AltRight { margin-left: 64px; }
  [platform="mac"] #MetaRight,
  [platform="mac"] #AltLeft { margin-left: -122px; }
  [platform="mac"][shape^="ol"] #MetaLeft,
  [platform="mac"][shape^="ol"] #AltRight { margin-left: 71px; }
  [platform="mac"][shape^="ol"] #MetaRight,
  [platform="mac"][shape^="ol"] #AltLeft { margin-left: -136px; }

  /* common key icons */
  #ShiftLeft   em::before,
  #ShiftRight  em::before { content: '\u21e7'; }
  #CapsLock    em::before { content: '\u21ea'; }
  #Tab         em::before { content: '\u21b9'; }
  #Backspace   em::before { content: '\u232b'; }
  #Escape      em::before { content: '\u238b'; }
  #Enter       em::before { content: '\u23ce'; }
  /* not really a 'menu' character, but looks like one */
  #ContextMenu em::before { content: '\u2630'; }


  /**************************************************************************
   * Color Theme
   */

  [theme="reach"] .pinkyKey  { background-color: hsl(  0, 100%, 90%); }
  [theme="reach"] .numberKey { background-color: hsl( 42, 100%, 90%); }
  [theme="reach"] .letterKey { background-color: hsl(122, 100%, 90%); }
  [theme="reach"] .homeKey   { background-color: hsl(122, 100%, 75%); }

  [theme="hints"] [finger="m1"] { background-color: hsl(  0, 100%, 95%); }
  [theme="hints"] [finger="l2"] { background-color: hsl( 42, 100%, 85%); }
  [theme="hints"] [finger="r2"] { background-color: hsl( 61, 100%, 85%); }
  [theme="hints"] [finger="l3"],
  [theme="hints"] [finger="r3"] { background-color: hsl(136, 100%, 85%); }
  [theme="hints"] [finger="l4"],
  [theme="hints"] [finger="r4"] { background-color: hsl(200, 100%, 85%); }
  [theme="hints"] [finger="l5"],
  [theme="hints"] [finger="r5"] { background-color: hsl(230, 100%, 85%); }
  [theme="hints"] .specialKey   { background-color: #ddd; }
  [theme="hints"] .hint {
    font-weight: bold;
    background-color: brown;
    color: white;
  }

  .alt em, .alt strong,
  .dk em, .dk strong { opacity: 0.25; }
  .alt .altgr,
  .dk .dk { opacity: 1; }
  .dk .altgr { display: none; }
`;

const html = `
  <ul id="keyboard">
    <li id="row_AE">
      <key id="Escape" class="specialKey"> <em></em> </key>
      <key id="Backquote" finger="l5" class="pinkyKey"> </key>
      <key id="Digit1"    finger="l5" class="numberKey"></key>
      <key id="Digit2"    finger="l4" class="numberKey"></key>
      <key id="Digit3"    finger="l3" class="numberKey"></key>
      <key id="Digit4"    finger="l2" class="numberKey"></key>
      <key id="Digit5"    finger="l2" class="numberKey"></key>
      <key id="Digit6"    finger="r2" class="numberKey"></key>
      <key id="Digit7"    finger="r2" class="numberKey"></key>
      <key id="Digit8"    finger="r3" class="numberKey"></key>
      <key id="Digit9"    finger="r4" class="numberKey"></key>
      <key id="Digit0"    finger="r5" class="numberKey"></key>
      <key id="Minus"     finger="r5" class="pinkyKey"> </key>
      <key id="Equal"     finger="r5" class="pinkyKey"> </key>
      <key id="Backspace" class="specialKey"> <em></em> </key>
    </li>
    <li id="row_AD">
      <key id="Tab" class="specialKey"> <em></em> </key>
      <key id="KeyQ"         finger="l5" class="letterKey"></key>
      <key id="KeyW"         finger="l4" class="letterKey"></key>
      <key id="KeyE"         finger="l3" class="letterKey"></key>
      <key id="KeyR"         finger="l2" class="letterKey"></key>
      <key id="KeyT"         finger="l2" class="letterKey"></key>
      <key id="KeyY"         finger="r2" class="letterKey"></key>
      <key id="KeyU"         finger="r2" class="letterKey"></key>
      <key id="KeyI"         finger="r3" class="letterKey"></key>
      <key id="KeyO"         finger="r4" class="letterKey"></key>
      <key id="KeyP"         finger="r5" class="letterKey"></key>
      <key id="BracketLeft"  finger="r5" class="pinkyKey"> </key>
      <key id="BracketRight" finger="r5" class="pinkyKey"> </key>
      <key id="Backslash"    finger="r5" class="pinkyKey"> </key>
    </li>
    <li id="row_AC">
      <key id="CapsLock" class="specialKey"> <em></em> </key>
      <key id="CapsLockISO" class="specialKey hiddenKey"> &nbsp; </key>
      <key id="KeyA"      finger="l5" class="letterKey homeKey"></key>
      <key id="KeyS"      finger="l4" class="letterKey homeKey"></key>
      <key id="KeyD"      finger="l3" class="letterKey homeKey"></key>
      <key id="KeyF"      finger="l2" class="letterKey homeKey"></key>
      <key id="KeyG"      finger="l2" class="letterKey"> </key>
      <key id="KeyH"      finger="r2" class="letterKey"> </key>
      <key id="KeyJ"      finger="r2" class="letterKey homeKey"></key>
      <key id="KeyK"      finger="r3" class="letterKey homeKey"></key>
      <key id="KeyL"      finger="r4" class="letterKey homeKey"></key>
      <key id="Semicolon" finger="r5" class="letterKey homeKey"></key>
      <key id="Quote"     finger="r5" class="pinkyKey"> </key>
      <key id="Enter" class="specialKey"> <em></em> </key>
      <key id="EnterISO" class="specialKey hiddenKey"> &nbsp; </key>
    </li>
    <li id="row_AB">
      <key id="ShiftLeft"     finger="l5" class="specialKey"> <em></em> </key>
      <key id="IntlBackslash" finger="l5" class="pinkyKey"> </key>
      <key id="KeyZ"          finger="l5" class="letterKey"></key>
      <key id="KeyX"          finger="l4" class="letterKey"></key>
      <key id="KeyC"          finger="l3" class="letterKey"></key>
      <key id="KeyV"          finger="l2" class="letterKey"></key>
      <key id="KeyB"          finger="l2" class="letterKey"></key>
      <key id="KeyN"          finger="r2" class="letterKey"></key>
      <key id="KeyM"          finger="r2" class="letterKey"></key>
      <key id="Comma"         finger="r3" class="letterKey"></key>
      <key id="Period"        finger="r4" class="letterKey"></key>
      <key id="Slash"         finger="r5" class="letterKey"></key>
      <key id="ShiftRight"    finger="r5" class="specialKey"> <em></em> </key>
    </li>
    <li id="row_AA">
      <key class="specialKey" id="ControlLeft">       <em></em> </key>
      <key class="specialKey" id="MetaLeft">          <em></em> </key>
      <key class="specialKey" id="AltLeft">           <em></em> </key>
      <key class="homeKey"    id="Space" finger="m1"> <em></em> </key>
      <key class="specialKey" id="AltRight">          <em></em> </key>
      <key class="specialKey" id="MetaRight">         <em></em> </key>
      <key class="specialKey" id="ContextMenu">       <em></em> </key>
      <key class="specialKey" id="ControlRight">      <em></em> </key>
    </li>
  </ul>
`;

const template = document.createElement('template');
template.innerHTML = `<style>${css}</style>${html}`;


/*******************************************************************************
 * Keyboard Layout
 */

const drawKey = (element, keyMap) => {
  element.innerHTML = '';
  if (!keyMap) {
    return;
  }

  const createLabel = (type, label, className) => {
    let element = document.createElement(type);
    if (isDeadKey(label)) {
      element.classList.add('deadKey');
      element.textContent = label[1];
    } else {
      element.textContent = label || '';
    }
    if (className) {
      element.classList.add(className);
    }
    return element;
  };

  const [ base, shift, alt ] = keyMap[element.id] || [''];
  element.appendChild(createLabel('strong', shift));
  if (base.toUpperCase() !== shift) {
    element.appendChild(createLabel('em', base));
  }
  element.appendChild(createLabel('em', alt, 'altgr'));
  element.appendChild(createLabel('em', '', 'dk'));
  element.appendChild(createLabel('strong', '', 'dk'));
};

const drawDK = (element, keyMap, deadKey) => {
  const key = keyMap[element.id];
  if (!key || element.classList.contains('specialKey')) {
    return;
  }
  const alt0 = deadKey[key[0]];
  const alt1 = deadKey[key[1]];
  if (alt0) {
    element.querySelector('em.dk').textContent = alt0;
    if (alt1 && alt0.toUpperCase() !== alt1) {
      element.querySelector('strong.dk').textContent = alt1;
    }
  }
};

const setFingerAssignment = (root, ansiStyle) => {
  let i = 1;
  (ansiStyle ?
    [ 'l5', 'l5', 'l4', 'l3', 'l2', 'l2', 'r2', 'r2', 'r3', 'r4' ] :
    [ 'l5', 'l4', 'l3', 'l2', 'l2', 'r2', 'r2', 'r3', 'r4', 'r5' ])
    .forEach(finger =>
      root.getElementById('Digit' + (i++ % 10)).setAttribute('finger', finger));
};

const getKeyChord = (root, key) => {
  if (!key || !key.id) {
    return [];
  }
  const element = root.getElementById(key.id);
  let chord = [ element ];
  if (key.level > 1) { // altgr
    chord.push(root.getElementById('AltRight'));
  }
  if (key.level % 2) { // shift
    chord.push(root.getElementById(element.getAttribute('finger')[0] == 'l' ?
      'ShiftRight' : 'ShiftLeft'));
  }
  return chord;
};

const guessPlatform = () => {
  const p = navigator.platform.toLowerCase();
  if (p.startsWith('win')) {
    return 'win';
  } else if (p.startsWith('mac')) {
    return 'mac';
  } else if (p.startsWith('linux')) {
    return 'linux';
  } else {
    return '';
  }
};

const defaultKeyPressStyle = 'background-color: #aaf;';
const defaultKeyPressDuration = 250;


/*******************************************************************************
 * Custom Element
 */

class Keyboard extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));
    this._state = {
      shape:    this.getAttribute('shape')    || 'ansi',
      theme:    this.getAttribute('theme')    || '',
      platform: this.getAttribute('platform') || guessPlatform(),
      layout:   {},
    };
    this.shape    = this._state.shape;
    this.theme    = this._state.theme;
    this.platform = this._state.platform;
  }

  /**
   * User Interface: color theme, shape, layout.
   */

  get theme() {
    return this._state.theme;
  }

  set theme(value) {
    this._state.theme = value;
    this.root.getElementById('keyboard').setAttribute('theme', value);
  }

  get shape() {
    return this._state.shape;
  }

  set shape(value) {
    const shape = value.toLowerCase();
    switch (shape) {
      case 'iso':
        setFingerAssignment(this.root, false);
        break;
      case 'ansi':
      case 'ol60':
      case 'ol50':
      case 'ol40':
        setFingerAssignment(this.root, true);
        break;
      default:
        return;
    }
    this._state.shape = shape;
    this.root.getElementById('keyboard').setAttribute('shape', shape);
  }

  get platform() {
    return this._state.platform;
  }

  set platform(value) {
    const platform = value.toLowerCase();
    switch (platform) {
      case 'win':
      case 'mac':
      case 'linux':
        break;
      default:
        return;
    }
    this._state.platform = platform;
    this.layout.platform = platform;
    this.root.getElementById('keyboard').setAttribute('platform', platform);
  }

  get layout() {
    return this._state.layout;
  }

  set layout(value) {
    this._state.layout = value;
    this._state.layout.platform = this.platform;
    Array.from(this.root.querySelectorAll('key'))
      .filter(key => !key.classList.contains('specialKey'))
      .forEach(key => drawKey(key, value.keyMap));
  }

  setKalamineLayout(keyMap, deadKeys) {
    this.layout = newKalamineLayout(keyMap || {}, deadKeys || []);
  }

  setKeyboardLayout(keyMap, deadKeys) {
    this.layout = newKeyboardLayout(keyMap || {}, deadKeys || {});
  }

  /**
   * KeyboardEvent helpers
   */

  keyDown(keyCode) {
    const code = keyCode.replace(/^OS/, 'Meta'); // https://bugzil.la/1264150
    const element = this.root.getElementById(code);
    if (!element || !this.layout) {
      return '';
    }
    element.style.cssText = defaultKeyPressStyle;
    const dk = this.layout.pendingDK;
    const rv = this.layout.keyDown(code);
    if (this.layout.modifiers.altgr) {
      this.root.getElementById('keyboard').classList.add('alt');
    }
    if (dk) { // a dead key has just been unlatched, hide all key hints
      this.root.getElementById('keyboard').classList.remove('dk')
      Array.from(this.root.querySelectorAll('.dk'))
        .forEach(span => span.textContent = '');
    } else if (this.layout.pendingDK) { // show hints for this dead key
      Array.from(this.root.querySelectorAll('key'))
        .forEach(key => drawDK(key, this.layout.keyMap, this.layout.pendingDK));
      this.root.getElementById('keyboard').classList.add('dk');
    }
    return rv;
  }

  keyUp(keyCode) {
    const code = keyCode.replace(/^OS/, 'Meta'); // https://bugzil.la/1264150
    const element = this.root.getElementById(code);
    if (!element) {
      return;
    }
    element.style.cssText = '';
    const rv = this.layout.keyUp(code);
    if (!this.layout.modifiers.altgr) {
      this.root.getElementById('keyboard').classList.remove('alt');
    }
  }

  /**
   * Keyboard hints
   */

  clearStyle() {
    Array.from(this.root.querySelectorAll('li[style]'))
      .forEach(element => element.removeAttribute('style'));
  }

  showHint(key) {
    let hintClass = '';
    Array.from(this.root.querySelectorAll('li.hint'))
      .forEach(li => li.classList.remove('hint'));
    getKeyChord(this.root, key).forEach(li => {
      li.classList.add('hint');
      hintClass += li.getAttribute('finger') + ' ';
    });
    return hintClass;
  }

  showKey(key, cssText) {
    this.clearStyle();
    getKeyChord(this.root, key)
      .forEach(li => li.style.cssText = cssText || defaultKeyPressStyle);
  }

  showKeys(chars, cssText) {
    this.clearStyle();
    this.layout.getKeySequence(chars)
      .forEach(key => this.root.getElementById(key.id).style.cssText =
        cssText || defaultKeyPressStyle);
  }

  typeKeys(str, duration) {
    function *pressKeys(keys) {
      for (let key of keys) {
        yield key;
      }
    }
    let it = pressKeys(this.layout.getKeySequence(str));
    const send = setInterval(() => {
      const { value, done } = it.next();
      // this.showHint(value);
      this.showKey(value);
      if (done) {
        clearInterval(send);
      }
    }, duration || defaultKeyPressDuration);
  }

}

customElements.define('x-keyboard', Keyboard);
