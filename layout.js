export { newKeyboardLayout, isDeadKey };

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
  const dkMap = parseKalamineDeadKeys(deadKeys);
  return {
    get keyMap() { return keyMap; },
    get deadKeys() { return dkMap; },
    getKey: char => getKeyList(keyMap, char)[0],
    getKeySequence: str => getKeySequence(keyMap, dkMap, str)
  };
}
