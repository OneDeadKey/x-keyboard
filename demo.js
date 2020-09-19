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
          .then((response) => response.json())
          .then((data) => keyboard.setKeyboardLayout(data.keymap, data.deadkeys,
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
      (event) => updateHashState(key, event.target.value));
  });
  window.addEventListener('hashchange', applyHashState);
  applyHashState();

  // required to work around a Chrome bug, see the `keyup` listener below
  const pressedKeys = {};

  // highlight keyboard keys and emulate the selected layout
  input.onkeydown = (event) => {
    pressedKeys[event.code] = true;
    const value = keyboard.keyDown(event);
    if (value) {
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
  input.addEventListener('keyup', (event) => {
    if (pressedKeys[event.code]) { // expected behavior
      keyboard.keyUp(event);
      delete pressedKeys[event.code];
    } else {
      /**
       * We got a `keyup` event for a key that did not trigger any `keydown`
       * event first: this is a known bug with "real" dead keys on Chrome.
       * As a workaround, emulate a keydown + keyup. This introduces some lag,
       * which can result in a typo (especially when the "real" dead key is used
       * for an emulated dead key) -- but there's not much else we can do.
       */
      event.target.value += keyboard.keyDown(event);
      setTimeout(() => keyboard.keyUp(event), 100);
    }
  });

  /**
   * When pressing a "real" dead key + key sequence, Firefox and Chrome will
   * add the composed character directly to the text input (and nicely trigger
   * an `insertCompositionText` or `insertText` input event, respectively).
   * Not sure wether this is a bug or not -- but this is not the behavior we
   * want for a keyboard layout emulation. The code below works around that.
   */
  input.addEventListener('input', (event) => {
    if (event.inputType === 'insertCompositionText'
      || event.inputType === 'insertText') {
      event.target.value = event.target.value.slice(0, -event.data.length);
    }
  });

  window.addEventListener('focusout', () => keyboard.clearStyle());

  // ready to type!
  input.value = '';
  input.focus();
});
