window.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const keyboard = document.querySelector('x-keyboard');
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
        .then(data => keyboard.layout = data.layout)
        .then(showKeys);
    } else { // blank layout
      keyboard.layout = {};
      showKeys();
    }
  };
  shape.addEventListener('change', setShape);
  theme.addEventListener('change', setTheme);
  layout.addEventListener('change', setLayout);
  setLayout();
  setShape();
  setTheme();

  // highlight keyboard keys
  const kps = 'background-color: #aaf;';
  input.addEventListener('keydown', e => keyboard.setKeyStyle(e.code, kps));
  input.addEventListener('keyup',   e => keyboard.setKeyStyle(e.code, ''));
  window.addEventListener('focusout', () => {
    keyboard.clearStyle();
    keyboard.showKeys(keys.value);
  });
  keys.addEventListener('input', e => keyboard.showKeys(e.target.value, kps));
  input.focus();
});
