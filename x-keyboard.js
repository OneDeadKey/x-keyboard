import { newKeyboardLayout, newKalamineLayout, isDeadKey }
from './x-keyboard-layout.js';

// Useful links:
// https://www.w3.org/TR/uievents-code/
// https://commons.wikimedia.org/wiki/File:Physical_keyboard_layouts_comparison_ANSI_ISO_KS_ABNT_JIS.png


/*******************************************************************************
 * Shadow DOM
 */

const css = `
  /**
   * graphical keyboard layout, fixed size (690*230px)
   */

  ul {
    width: 690px;
    height: 230px;
    padding: 0;
    margin: 20px auto;
    position: relative;
  }


  /**************************************************************************
   * Default Keyboard Geometry (ANSI/101)
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
  #row_AA .specialKey { width:  56px; }
  #Space              { width: 250px; }
  #Tab                { width:  60px; }
  #Backspace          { width:  86px; }
  #ShiftLeft          { width:  96px; }
  #ShiftRight         { width: 122px; }

  #Escape *, #Tab *, #CapsLock *, #ShiftLeft *, #ShiftRight *, #Enter * {
    font-size: 1.25em;
    font-style: normal;
  }
  #ContextMenu *, #Backspace * {
    font-style: normal;
  }

  /* hide LSGT for ANSI (default) */
  #IntlBackslash, #IntlRo, #IntlYen, #Escape {
    display: none;
  }


  /**************************************************************************
   * Visual Tweaks for CapsLock and Return
   */

  #CapsLockISO, #EnterISO {
    background-color: #e8e8e8;
    display: block;
  }
  #CapsLock {
    width: 60px;
  }
  #CapsLock, #Enter {
    z-index: 1;
  }
  #CapsLockISO {
    margin-left: -64px;
    width: 73px;
  }
  [shape^="ol"]   #CapsLockISO, [shape^="ol"]   #EnterISO,
  [shape^="ansi"] #CapsLockISO, [shape^="ansi"] #EnterISO {
    display: none;
  }
  [shape="ansi"] #CapsLock  { width: 73px; }
  [shape="ansi"] #Enter     { width: 99px; }
  [shape="ansi"] #Backslash { width: 66px; }


  /**************************************************************************
   * Alternate Keyboard Geometry (ALT/101)
   */

  [shape^="alt"] #IntlYen   { display: block; }
  [shape^="alt"] #Backslash { display: none; }
  [shape^="alt"] #Backspace { width: 40px; }

  /* visual tweaks for Return */
  [shape^="alt"] #Enter {
    margin-top: -44px;
    margin-left: 35px;
    height: 86px;
    width: 66px;
  }
  [shape^="alt"] #EnterISO {
    margin-left: -103px;
    width: 99px;
  }


  /**************************************************************************
   * European Keyboard Geometry (ISO/pc102)
   *     + Brazilian Variant (ABNT/pc104)
   *     + Japanese Variant (JIS/pc106)
   */

  /* visual tweaks for Backslash & Return */
  [shape^="iso"] #Backslash {
    margin-top: 48px;
    margin-left: -31px;
  }
  [shape^="iso"] #Enter {
    margin-top: -44px;
    margin-left: 48px;
    width: 53px;
    height: 86px;
  }
  [shape^="iso"] #EnterISO {
    margin-top: -44px;
    margin-left: -70px;
    width: 66px;
  }

  /* show IntlBackslash for ISO & ABNT */
  [shape="iso102"] #ShiftLeft,
  [shape="iso104"] #ShiftLeft {
    width: 50px;
  }
  [shape="iso102"] #IntlBackslash,
  [shape="iso104"] #IntlBackslash {
    display: block;
  }

  /* show IntlRo for ABNT & JIS */
  [shape="iso104"] #ShiftRight,
  [shape="iso106"] #ShiftRight {
    width: 76px;
  }
  [shape="iso104"] #IntlRo,
  [shape="iso106"] #IntlRo {
    display: block;
  }

  /* show IntlYen for JIS */
  [shape="iso106"] #IntlYen   { display: block; }
  [shape="iso106"] #Backspace { width: 40px; }


  /**************************************************************************
   * Ortholinear Keyboard Geometry (TypeMatrix, OLKB)
   */

  [shape^="ol"] #CapsLock {
    display: none;
  }
  [shape^="ol"] #Backslash {
    margin-top: 94px;
    margin-left: -105px;
  }
  [shape^="ol"] #Escape,
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
    width: 55px;
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

  [shape="ol60"] #Space       { width: 239px; }
  [shape="ol60"] #ContextMenu { width:  40px; }
  [shape="ol60"] #Backquote,
  [shape="ol60"] #Tab,
  [shape="ol60"] #ShiftLeft,
  [shape="ol60"] #ControlLeft { margin-left:  3px; }
  [shape="ol60"] #KeyA        { margin-left: 64px; /* XXX why not 63px? */ }
  [shape="ol60"] #Digit6,
  [shape="ol60"] #KeyY,
  [shape="ol60"] #KeyH,
  [shape="ol60"] #KeyN        { margin-left:   63px; }
  [shape="ol60"] #Backspace   { margin-left: -396px; height: 86px; }
  [shape="ol60"] #Enter       { margin-left: -335px; height: 86px; }
  [shape="ol60"] #ShiftRight  { margin-left:   48px; }

  /* OLKB-specific (Preonic, Planck)*/

  [shape="ol50"],
  [shape="ol40"] { width: 590px; padding: 0 50px; }
  [shape="ol50"] #Escape,
  [shape="ol40"] #Escape { display: inline-block; }
  [shape="ol50"] #KeyA,
  [shape="ol40"] #KeyA { margin-left: 63px; }
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
  [shape="ol40"] #Backspace { margin: -90px 523px 0; }


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
      <key id="IntlYen"   finger="r5" class="pinkyKey"> </key>
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
      <key id="IntlRo"        finger="r5" class="letterKey"></key>
      <key id="ShiftRight"    finger="r5" class="specialKey"> <em></em> </key>
    </li>
    <li id="row_AA">
      <key id="ControlLeft"   finger="l5" class="specialKey"> <em></em> </key>
      <key id="MetaLeft"      finger="l1" class="specialKey"> <em></em> </key>
      <key id="AltLeft"       finger="l1" class="specialKey"> <em></em> </key>
      <key id="Space"         finger="m1" class="homeKey">    <em></em> </key>
      <key id="AltRight"      finger="r1" class="specialKey"> <em></em> </key>
      <key id="MetaRight"     finger="r1" class="specialKey"> <em></em> </key>
      <key id="ContextMenu"   finger="r1" class="specialKey"> <em></em> </key>
      <key id="ControlRight"  finger="r5" class="specialKey"> <em></em> </key>
    </li>
  </ul>
`;

const template = document.createElement('template');
template.innerHTML = `<style>${css}</style>${html}`;


/*******************************************************************************
 * Keyboard Layout
 */

const dkClass = (label) => isDeadKey(label) ? 'deadKey' : '';
const keyText = (label) => (label || '').slice(-1);

const drawKey = (element, keyMap) => {
  if (!keyMap || !keyMap[element.id]) {
    element.innerHTML = '';
    return;
  }
  /**
   * What key label should we display when the `base` and `shift` layers have
   * the lowercase and uppercase versions of the same letter?
   * Most of the time we want the uppercase letter, but there are tricky cases:
   *   - German:
   *      'ß'.toUpperCase() == 'SS'
   *      'ẞ'.toLowerCase() == 'ß'
   *   - Greek:
   *      'ς'.toUpperCase() == 'Σ'
   *      'σ'.toUpperCase() == 'Σ'
   *      'Σ'.toLowerCase() == 'σ'
   * So if the lowercase version of the `shift` layer does not match the `base`
   * layer, we'll show the lowercase letter (e.g. Greek 'ς').
   */
  const [ base, shift, alt ] = keyMap[element.id];
  const baseLabel  = base.toUpperCase() !== shift ? base : '';
  const shiftLabel = baseLabel || shift.toLowerCase() === base ? shift : base;
  element.innerHTML = `
    <strong class="${dkClass(shiftLabel)}">${keyText(shiftLabel)}</strong>
    <em     class="${dkClass(baseLabel)}">${keyText(baseLabel)}</em>
    <em     class="${dkClass(alt)} altgr">${keyText(alt)}</em>
    <em     class="dk"></em>
    <strong class="dk"></em>
  `;
};

const drawDK = (element, keyMap, deadKey) => {
  const key = keyMap[element.id];
  if (!key || element.classList.contains('specialKey')) {
    return;
  }
  const alt0 = deadKey[key[0]];
  const alt1 = deadKey[key[1]];
  /**
   * Rule of thumb: display the `alt1` key if its lowercase is not `alt0`.
   * Tricky case:
   *   'µ'.toUpperCase() == 'Μ' //        micro sign => capital letter MU
   *   'μ'.toUpperCase() == 'Μ' //   small letter MU => capital letter MU
   *   'Μ'.toLowerCase() == 'μ' // capital letter MU =>   small letter MU
   */
  if (alt0) {
    element.querySelector('em.dk').textContent = alt0;
    if (alt1 && alt0 !== alt1.toLowerCase()) {
      element.querySelector('strong.dk').textContent = alt1;
    }
  }
};

const setFingerAssignment = (root, ansiStyle) => {
  let i = 1;
  (ansiStyle ?
    [ 'l5', 'l4', 'l3', 'l2', 'l2', 'r2', 'r2', 'r3', 'r4', 'r5' ] :
    [ 'l5', 'l5', 'l4', 'l3', 'l2', 'l2', 'r2', 'r2', 'r3', 'r4' ])
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
      geometry: this.getAttribute('geometry') || '',
      platform: this.getAttribute('platform') || '',
      theme:    this.getAttribute('theme')    || '',
      layout:   newKeyboardLayout()
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
    this.root.getElementById('keyboard').setAttribute('theme', value);
  }

  get geometry() {
    return this._state.geometry;
  }

  set geometry(value) {
    const euroStyleShapes = { iso: 'iso102', abnt: 'iso104', jis: 'iso106' };
    const supportedShapes =
      [ 'ansi', 'iso', 'abnt', 'jis', 'alt', 'ol60', 'ol50', 'ol40' ];
    /**
     * Supported geometries (besides ANSI):
     * - Euro-style [Enter] key:
     *     ISO  = ANSI + IntlBackslash
     *     ABNT = ISO + IntlRo + NumpadComma
     *     JIS  = ISO + IntlRo + IntlYen - IntlBackslash
     *                + NonConvert + Convert + KanaMode
     * - Russian-style [Enter] key:
     *     ALT = ANSI - Backslash + IntlYen
     *     (KS = ALT + Lang1 + Lang2) TODO
     * - Ortholinear:
     *     OL60 = TypeMatrix 2030
     *     OL50 = OLKB Preonic
     *     OL40 = OLKB Planck
     */
    this._state.geometry = supportedShapes.indexOf(value) >= 0 ? value : '';
    const geometry = this._state.geometry || this.layout.geometry || 'ansi';
    this.root.getElementById('keyboard').setAttribute('shape',
      euroStyleShapes[geometry] || geometry);
    setFingerAssignment(this.root, !(geometry in euroStyleShapes));
  }

  get platform() {
    return this._state.platform;
  }

  set platform(value) {
    const platform = value.toLowerCase() || guessPlatform();
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
    this.geometry = this._state.geometry;
    Array.from(this.root.querySelectorAll('key'))
      .filter(key => !key.classList.contains('specialKey'))
      .forEach(key => drawKey(key, value.keyMap));
  }

  setKalamineLayout(keyMap, deadKeys, geometry) {
    this.layout = newKalamineLayout(keyMap, deadKeys, geometry);
  }

  setKeyboardLayout(keyMap, deadKeys, geometry) {
    this.layout = newKeyboardLayout(keyMap, deadKeys, geometry);
  }

  /**
   * KeyboardEvent helpers
   */

  keyDown(keyCode) {
    const code = keyCode.replace(/^OS/, 'Meta'); // https://bugzil.la/1264150
    if (!code) {
      return '';
    }
    const element = this.root.getElementById(code);
    if (!element) {
      return '';
    }
    element.style.cssText = defaultKeyPressStyle;
    const dk = this.layout.pendingDK;
    const rv = this.layout.keyDown(code);
    if (this.layout.modifiers.altgr) {
      this.root.getElementById('keyboard').classList.add('alt');
    }
    if (dk) { // a dead key has just been unlatched, hide all key hints
      if (!element.classList.contains('specialKey')) {
        this.root.getElementById('keyboard').classList.remove('dk')
        Array.from(this.root.querySelectorAll('.dk'))
          .forEach(span => span.textContent = '');
      }
    } else if (this.layout.pendingDK) { // show hints for this dead key
      Array.from(this.root.querySelectorAll('key'))
        .forEach(key => drawDK(key, this.layout.keyMap, this.layout.pendingDK));
      this.root.getElementById('keyboard').classList.add('dk');
    }
    return rv;
  }

  keyUp(keyCode) {
    const code = keyCode.replace(/^OS/, 'Meta'); // https://bugzil.la/1264150
    if (!code) {
      return '';
    }
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
    Array.from(this.root.querySelectorAll('key[style]'))
      .forEach(element => element.removeAttribute('style'));
  }

  showHint(key) {
    let hintClass = '';
    Array.from(this.root.querySelectorAll('key.hint'))
      .forEach(key => key.classList.remove('hint'));
    getKeyChord(this.root, key).forEach(key => {
      key.classList.add('hint');
      hintClass += key.getAttribute('finger') + ' ';
    });
    return hintClass;
  }

  showKey(key, cssText) {
    this.clearStyle();
    getKeyChord(this.root, key)
      .forEach(key => key.style.cssText = cssText || defaultKeyPressStyle);
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
