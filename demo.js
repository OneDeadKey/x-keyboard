window.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const keyboard  = document.querySelector('x-keyboard');
  const emulation = document.getElementById('emulation');
  const layout    = document.getElementById('layout');
  const input     = document.getElementById('txtInput');
  const shape     = document.getElementById('shape');
  const platform  = document.getElementById('platform');
  const theme     = document.getElementById('theme');
  const keys      = document.getElementById('keys');

  // keyboard selector: layout, shape, color theme
  const setPlatform = () => keyboard.platform = platform.value;
  const setShape    = () => keyboard.shape = shape.value;
  const setTheme    = () => keyboard.theme = theme.value;
  const showKeys    = () => keyboard.showKeys(keys.value);
  const setLayout   = () => {
    if (layout.value) {
      fetch(`layouts/${layout.value}.json`)
        .then(response => response.json())
        .then(data => {
          keyboard.setKalamineLayout(data.layout, data.dead_keys);
          showKeys();
        });
    } else { // blank layout
      keyboard.setKalamineLayout();
      showKeys();
    }
  };
  shape.addEventListener('change', setShape);
  platform.addEventListener('change', setPlatform);
  theme.addEventListener('change', setTheme);
  layout.addEventListener('change', setLayout);
  setLayout();
  setShape();
  setPlatform();
  setTheme();

  // highlight keyboard keys and emulate the keyboard
  let previousValue = '';
  input.onkeyup = event => keyboard.keyUp(event.code);
  input.onkeydown = event => {
    const value = keyboard.keyDown(event.code);
    if (event.code === 'Enter') {
      previousValue = input.value = '';
      return false;
    }
    if (!emulation.checked) {
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
  window.addEventListener('focusout', () => {
    keyboard.clearStyle();
    keyboard.showKeys(keys.value);
  });

  const kps = 'background-color: #aaf';
  keys.addEventListener('input', e => keyboard.showKeys(e.target.value, kps));
  input.value = '';
  input.focus();
});
