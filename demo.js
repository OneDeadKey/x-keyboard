window.addEventListener('DOMContentLoaded', () => {
  'use strict'; // eslint-disable-line

  const keyboard = document.querySelector('x-keyboard');
  const input    = document.querySelector('input');

  // keyboard state: these <select> element IDs match the x-keyboard properties
  // -- but the `layout` property requires a bit more work (JSON fetch)
  const IDs = [ 'layout', 'geometry', 'platform', 'theme' ];
  const setProp = (key, value) => {
    if (key === 'layout') {
      if (value) {
        fetch(`layouts/${value}.json`)
          .then(response => response.json())
          .then(data => keyboard.setKalamineLayout(data.layout, data.dead_keys,
            data.geometry.replace('ERGO', 'ISO')));
        input.placeholder = 'type here';
      } else {
        keyboard.setKalamineLayout();
        input.placeholder = 'select a keyboard layout';
      }
    } else {
      keyboard[key] = value;
    }
    document.getElementById(key).value = value;
  };

  // store the keyboard state in the URL hash like it's 1995 again! :-)
  const state = {};
  const updateHashState = (key, value) => {
    state[key] = value;
    window.location.hash = IDs
      .reduce((hash, prop) => `${hash}/${state[prop]}`, '')
      .replace(/\/+$/, '');
  };
  const applyHashState = () => {
    const hashState = window.location.hash.split('/').slice(1);
    IDs.forEach((key, i) => {
      setProp(key, hashState[i] || '');
      state[key] = hashState[i] || '';
    });
  };
  IDs.forEach((key) => {
    document.getElementById(key).addEventListener('change',
      event => updateHashState(key, event.target.value));
  });
  window.addEventListener('hashchange', applyHashState);
  applyHashState();

  // highlight keyboard keys and emulate the keyboard
  input.onkeyup = event => keyboard.keyUp(event.code);
  input.onkeydown = (event) => {
    const value = keyboard.keyDown(event.code);
    if (event.code === 'Enter') { // clear text input on <Enter>
      event.target.value = '';
      return false;
    }
    if (!state.layout || event.code.startsWith('F')
      || event.ctrlKey || event.altKey || event.metaKey) {
      return true; // don't steal F1-12 keys or Ctrl/Alt/Super-* shortcuts
    }
    if (event.code === 'Tab') { // make the Tab key great again
      document.getElementById('layout').focus();
    } else if (value) {
      event.target.value += value;
    } else if (event.code === 'Backspace') {
      event.target.value = event.target.value.slice(0, -1);
    }
    return false;
  };

  /**
   * When pressing a "real" dead key + key sequence:
   *  - Chromium does not raise any event until the key sequence is complete
   *    => "real" dead keys are unusable for this emulation, unfortunately;
   *  - Firefox triggers two `keydown` events (as expected),
   *    but also adds the composed character directly to the text input
   *    (and nicely triggers an `insertCompositionText` input event)
   *    => the code below works around that.
   */
  input.oninput = (event) => {
    if (state.layout) {
      event.target.value = event.target.value.slice(0, -event.data.length);
    }
  };

  window.addEventListener('focusout', () => keyboard.clearStyle());

  // ready to type!
  input.value = '';
  input.focus();
});
