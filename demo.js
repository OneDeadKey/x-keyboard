window.addEventListener('DOMContentLoaded', () => {
  'use strict'; // eslint-disable-line

  const keyboard = document.querySelector('x-keyboard');
  const input    = document.querySelector('input');

  // keyboard state: these <select> element IDs match the x-keyboard properties
  // -- but the `layout` property requires a JSON fetch
  const IDs = [ 'layout', 'geometry', 'platform', 'theme' ];
  const setProp = (key, value) => {
    if (key === 'layout') {
      if (value) {
        fetch(`layouts/${value}.json`)
          .then(response => response.json())
          .then(data => keyboard.setKeyboardLayout(data.keymap, data.deadkeys,
            data.geometry.replace('ergo', 'iso')));
        input.placeholder = 'type here';
      } else {
        keyboard.setKeyboardLayout();
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

  // highlight keyboard keys and emulate the selected layout
  input.onkeyup = event => keyboard.keyUp(event.code);
  input.onkeydown = (event) => {
    const value = keyboard.keyDown(event.code);
    if (value && state.layout
        && !(event.ctrlKey || event.altKey || event.metaKey)) {
      event.target.value += value;
    } else if (event.code === 'Enter') { // clear text input on <Enter>
      event.target.value = '';
    } else if (event.code === 'Tab') { // focus the layout selector
      setTimeout(() => document.getElementById('layout').focus(), 100);
    } else {
      return true; // don't intercept special keys or key shortcuts
    }
    return false; // event has been consumed, stop propagation
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
    if (state.layout && event.inputType === 'insertCompositionText') {
      event.target.value = event.target.value.slice(0, -event.data.length);
    }
  };

  window.addEventListener('focusout', () => keyboard.clearStyle());

  // ready to type!
  input.value = '';
  input.focus();
});
