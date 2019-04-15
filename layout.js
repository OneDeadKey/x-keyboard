export { newKeyboardLayout, isDeadKey };

const keyNames = {
  'SPCE': 'Space',
  // numbers
  'AE01': 'Digit1',
  'AE02': 'Digit2',
  'AE03': 'Digit3',
  'AE04': 'Digit4',
  'AE05': 'Digit5',
  'AE06': 'Digit6',
  'AE07': 'Digit7',
  'AE08': 'Digit8',
  'AE09': 'Digit9',
  'AE10': 'Digit0',
  // letters: 1st row
  'AD01': 'KeyQ',
  'AD02': 'KeyW',
  'AD03': 'KeyE',
  'AD04': 'KeyR',
  'AD05': 'KeyT',
  'AD06': 'KeyY',
  'AD07': 'KeyU',
  'AD08': 'KeyI',
  'AD09': 'KeyO',
  'AD10': 'KeyP',
  // letters: 2nd row
  'AC01': 'KeyA',
  'AC02': 'KeyS',
  'AC03': 'KeyD',
  'AC04': 'KeyF',
  'AC05': 'KeyG',
  'AC06': 'KeyH',
  'AC07': 'KeyJ',
  'AC08': 'KeyK',
  'AC09': 'KeyL',
  'AC10': 'Semicolon',
  // letters: 3rd row
  'AB01': 'KeyZ',
  'AB02': 'KeyX',
  'AB03': 'KeyC',
  'AB04': 'KeyV',
  'AB05': 'KeyB',
  'AB06': 'KeyN',
  'AB07': 'KeyM',
  'AB08': 'Comma',
  'AB09': 'Period',
  'AB10': 'Slash',
  // pinky keys
  'TLDE': 'Backquote',
  'AE11': 'Minus',
  'AE12': 'Equal',
  'AD11': 'BracketLeft',
  'AD12': 'BracketRight',
  'BKSL': 'Backslash',
  'AC11': 'Quote',
  'LSGT': 'IntlBackslash',
};

// turn Kalamine IDs (xkb) into DOM IDs
function parseKalamineLayout(keyMap) {
  let rv = {};
  for (let xkb in keyMap) {
    rv[keyNames[xkb]] = keyMap[xkb];
  }
  return rv;
}

// Kalamine dead keys are identified with a `*` prefix + the diacritic sign
function isDeadKey(value) {
  return value && value.length === 2 && value[0] === '*';
}

// return true if the deadKey object has all expected properties
function checkKalamineDeadKey(key) {
  return isDeadKey(key.char) && key.alt_self && key.alt_space && key.name
    && key.base && key.base.length && key.alt && key.alt.length
    && key.base.length === key.alt.length;
}

// parse Kalamine dead keys, return a easier-to-use dictionary
function parseKalamineDeadKeys(deadKeys) {
  let rv = {};
  // sorting the dead key array ensures '1dk' comes up first
  deadKeys.filter(checkKalamineDeadKey).sort((a, b) => a.name > b.name)
    .forEach(dk => {
      let deadKey = {};
      for (let i = 0; i < dk.base.length; i++) {
        deadKey[dk.base[i]] = dk.alt[i];
      }
      deadKey['\u0020'] = dk.alt_space;
      deadKey['\u00a0'] = dk.alt_space;
      deadKey['\u202f'] = dk.alt_space;
      deadKey[dk.char] = dk.alt_self;
      rv[dk.char] = deadKey;
    });
  return rv;
}

// return the list of all keys that can output the requested char
function getKeyList(keyMap, char) {
  let rv = [];
  for (const keyID in keyMap) {
    const level = keyMap[keyID].indexOf(char);
    if (level >= 0) {
      rv.push({ id: keyID, level });
    }
  }
  return rv.sort((a, b) => a.level > b.level);
}

// return a sequence of keys that can output the requested string
function getKeySequence(keyMap, deadKeys, str) {
  let rv = [];
  Array.from(str || '').forEach(char => {
    const keys = getKeyList(keyMap, char);
    if (keys.length) { // direct access (possibly with Shift / AltGr)
      rv.push(keys[0]);
    } else { // no direct access => look for a dead key
      for (const dKey in deadKeys) {
        for (const base in deadKeys[dKey]) {
          if (deadKeys[dKey][base] === char) {
            rv.push(getKeyList(keyMap, dKey)[0]);
            rv.push(getKeyList(keyMap, base)[0]);
            return;
          }
        }
      }
      rv.push({});
      console.error('char not found:', char);
    }
  });
  return rv;
}

// public API
function newKeyboardLayout(keyMap, deadKeys) {
  const kMap = parseKalamineLayout(keyMap);
  const dkMap = parseKalamineDeadKeys(deadKeys);
  return {
    get keyMap() { return kMap; },
    get deadKeys() { return dkMap; },
    getKey: char => getKeyList(kMap, char)[0],
    getKeySequence: str => getKeySequence(kMap, dkMap, str)
  };
}
