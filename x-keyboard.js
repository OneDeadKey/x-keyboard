/*******************************************************************************
 * Shadow DOM
 */

const css = `
  /**
   * graphical keyboard layout, fixed size (664*230px)
   */

  ul {
    margin: 0;
    padding: 0;
    width: 664px;
  }
  #keyboard {
    margin: 20px auto;
    position: relative;
    height: 230px;
  }


  /**************************************************************************
   * Default Keyboard Geometry (pc104)
   */

  /* rows */
  li {
    list-style-type: none;
    clear: both;
    margin: 0;
    padding: 0;
  }
  #row_AD {
    position: absolute;
    top: 46px;
  }
  #row_AC {
    position: absolute;
    top: 92px;
  }
  #row_AB {
    position: absolute;
    top: 138px;
  }
  #row_AA {
    position: absolute;
    top: 184px;
  }

  /* keys */
  li li {
    position: relative;
    float: left;
    clear: none;
    width: 40px;
    height: 40px;
    margin: 2px;
    border: 1px solid #aaa;
    border-radius: 5px;
  }
  li li * {
    font-weight: inherit;
    font-style: inherit;
    color: #333;
  }
  li strong {
    position: absolute;
    top: 2px;
    left: 3px;
  }
  li em {
    position: absolute;
    bottom: 2px;
    left: 3px;
  }
  li .dk,
  li .altgr {
    left: auto;
    right: 5px;
    color: blue;
    opacity: 0.5;
  }
  li .dk {
    color: red;
  }

  li .deadKey {
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
  #row_AA   .specialKey { width: 56px; }
  #row_AA    #key_MENU  { width: 40px; }
  #key_SPCE             { width: 240px;}
  #key_TAB,  #key_BKSP  { width: 60px; }
  #key_CAPS, #key_RTRN  { width: 73px; }
  #key_LFSH, #key_RTSH  { width: 96px; }

  #key_TAB *, #key_CAPS *, #key_LFSH *, #key_RTSH *, #key_RTRN * {
    font-size: 1.25em;
    font-style: normal;
  }
  #key_MENU *, #key_BKSP * {
    font-style: normal;
  }

  /* hide LSGT for pc104 (default) */
  #key_LSGT, #key_CAPS105, #key_RTRN105, #key_ESC {
    display: none;
  }


  /**************************************************************************
   * European Keyboard Geometry (pc105)
   */

  [shape="pc105"] #key_LFSH {
    width: 50px;
  }
  [shape="pc105"] #key_RTRN {
    width: 27px;
    height: 86px;
    margin-top: -44px;
    margin-left: 48px;
  }
  [shape="pc105"] #key_BKSL {
    margin-top: 48px;
    margin-left: -31px;
  }
  [shape="pc105"] #key_LSGT {
    display: block;
  }
  /* visual tweaks for CapsLock and Return */
  [shape="pc105"] #key_CAPS105,
  [shape="pc105"] #key_RTRN105 {
    background-color: #e8e8e8;
    display: block;
  }
  [shape="pc105"] #key_CAPS {
    width: 60px;
  }
  [shape="pc105"] #key_CAPS,
  [shape="pc105"] #key_RTRN {
    z-index: 1;
  }
  [shape="pc105"] #key_CAPS105 {
    margin-left: -64px;
    width: 73px;
  }
  [shape="pc105"] #key_RTRN105 {
    margin-top: -44px;
    margin-left: -44px;
    width: 40px;
  }


  /**************************************************************************
   * Ortholinear Keyboard Geometry (TMx, OLKB)
   */

  [shape="tmx"] #key_CAPS, [shape="olkb"] #key_CAPS {
    display: none;
  }
  [shape="tmx"] #key_BKSL, [shape="olkb"] #key_BKSL {
    margin-top: 94px;
    margin-left: -96px;
  }
  [shape="tmx"] #key_TLDE, [shape="olkb"] #key_TLDE,
  [shape="tmx"] #key_TAB,  [shape="olkb"] #key_TAB,
  [shape="tmx"] #key_LFSH, [shape="olkb"] #key_LFSH,
  [shape="tmx"] #key_LCTL, [shape="olkb"] #key_LCTL,
  [shape="tmx"] #key_AE12, [shape="olkb"] #key_AE12,
  [shape="tmx"] #key_AD12, [shape="olkb"] #key_AD12,
  [shape="tmx"] #key_RTSH, [shape="olkb"] #key_RTSH,
  [shape="tmx"] #key_RCTL, [shape="olkb"] #key_RCTL,
  [shape="tmx"] #key_BKSP, [shape="olkb"] #key_BKSP,
  [shape="tmx"] #key_RTRN, [shape="olkb"] #key_RTRN {
    width: 46px;
  }
  [shape="tmx"] #key_LWIN, [shape="olkb"] #key_LWIN,
  [shape="tmx"] #key_LALT, [shape="olkb"] #key_LALT,
  [shape="tmx"] #key_RWIN, [shape="olkb"] #key_RWIN,
  [shape="tmx"] #key_RALT, [shape="olkb"] #key_RALT {
    width: 63px;
  }
  [shape="tmx"] #key_TLDE,
  [shape="tmx"] #key_TAB,
  [shape="tmx"] #key_LFSH,
  [shape="tmx"] #key_LCTL {
    margin-left: 3px;
  }
  [shape="tmx"] #key_AC01 {
    margin-left: 55px; /* XXX why 55px instead of 54px? */
  }
  [shape="tmx"] #key_AE06,
  [shape="tmx"] #key_AD06,
  [shape="tmx"] #key_AC06,
  [shape="tmx"] #key_AB06 {
    margin-left: 54px;
  }
  [shape="tmx"] #key_BKSP {
    margin-left: -378px;
    height: 86px;
  }
  [shape="tmx"] #key_RTRN {
    margin-left: -326px;
    height: 86px;
  }
  [shape="tmx"] #key_LFSH, [shape="olkb"] #key_LFSH,
  [shape="tmx"] #key_RTSH, [shape="olkb"] #key_RTSH {
    height: 86px;
    margin-top: -44px;
  }
  [shape="tmx"] #key_RTSH {
    margin-left: 48px;
  }
  [shape="tmx"] #key_SPCE {
    width: 230px;
  }

  /* OLKB-specific */
  [shape="olkb"] .pinkyKey,
  [shape="olkb"] #key_MENU { display: none; }
  [shape="olkb"] #key_ESC  { display: inline-block; width: 46px; }
  [shape="olkb"] #key_SPCE { width: 178px; }
  [shape="olkb"] #key_RTRN { margin-top: -44px; }
  [shape="olkb"] #key_AC01 { margin-left: 54px; }
  [shape="olkb"] { padding-left: 100px; }


  /**************************************************************************
   * color theme
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
      <ul>
        <li id="key_ESC"  class="specialKey">
          <em> Esc </em>
        </li>
        <li id="key_TLDE" finger="l5" class="pinkyKey"> </li>
        <li id="key_AE01" finger="l5" class="numberKey"></li>
        <li id="key_AE02" finger="l4" class="numberKey"></li>
        <li id="key_AE03" finger="l3" class="numberKey"></li>
        <li id="key_AE04" finger="l2" class="numberKey"></li>
        <li id="key_AE05" finger="l2" class="numberKey"></li>
        <li id="key_AE06" finger="r2" class="numberKey"></li>
        <li id="key_AE07" finger="r2" class="numberKey"></li>
        <li id="key_AE08" finger="r3" class="numberKey"></li>
        <li id="key_AE09" finger="r4" class="numberKey"></li>
        <li id="key_AE10" finger="r5" class="numberKey"></li>
        <li id="key_AE11" finger="r5" class="pinkyKey"> </li>
        <li id="key_AE12" finger="r5" class="pinkyKey"> </li>
        <li id="key_BKSP" class="specialKey">
          <em> &#x232b; </em>
        </li>
      </ul>
    </li>
    <li id="row_AD">
      <ul>
        <li id="key_TAB" class="specialKey">
          <em> &#x21b9; </em>
        </li>
        <li id="key_AD01" finger="l5" class="letterKey"></li>
        <li id="key_AD02" finger="l4" class="letterKey"></li>
        <li id="key_AD03" finger="l3" class="letterKey"></li>
        <li id="key_AD04" finger="l2" class="letterKey"></li>
        <li id="key_AD05" finger="l2" class="letterKey"></li>
        <li id="key_AD06" finger="r2" class="letterKey"></li>
        <li id="key_AD07" finger="r2" class="letterKey"></li>
        <li id="key_AD08" finger="r3" class="letterKey"></li>
        <li id="key_AD09" finger="r4" class="letterKey"></li>
        <li id="key_AD10" finger="r5" class="letterKey"></li>
        <li id="key_AD11" finger="r5" class="pinkyKey"> </li>
        <li id="key_AD12" finger="r5" class="pinkyKey"> </li>
        <li id="key_BKSL" finger="r5" class="pinkyKey"> </li>
      </ul>
    </li>
    <li id="row_AC">
      <ul>
        <li id="key_CAPS" class="specialKey">
          <em> &#x21ea; </em>
        </li>
        <li id="key_CAPS105" class="specialKey hiddenKey">
          &nbsp;
        </li>
        <li id="key_AC01" finger="l5" class="letterKey homeKey"></li>
        <li id="key_AC02" finger="l4" class="letterKey homeKey"></li>
        <li id="key_AC03" finger="l3" class="letterKey homeKey"></li>
        <li id="key_AC04" finger="l2" class="letterKey homeKey"></li>
        <li id="key_AC05" finger="l2" class="letterKey"> </li>
        <li id="key_AC06" finger="r2" class="letterKey"> </li>
        <li id="key_AC07" finger="r2" class="letterKey homeKey"></li>
        <li id="key_AC08" finger="r3" class="letterKey homeKey"></li>
        <li id="key_AC09" finger="r4" class="letterKey homeKey"></li>
        <li id="key_AC10" finger="r5" class="letterKey homeKey"></li>
        <li id="key_AC11" finger="r5" class="pinkyKey"> </li>
        <li id="key_RTRN" class="specialKey">
          <em> &#x23ce; </em>
        </li>
        <li id="key_RTRN105" class="specialKey hiddenKey">
          &nbsp;
        </li>
      </ul>
    </li>
    <li id="row_AB">
      <ul>
        <li id="key_LFSH" finger="l5" class="specialKey">
          <em> &#x21e7; </em>
        </li>
        <li id="key_LSGT" finger="l5" class="pinkyKey"> </li>
        <li id="key_AB01" finger="l5" class="letterKey"></li>
        <li id="key_AB02" finger="l4" class="letterKey"></li>
        <li id="key_AB03" finger="l3" class="letterKey"></li>
        <li id="key_AB04" finger="l2" class="letterKey"></li>
        <li id="key_AB05" finger="l2" class="letterKey"></li>
        <li id="key_AB06" finger="r2" class="letterKey"></li>
        <li id="key_AB07" finger="r2" class="letterKey"></li>
        <li id="key_AB08" finger="r3" class="letterKey"></li>
        <li id="key_AB09" finger="r4" class="letterKey"></li>
        <li id="key_AB10" finger="r5" class="letterKey"></li>
        <li id="key_RTSH" finger="r5" class="specialKey">
          <em> &#x21e7; </em>
        </li>
      </ul>
    </li>
    <li id="row_AA">
      <ul>
        <li id="key_LCTL" class="specialKey">
          <em> Ctrl </em>
        </li>
        <li id="key_LWIN" class="specialKey">
          <em> Super </em>
        </li>
        <li id="key_LALT" class="specialKey">
          <em> Alt </em>
        </li>
        <li id="key_SPCE" finger="m1" class="homeKey">
          <em> </em>
        </li>
        <li id="key_RALT" class="specialKey">
          <em> AltGr </em>
        </li>
        <li id="key_RWIN" class="specialKey">
          <em> Super </em>
        </li>
        <li id="key_MENU" class="specialKey">
          <!-- not really a 'menu' character, but looks like one -->
          <em> ☰ </em>
        </li>
        <li id="key_RCTL" class="specialKey">
          <em> Ctrl </em>
        </li>
      </ul>
    </li>
  </ul>
`;

const template = document.createElement('template');
template.innerHTML = `<style>${css}</style>${html}`;


/*******************************************************************************
 * Keyboard Map
 */

const keyNames = {
  'Space':        'SPCE',
  // numbers
  'Digit1':       'AE01',
  'Digit2':       'AE02',
  'Digit3':       'AE03',
  'Digit4':       'AE04',
  'Digit5':       'AE05',
  'Digit6':       'AE06',
  'Digit7':       'AE07',
  'Digit8':       'AE08',
  'Digit9':       'AE09',
  'Digit0':       'AE10',
  // letters, 1st row
  'KeyQ':         'AD01',
  'KeyW':         'AD02',
  'KeyE':         'AD03',
  'KeyR':         'AD04',
  'KeyT':         'AD05',
  'KeyY':         'AD06',
  'KeyU':         'AD07',
  'KeyI':         'AD08',
  'KeyO':         'AD09',
  'KeyP':         'AD10',
  // letters, 2nd row
  'KeyA':         'AC01',
  'KeyS':         'AC02',
  'KeyD':         'AC03',
  'KeyF':         'AC04',
  'KeyG':         'AC05',
  'KeyH':         'AC06',
  'KeyJ':         'AC07',
  'KeyK':         'AC08',
  'KeyL':         'AC09',
  'Semicolon':    'AC10',
  // letters, 3rd row
  'KeyZ':         'AB01',
  'KeyX':         'AB02',
  'KeyC':         'AB03',
  'KeyV':         'AB04',
  'KeyB':         'AB05',
  'KeyN':         'AB06',
  'KeyM':         'AB07',
  'Comma':        'AB08',
  'Period':       'AB09',
  'Slash':        'AB10',
  // pinky keys
  'Backquote':    'TLDE',
  'Minus':        'AE11',
  'Equal':        'AE12',
  'BracketLeft':  'AD11',
  'BracketRight': 'AD12',
  'Backslash':    'BKSL',
  'Quote':        'AC11',
  'IntlBackslash':'LSGT',
  // special keys
  'Tab':          'TAB',
  'Enter':        'RTRN',
  'Backspace':    'BKSP',
  'ShiftLeft':    'LFSH',
  'ShiftRight':   'RTSH',
  'AltLeft':      'LALT',
  'AltRight':     'RALT',
  'ControlLeft':  'LCTL',
  'ControlRight': 'RCTL',
  'OSLeft':       'LWIN',
  'OSRight':      'RWIN',
  'ContextMenu':  'MENU',
  'CapsLock':     'CAPS',
  'Escape':       'ESC',
};

function getKey(root, keyCode) {
  const name = keyCode in keyNames ? keyNames[keyCode] : keyCode;
  return root.getElementById('key_' + name);
}

function getKeys(root, str, keymap, keymod) {
  let rv = [];
  if (str) {
    for (let char of str) {
      if (char in keymap) {
        rv.push(keymap[char]);
      }
      if (char in keymod) {
        rv.push(keymod[char]);
      }
    }
  }
  return rv;
}

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
      shape: this.getAttribute('shape') || 'pc104',
      theme: this.getAttribute('theme') || '',
      activeKey: null,
      activeMod: null,
      hintedKeys: [],
      styledKeys: [],
      keymap: {},
      keymod: {},
      layout: {},
      deadKeys: [],
      modifiers: {}
    };
    this.shape = this._state.shape;
    this.theme = this._state.theme;
  }

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
    const setFinger = (id, finger) => {
      this.root.getElementById(id).setAttribute('finger', finger);
    };
    switch (value.toLowerCase()) {
      case 'pc105':
        setFinger('key_AE01', 'l5');
        setFinger('key_AE02', 'l5');
        setFinger('key_AE03', 'l4');
        setFinger('key_AE04', 'l3');
        setFinger('key_AE05', 'l2');
        setFinger('key_AE06', 'l2');
        setFinger('key_AE07', 'r2');
        setFinger('key_AE08', 'r2');
        setFinger('key_AE09', 'r3');
        setFinger('key_AE10', 'r4');
        break;
      case 'pc104':
      case 'tmx':
      case 'olkb':
        setFinger('key_AE01', 'l5');
        setFinger('key_AE02', 'l4');
        setFinger('key_AE03', 'l3');
        setFinger('key_AE04', 'l2');
        setFinger('key_AE05', 'l2');
        setFinger('key_AE06', 'r2');
        setFinger('key_AE07', 'r2');
        setFinger('key_AE08', 'r3');
        setFinger('key_AE09', 'r4');
        setFinger('key_AE10', 'r5');
        break;
      default:
        return;
    }
    this._state.shape = value.toLowerCase();
    this.root.getElementById('keyboard').setAttribute('shape', value);
  }

  get layout() {
    return this._state.layout;
  }

  set layout(value) {
    this._state.layout = value;
    this._state.keymap = {};
    this._state.keymod = {};
    const createLabel = (type, label, className) => {
      let element = document.createElement(type);
      if (label && label.length > 1 && label[0] === '*') {
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
    Array.from(this.root.querySelectorAll('li li'))
      .filter(key => !key.classList.contains('specialKey'))
      .forEach(key => {
        const [ base, shift, alt ] = value[key.id.slice(4)] || [''];
        key.innerHTML = '';
        key.appendChild(createLabel('strong', shift));
        if (base.toUpperCase() !== shift) {
          key.appendChild(createLabel('em', base));
        }
        key.appendChild(createLabel('em', alt, 'altgr'));
        key.appendChild(createLabel('em', '', 'dk'));
        key.appendChild(createLabel('strong', '', 'dk'));

        // store current key in the main hash tables
        this._state.keymap[base] = key;
        this._state.keymap[shift] = key;
        if (base != shift) {
          this._state.keymod[shift] = getKey(this.root,
            key.getAttribute('finger')[0] == 'l' ? 'RTSH' : 'LFSH');
        }
        if (alt) {
          this._state.keymap[alt] = key;
          this._state.keymod[alt] = getKey(this.root, 'RALT');
        }
      });
  }

  get deadKeys() {
    return this._state.deadKeys;
  }

  set deadKeys(value) {
    this._state.deadKeys = value;
  }

  setKeyStyle(keyName, style) {
    const element = getKey(this.root, keyName);
    if (element) {
      element.style.cssText = style;
    }
  }

  clearStyle() {
    Array.from(this.root.querySelectorAll('li[style]')).forEach(element => {
      element.style.cssText = '';
    });
  }

  keyDown(keyCode) {
    const element = getKey(this.root, keyCode);
    if (!element) {
      return '';
    }
    element.style.cssText = defaultKeyPressStyle;
    switch(keyCode) {
      case 'AltRight':
      case 'RALT':
        this._state.modifiers.AltGr = true;
        this.root.getElementById('keyboard').classList.add('alt');
        break;
      case 'ShiftLeft':
      case 'LFSH':
        this._state.modifiers.ShiftLeft = true;
        break;
      case 'ShiftRight':
      case 'RTSH':
        this._state.modifiers.ShiftRight = true;
        break;
    }

    const key = this._state.layout[element.id.slice(4)];
    if (!key) {
      return '';
    }
    const m = this._state.modifiers;
    const level = (m.AltGr ? 2 : 0) + (m.ShiftLeft || m.ShiftRight ? 1 : 0);
    const value = key[level];
    if (value && value.length === 2 && value[0] === '*') { // dead key
      this.latchDeadKey(value);
      return '';
    } else if (this._state.modifiers.DeadKey) {
      return this.unlatchDeadKey(value);
    } else {
      return value || '';
    }
  }

  keyUp(keyCode) {
    const element = getKey(this.root, keyCode);
    if (!element) {
      return;
    }
    element.style.cssText = '';
    switch(keyCode) {
      case 'AltRight':
      case 'RALT':
        this._state.modifiers.AltGr = false;
        this.root.getElementById('keyboard').classList.remove('alt');
        break;
      case 'ShiftLeft':
      case 'LFSH':
        this._state.modifiers.ShiftLeft = false;
        break;
      case 'ShiftRight':
      case 'RTSH':
        this._state.modifiers.ShiftRight = false;
        break;
    }
  }

  latchDeadKey(dkID) {
    const dk = this._state.deadKeys.find(i => i.char === dkID);
    if (!dk) {
      return;
    }
    Array.from(this.root.querySelectorAll('li li')).forEach(element => {
      // display dead keys in the virtual keyboard
      const key = this._state.layout[element.id.slice(4)];
      if (!key || element.classList.contains('specialKey')) {
        return;
      }
      const alt0 = dk.alt[dk.base.indexOf(key[0])];
      const alt1 = dk.alt[dk.base.indexOf(key[1])];
      if (alt0) {
        element.querySelector('em.dk').textContent = alt0;
      }
      // if (alt1 && alt0.toUpperCase() !== alt1) { // better
      if (alt1 && key[0].toUpperCase() !== key[1]) { // nicer, lighter
        element.querySelector('strong.dk').textContent = alt1;
      }
    });
    this.root.getElementById('keyboard').classList.add('dk');
    this._state.modifiers.DeadKey = dk;
  }

  unlatchDeadKey(baseChar) {
    const dk = this._state.modifiers.DeadKey;
    this._state.modifiers.DeadKey = undefined;
    this.root.getElementById('keyboard').classList.remove('dk')
    Array.from(this.root.querySelectorAll('.dk'))
      .forEach(span => span.textContent = '');
    return dk.alt[dk.base.indexOf(baseChar)] || baseChar;
  }

  showHint(char) {
    let hintClass = '';
    this._state.hintedKeys.forEach(li => li.classList.remove('hint'));
    this._state.hintedKeys =
      getKeys(this.root, char[0], this._state.keymap, this._state.keymod);
    this._state.hintedKeys.forEach(li => {
      li.classList.add('hint');
      hintClass += li.getAttribute('finger') + ' ';
      // hintBox.classList.add(li.getAttribute('finger'));
    });
    return hintClass;
  }

  showKeys(chars, cssText) {
    this._state.styledKeys.forEach(li => li.style.cssText = '');
    this._state.styledKeys =
      getKeys(this.root, chars, this._state.keymap, this._state.keymod);
    this._state.styledKeys.forEach(li => {
      li.style.cssText = cssText || defaultKeyPressStyle;
    });
  }

  typeKeys(str, style, duration) {
    function *pressKeys(str) {
      for (let char of str) {
        yield char;
      }
    }
    let it = pressKeys(str);
    const send = setInterval(() => {
      const { value, done } = it.next();
      if (done) {
        clearInterval(send);
        this.showKeys();
      } else {
        this.showKeys(value, style || defaultKeyPressStyle);
        // setTimeout(this.showKeys, duration - 50);
      }
    }, duration || defaultKeyPressDuration);
  }

}

customElements.define('x-keyboard', Keyboard);
