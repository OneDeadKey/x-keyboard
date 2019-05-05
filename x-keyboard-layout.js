// dead keys are identified with a `*` prefix + the diacritic sign
export function isDeadKey(value) {
  return value && value.length === 2 && value[0] === '*';
}

/**
 * Parse Kalamine data:
 * these layouts are designed to create keyboard drivers but are not opmitized
 * for our use case. Here's what we need:
 *
 *   keyMap: {
 *     'KeyQ': [ 'q', 'Q' ],
 *     'KeyP': [ 'p', 'P' ],
 *     'Quote': [ '*´', '*¨' ], // dead keys (acute, diaeresis)
 *     ...
 *   }
 *
 *   deadKeys: {
 *     '*´': { 'a': 'á', 'A': 'Á', ...  },
 *     '*¨': { 'a': 'ä', 'A': 'Ä', ...  },
 *     ...
 *   }
 */

// map XKB names to DOM/KeyboardEvent names
const KEYNAMES = {
  SPCE: 'Space',
  // numbers
  AE01: 'Digit1',
  AE02: 'Digit2',
  AE03: 'Digit3',
  AE04: 'Digit4',
  AE05: 'Digit5',
  AE06: 'Digit6',
  AE07: 'Digit7',
  AE08: 'Digit8',
  AE09: 'Digit9',
  AE10: 'Digit0',
  // letters: 1st row
  AD01: 'KeyQ',
  AD02: 'KeyW',
  AD03: 'KeyE',
  AD04: 'KeyR',
  AD05: 'KeyT',
  AD06: 'KeyY',
  AD07: 'KeyU',
  AD08: 'KeyI',
  AD09: 'KeyO',
  AD10: 'KeyP',
  // letters: 2nd row
  AC01: 'KeyA',
  AC02: 'KeyS',
  AC03: 'KeyD',
  AC04: 'KeyF',
  AC05: 'KeyG',
  AC06: 'KeyH',
  AC07: 'KeyJ',
  AC08: 'KeyK',
  AC09: 'KeyL',
  AC10: 'Semicolon',
  // letters: 3rd row
  AB01: 'KeyZ',
  AB02: 'KeyX',
  AB03: 'KeyC',
  AB04: 'KeyV',
  AB05: 'KeyB',
  AB06: 'KeyN',
  AB07: 'KeyM',
  AB08: 'Comma',
  AB09: 'Period',
  AB10: 'Slash',
  // pinky keys
  TLDE: 'Backquote',
  AE11: 'Minus',
  AE12: 'Equal',
  AE13: 'IntlYen',
  AD11: 'BracketLeft',
  AD12: 'BracketRight',
  BKSL: 'Backslash',
  AC11: 'Quote',
  AB11: 'IntlRo',
  LSGT: 'IntlBackslash',
};

// turn Kalamine IDs (xkb) into DOM IDs
function parseKalamineLayout(keyMap) {
  const rv = {};
  Object.entries(keyMap).forEach(([ id, value ]) => {
    rv[KEYNAMES[id]] = value;
  });
  rv.IntlBackslash = rv.IntlBackslash || rv.Backslash;
  rv.IntlYen       = rv.IntlYen       || rv.Backslash;
  return rv;
}

// return true if the Kalamine deadKey object has all expected properties
function checkKalamineDeadKey(key) {
  return isDeadKey(key.char) && key.alt_self && key.alt_space && key.name
    && key.base && key.base.length && key.alt && key.alt.length
    && key.base.length === key.alt.length;
}

// parse Kalamine dead keys, return a easier-to-use dictionary
function parseKalamineDeadKeys(deadKeys) {
  const rv = {};
  // sorting the dead key array ensures '1dk' comes up first
  deadKeys.filter(checkKalamineDeadKey).sort((a, b) => a.name > b.name)
    .forEach((dk) => {
      const deadKey = {};
      Array.from(dk.base).forEach((base, i) => {
        deadKey[base] = dk.alt[i];
      });
      deadKey['\u0020'] = dk.alt_space;
      deadKey['\u00a0'] = dk.alt_space;
      deadKey['\u202f'] = dk.alt_space;
      deadKey[dk.char] = dk.alt_self;
      rv[dk.char] = deadKey;
    });
  return rv;
}


/**
 * Keyboard hints:
 * suggest the most efficient way to type a character or a string.
 */

// return the list of all keys that can output the requested char
function getKeyList(keyMap, char) {
  const rv = [];
  Object.entries(keyMap).forEach(([ keyID, value ]) => {
    const level = value.indexOf(char);
    if (level >= 0) {
      rv.push({ id: keyID, level });
    }
  });
  return rv.sort((a, b) => a.level > b.level);
}

// return a dictionary of all characters that can be done with a dead key
function getDeadKeyDict(deadKeys) {
  const dict = {};
  Object.entries(deadKeys).forEach(([ id, dkObj ]) => {
    Object.entries(dkObj).forEach(([ base, alt ]) => {
      if (!(alt in dict)) {
        dict[alt] = [];
      }
      dict[alt].push({ id, base });
    });
  });
  return dict;
}

// return a sequence of keys that can output the requested string
function getKeySequence(keyMap, dkDict, str) {
  const rv = [];
  Array.from(str || '').forEach((char) => {
    const keys = getKeyList(keyMap, char);
    if (keys.length) { // direct access (possibly with Shift / AltGr)
      rv.push(keys[0]);
    } else if (char in dkDict) { // available with a dead key
      const dk = dkDict[char][0];
      rv.push(getKeyList(keyMap, dk.id)[0]);
      rv.push(getKeyList(keyMap, dk.base)[0]);
    } else { // not available
      rv.push({});
      console.error('char not found:', char); // eslint-disable-line
    }
  });
  return rv;
}


/**
 * Modifiers
 */

const MODIFIERS = {
  ShiftLeft:    false,
  ShiftRight:   false,
  ControlLeft:  false,
  ControlRight: false,
  AltLeft:      false,
  AltRight:     false,
  OSLeft:       false,
  OSRight:      false,
};

function getShiftState(modifiers) {
  return modifiers.ShiftRight || modifiers.ShiftLeft;
}

function getAltGrState(modifiers, platform) {
  if (platform === 'win') {
    return modifiers.AltRight || (modifiers.ControlLeft && modifiers.AltLeft);
  }
  if (platform === 'mac') {
    return modifiers.AltRight || modifiers.AltLeft;
  }
  return modifiers.AltRight;
}

function getModifierLevel(modifiers, platform) {
  return (getShiftState(modifiers) ? 1 : 0)
    + (getAltGrState(modifiers, platform) ? 2 : 0);
}


/**
 * Public API
 */

export function newKeyboardLayout(aKeyMap, aDeadKeys, aGeometry) {
  const keyMap   = aKeyMap   || {};
  const deadKeys = aDeadKeys || {};
  const geometry = aGeometry || '';

  const modifiers = Object.assign({}, MODIFIERS);
  const deadKeyDict = getDeadKeyDict(deadKeys);
  let pendingDK;
  let platform = '';

  return {
    get keyMap()    { return keyMap;    },
    get deadKeys()  { return deadKeys;  },
    get pendingDK() { return pendingDK; },
    get geometry()  { return geometry;  },
    get platform()  { return platform;  },
    set platform(value) { platform = value; },

    // modifier state
    get modifiers() {
      return {
        get shift() { return getShiftState(modifiers); },
        get altgr() { return getAltGrState(modifiers, platform); },
        get level() { return getModifierLevel(modifiers, platform); },
      };
    },

    // keyboard hints
    getKey: char => getKeyList(keyMap, char)[0],
    getKeySequence: str => getKeySequence(keyMap, deadKeyDict, str),

    // keyboard emulation
    keyUp: (keyCode) => {
      if (keyCode in modifiers) {
        modifiers[keyCode] = false;
      }
    },
    keyDown: (keyCode) => {
      if (keyCode in modifiers) {
        modifiers[keyCode] = true;
      }
      const key = keyMap[keyCode];
      if (!key) {
        return '';
      }
      const value = key[getModifierLevel(modifiers, platform)];
      if (pendingDK) {
        const dk = pendingDK;
        pendingDK = undefined;
        return dk[value] || '';
      }
      if (isDeadKey(value)) {
        pendingDK = deadKeys[value];
        return '';
      }
      return value || '';
    },
  };
}

export function newKalamineLayout(kalamineKeyMap, kalamineDeadKeys, geometry) {
  const keyMap   = parseKalamineLayout(kalamineKeyMap     || {});
  const deadKeys = parseKalamineDeadKeys(kalamineDeadKeys || []);
  return newKeyboardLayout(keyMap, deadKeys, (geometry || '').toLowerCase());
}
