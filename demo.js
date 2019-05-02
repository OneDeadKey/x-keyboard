window.addEventListener('DOMContentLoaded', () => {
  'use strict';

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
        input.placeholder = "type here";
      } else {
        keyboard.setKalamineLayout();
        input.placeholder = "select a keyboard layout";
      }
    } else {
      keyboard[key] = value;
    }
    document.getElementById(key).value = value;
  };
  IDs.forEach((key, i) =>
    document.getElementById(key).addEventListener('change', (event) =>
      updateHashState(key, event.target.value)));

  // store the keyboard state in the URL hash like it's 1995 again! :-)
  let state = {};
  const updateHashState = (key, value) => {
    state[key] = value;
    window.location.hash = IDs
      .reduce((hash, value) => hash + '/' + state[value], '')
      .replace(/\/+$/, '');
  };
  const applyHashState = () => {
    const hashState = window.location.hash.split('/').slice(1);
    IDs.forEach((key, i) => {
      setProp(key, hashState[i] || '');
      state[key] = hashState[i] || '';;
    });
  };
  window.addEventListener('hashchange', applyHashState);
  applyHashState();

  // highlight keyboard keys and emulate the keyboard
  let previousValue = '';
  input.onkeyup = event => keyboard.keyUp(event.code);
  input.onkeydown = event => {
    const value = keyboard.keyDown(event.code);
    if (event.code === 'Enter') {
      previousValue = input.value = '';
      return false;
    }
    if (!state.layout) {
      return true;
    }
    if (previousValue !== input.value) {
      // working around a weird bug with dead keys on Firefox + Linux
      input.value = previousValue;
    }
    if (value) {
      input.value += value;
    } else if (event.code === 'Backspace') {
      input.value = input.value.slice(0, -1);
    }
    previousValue = input.value;
    return false;
  };
  window.addEventListener('focusout', () => keyboard.clearStyle());

  // ready to type!
  input.value = '';
  input.focus();
});
