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
    border: 1px solid black;
    border-radius: 5px;
  }
  li li * {
    font-weight: inherit;
  }
  li strong {
    position: absolute;
    top: 2px;
    left: 3px;
  }
  li em {
    position: absolute;
    font-style: normal;
    bottom: 2px;
    left: 3px;
  }
  li em.altgr {
    left: auto;
    right: 5px;
    color: blue;
    opacity: 0.5;
  }

  li .deadKey {
    font-size: larger;
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
  #row_AA    #key_SPCE  { width: 240px;}
  #row_AA    #key_MENU  { width: 40px; }
  #key_TAB,  #key_BKSP  { width: 60px; }
  #key_CAPS, #key_RTRN  { width: 73px; }
  #key_LFSH, #key_RTSH  { width: 96px; }

  /* hide LSGT for pc104 (default) */
  #key_LSGT, #key_CAPS105, #key_RTRN105 {
    display: none;
  }


  /**************************************************************************
   * European Keyboard Geometry (pc105)
   */

  [shape="pc105"] #key_LFSH {
    width: 50px !important;
  }
  [shape="pc105"] #key_RTRN {
    width: 27px !important;
    height: 86px !important;
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
    background-color: #e8e8e8 !important;
    display: block;
  }
  [shape="pc105"] #key_CAPS {
    width: 60px !important;
  }
  [shape="pc105"] #key_CAPS,
  [shape="pc105"] #key_RTRN {
    z-index: 1;
  }
  [shape="pc105"] #key_CAPS105 {
    margin-left: -64px;
    width: 73px !important;
  }
  [shape="pc105"] #key_RTRN105 {
    margin-top: -44px;
    margin-left: -44px;
    width: 40px !important;
  }


  /**************************************************************************
   * Ergonomic Keyboard Geometry (TMx)
   */

  [shape="tmx"] #key_CAPS {
    display: none;
  }
  [shape="tmx"] #key_BKSL {
    margin-top: 94px;
    margin-left: -96px;
  }
  [shape="tmx"] #key_TLDE,
  [shape="tmx"] #key_TAB,
  [shape="tmx"] #key_LFSH,
  [shape="tmx"] #key_LCTL,
  [shape="tmx"] #key_AE12,
  [shape="tmx"] #key_AD12,
  [shape="tmx"] #key_RTSH,
  [shape="tmx"] #key_RCTL,
  [shape="tmx"] #key_BKSP,
  [shape="tmx"] #key_RTRN {
    width: 46px !important;
  }
  [shape="tmx"] #key_LWIN,
  [shape="tmx"] #key_LALT,
  [shape="tmx"] #key_RWIN,
  [shape="tmx"] #key_RALT {
    width: 63px !important;
  }
  [shape="tmx"] #key_TLDE,
  [shape="tmx"] #key_TAB,
  [shape="tmx"] #key_LFSH,
  [shape="tmx"] #key_LCTL {
    margin-left: 3px;
  }
  [shape="tmx"] #key_AC01 {
    margin-left: 55px;
  }
  [shape="tmx"] #key_AE06,
  [shape="tmx"] #key_AD06,
  [shape="tmx"] #key_AC06,
  [shape="tmx"] #key_AB06 {
    margin-left: 54px;
  }
  [shape="tmx"] #key_BKSP {
    margin-left: -378px;
    height: 86px !important;
  }
  [shape="tmx"] #key_RTRN {
    margin-left: -326px;
    height: 86px !important;
  }
  [shape="tmx"] #key_LFSH,
  [shape="tmx"] #key_RTSH {
    height: 86px !important;
    margin-top: -44px;
  }
  [shape="tmx"] #key_RTSH {
    margin-left: 48px;
  }
  [shape="tmx"] #key_SPCE {
    width: 230px !important;
  }


  /**************************************************************************
   * background images for tab, backspace, caps, return, shift
   */

  #key_TAB *, #key_BKSP *, #key_CAPS *, #key_LFSH *, #key_RTSH *, #key_RTRN * {
    display: none;
  }
  .specialKey {
    background-repeat: no-repeat;
    background-position: bottom left;
  }
  #key_LFSH,
  #key_RTSH { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAJtJREFUSMft1DsKwlAURdFFVCwFiR+srKytBBGsrZ2cIIqtn8IpOAwrCwfgGGxSiJ8QSVIE3i7vhX3gPO4jUDWaiMqSD3DGDo2i5X2cEGOCLepFybuJvPMym2KDWl55jCN6X3YzrPOEtHFI6vnFHKu0h0/rcYEh9nhg+ba/4Y4WRrjmqeqScfZBVPbhhIAQUIGArD/iOOthBf7mCZ5YD89+RmHHAAAAAElFTkSuQmCC); }
  #key_CAPS { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAKJJREFUSMft1D0OQVEQhuGH3F5ySj+NQqGyBEKhtjVswV8swhKUKoUFiFqlveG6Dq5Ecd9y5pv5kjNnhpKSFAFbTFH9RfMNWhhhVqRJwBrNVGxYlEnACo2M3ADzb0wClqjnaPqvTJKc4jHaWOCMyV3+iBNq6ODwzVPtImMPVH/9t0uDlySRum7GUK9/ccAqkboL9k8WrRA+3oPYGfRiG5a8zQ3m7RUULlEIcgAAAABJRU5ErkJggg==); }
  #key_BKSP { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAINJREFUSMft1CEKAmEQxfGfGo1iE5NexDO4N5AtFk9g2kts9iImsZm9w4YFq6DlSxZd+L4i84dJM7wHw5shCILJl/4Wa9xLmFd4YFFCvMYTx9zCM5zwwvmHFQ5iii6JZ6vRh8kKLTa4YJcGszJGk4T3JSN8QI95qTu4piQtcYuXEfwxb1YgJTc9FfcXAAAAAElFTkSuQmCC); }
  #key_RTRN { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAItJREFUSMft1LEJAkEUhOEPg8NYLODCC21AOExsweySK8E+LERDQ6u4TkwMBNFkQz1h5SHi/vCyZWaHN7sUCt9mi1mkwR3N2IFJdMT/MqhRRRksccItIuUKZ3Q5LRpjjl269T63pq9ocEkC7yY7wQLHJHJIQs+m+nQHPa5YR9Z5gyH6zbSYlv/993gAlcMa2ChJWeEAAAAASUVORK5CYII=); }
  #key_TAB  { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAO9JREFUSMft0zFKQ0EQBuDPxEiaEATBRg2CSAI2ginFC2iRIuANPICtnY0HsMghLO0tcopYiNop0UZEYmOaLcLjSfY9XkiR/DAsO7v8PzP/DEssHMq4Qi2RP8FREQJV/GFrItfEB3ZnIdDGG27zEq6kCPzgEOe4xBCn+I7ge8JvTAWv4cwazdgW7aCL59CiRlFTlPSghnv08xKWprx/oYMRziZE11P+7qFSRJX7wcyNRD7Vg1IOgUc8hNie1cbXMcAnLrCWdYqyxst/AquJ+witiAoquAvG9nATdqcwXIcNP55mch5s4h0HMVO0xPwxBoeeRFZ6Q7hTAAAAAElFTkSuQmCC); }


  /**************************************************************************
   * color theme
   */

  [theme="reach"] .pinkyKey  { background-color: #fbb; }
  [theme="reach"] .numberKey { background-color: #fe7; }
  [theme="reach"] .letterKey { background-color: #bfb; }
  [theme="reach"] .homeKey   { background-color: #8e8; }

  [theme="hints"] [finger="l2"] { background-color: #db0; }
  [theme="hints"] [finger="r2"] { background-color: #ee0; }
  [theme="hints"] [finger="l3"],
  [theme="hints"] [finger="r3"] { background-color: #ac0; }
  [theme="hints"] [finger="l4"],
  [theme="hints"] [finger="r4"] { background-color: #3bb; }
  [theme="hints"] [finger="l5"],
  [theme="hints"] [finger="r5"] { background-color: #88f; }

  /*
  [theme="hints"] .homeKey {
    background-image: url(images/grid4.gif);
    font-weight: bold;
    color: white;
  }
  */
  [theme="hints"] .hint {
    font-weight: bold;
    background-color: brown;
    color: white;
  }
`;

const html = `
  <ul id="keyboard">
    <li id="row_AE">
      <ul>
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
          <em> &#x2190; </em>
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
          <em> &#x21b2; </em>
        </li>
        <li id="key_RTRN105" class="specialKey hiddenKey">
          &nbsp;
        </li>
      </ul>
    </li>
    <li id="row_AB">
      <ul>
        <li id="key_LFSH" class="specialKey">
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
        <li id="key_RTSH" class="specialKey">
          <em> &#x21e7; </em>
        </li>
      </ul>
    </li>
    <li id="row_AA">
      <ul>
        <li id="key_LCTL" class="specialKey">
          <em> ctrl </em>
        </li>
        <li id="key_LWIN" class="specialKey">
          <em> super </em>
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
          <em> super </em>
        </li>
        <li id="key_MENU" class="specialKey">
          <em> menu </em>
        </li>
        <li id="key_RCTL" class="specialKey">
          <em> ctrl </em>
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
  'Lesser':       'LSGT', // XXX check me!
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
  'Esc':          'ESC', // XXX check me!
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
    Array.from(this.root.querySelectorAll('li li'))
      .filter(key => !key.classList.contains('specialKey'))
      .forEach(key => {
        const [ base, shift, alt ] = value[key.id.slice(4)] || [''];
        key.innerHTML = `
          <strong>${shift || ''}</strong>
          <em>${base.toUpperCase() !== shift ? base : ''}</em>
          <em class="altgr">${alt || ''}</em>
        `;
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

  setKey(keyName, base, shift, altgr) {
    let element = getKey(this.root, keyName);
    if (!element) {
      return null;
    }

    // fill <li> element
    element.innerHTML = '';
    // create <strong> for 'shift'
    let strong = document.createElement('strong');
    strong.appendChild(document.createTextNode(shift));
    element.appendChild(strong);
    // append <em> for 'base' if necessary (not a letter)
    if (shift.toLowerCase() != base) {
      let em = document.createElement('em');
      em.appendChild(document.createTextNode(base));
      element.appendChild(em);
    }
    // append <em class="altgr"> if necessary
    if (altgr) {
      let em = document.createElement('em');
      em.className = 'altgr';
      em.appendChild(document.createTextNode(altgr));
      element.appendChild(em);
      this._state.keymap[altgr] = element;
      this._state.keymod[altgr] = getKey(this.root, 'RALT');
    }

    // store current key in the main hash table
    this._state.keymap[base] = element;
    this._state.keymap[shift] = element;
    if (base != shift) {
      this._state.keymod[shift] = getKey(this.root,
        element.getAttribute('finger')[0] == 'l' ? 'RTSH' : 'LFSH');
    }

    return element;
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

  showHint(char) {
    let hintClass = '';
    this._state.hintedKeys.forEach(li => li.classList.remove('hint'));
    this._state.hintedKeys =
      getKeys(this.root, char[0], this._state.keymap, this._state.keymod);
    this._state.hintedKeys.forEach(li => {
      li.classList.add('hint');
      hintClass += `.${li.getAttribute('finger')} `;
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
