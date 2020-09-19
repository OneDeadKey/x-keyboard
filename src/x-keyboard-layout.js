/**
 * Keyboard Layout Data
 * {
 *   keymap: {
 *     'KeyQ': [ 'q', 'Q' ],    // normal, shift, [altGr], [shift+altGr]
 *     'KeyP': [ 'p', 'P' ],
 *     'Quote': [ '*´', '*¨' ], // dead keys: acute, diaeresis
 *     ...
 *   },
 *   deadkeys: {
 *     '*´': { 'a': 'á', 'A': 'Á', ...  },
 *     '*¨': { 'a': 'ä', 'A': 'Ä', ...  },
 *     ...
 *   },
 *   geometry: 'ansi' // 'ansi', 'iso', 'alt', 'abnt', 'jis', 'ks' (standard)
 *                    // or 'ol60', 'ol50', 'ol40' (ortholinear)
 * }
 */

// dead keys are identified with a `*` prefix + the diacritic sign
export function isDeadKey(value) {
  return value && value.length === 2 && value[0] === '*';
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
function getKeySequence(keyMap, dkDict, str = '') {
  const rv = [];
  Array.from(str).forEach((char) => {
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
 * Keyboard Layout API (public)
 */

export function newKeyboardLayout(keyMap = {}, deadKeys = {}, geometry = '') {
  const modifiers = { ...MODIFIERS };
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
    getKey: (char) => getKeyList(keyMap, char)[0],
    getKeySequence: (str) => getKeySequence(keyMap, deadKeyDict, str),

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
