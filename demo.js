window.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const keyboard = document.querySelector('x-keyboard');
  const emulation = document.getElementById('emulation');
  const layout = document.getElementById('layout');
  const input  = document.getElementById('txtInput');
  const shape  = document.getElementById('shape');
  const theme  = document.getElementById('theme');
  const keys   = document.getElementById('keys');

  // keyboard selector: layout, shape, color theme
  const setShape = () => keyboard.shape = shape.value;
  const setTheme = () => keyboard.theme = theme.value;
  const showKeys = () => keyboard.showKeys(keys.value);
  const setLayout = () => {
    if (layout.value) {
      fetch(`layouts/${layout.value}.json`)
        .then(response => response.json())
        .then(data => {
          keyboard.layout = data.layout;
          let deadKeys = [];
          for (let dk in data.dead_keys) {
            deadKeys.push(data.dead_keys[dk]);
          }
          keyboard.deadKeys = deadKeys;
        })
        .then(showKeys);
    } else { // blank layout
      keyboard.layout = {};
      keyboard.deadKeys = [];
      showKeys();
    }
  };
  shape.addEventListener('change', setShape);
  theme.addEventListener('change', setTheme);
  layout.addEventListener('change', setLayout);
  setLayout();
  setShape();
  setTheme();

  // highlight keyboard keys and emulate the keyboard
  input.onkeyup = event => keyboard.keyUp(event.code);
  input.onkeydown = event => {
    const value = keyboard.keyDown(event.code);
    if (!emulation.checked) {
      return true;
    }
    if (value) {
      input.value += value;
    } else if (event.code === 'Backspace') {
      if (event.ctrlKey || event.altKey) {
        input.value = '';
      } else {
        input.value = input.value.slice(0, -1);
      }
    } else if (event.code === 'Enter') {
      input.value = '';
    }
    return false;
  };
  window.addEventListener('focusout', () => {
    keyboard.clearStyle();
    keyboard.showKeys(keys.value);
  });
  keys.addEventListener('input', e => keyboard.showKeys(e.target.value, kps));
  input.value = '';
  input.focus();
});
