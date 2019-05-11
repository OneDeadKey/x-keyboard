import { isDeadKey } from './x-keyboard-layout.js';


/**
 * DOM-to-Text Utils
 */

const sgml = (nodeName, attributes = {}, children = []) => `<${nodeName} ${
  Object.entries(attributes)
    .map(([ id, value ]) => `${id}="${value}"`)
    .join(' ')
}>${children.join('\n')}</${nodeName}>`;

const path = (cname = '', d) => sgml('path', { class: cname, d });

const rect = (cname = '', attributes) => sgml('rect', Object.assign({
  class: cname, width: 50, height: 50, rx: 5, ry: 5,
}, attributes));

const text = (content, cname = '', attributes) => sgml('text', Object.assign({
  class: cname, width: 25, height: 25, x: 15, y: 42, 'text-anchor': 'middle',
}, attributes), [content]);

const g = (className, children) => sgml('g', { class: className }, children);

const emptyKey = [ rect(), g('key') ];

const key = (className, finger, offset, id, children = emptyKey) => sgml('g', {
  class: className, finger, id, transform: `translate(${offset}, 0)`,
}, children);


/**
 * Keyboard Layout Utils
 */

const dkClass = label => (isDeadKey(label) ? 'deadKey' : '');
const keyText = label => (label || '').slice(-1);
const keyLevel = (level, label, className, position) => text(label,
  `level${level} ${className}`,
  Object.assign({ 'text-anchor': 'middle' }, position));

// In order not to overload the `alt` layers visually (AltGr & dead keys),
// the `shift` key is displayed only if its lowercase is not `base`.
const altUpperChar = (base, shift) => (shift && base !== shift.toLowerCase()
  ? shift : '');

export function drawKey(element, keyMap) {
  const keyChars = keyMap[element.parentNode.id];
  if (!keyChars) {
    element.innerHTML = '';
    return;
  }
  /**
   * What key label should we display when the `base` and `shift` layers have
   * the lowercase and uppercase versions of the same letter?
   * Most of the time we want the uppercase letter, but there are tricky cases:
   *   - German:
   *      'ß'.toUpperCase() == 'SS'
   *      'ẞ'.toLowerCase() == 'ß'
   *   - Greek:
   *      'ς'.toUpperCase() == 'Σ'
   *      'σ'.toUpperCase() == 'Σ'
   *      'Σ'.toLowerCase() == 'σ'
   *      'µ'.toUpperCase() == 'Μ' //        micro sign => capital letter MU
   *      'μ'.toUpperCase() == 'Μ' //   small letter MU => capital letter MU
   *      'Μ'.toLowerCase() == 'μ' // capital letter MU =>   small letter MU
   * So if the lowercase version of the `shift` layer does not match the `base`
   * layer, we'll show the lowercase letter (e.g. Greek 'ς').
   */
  const [ base, shift, alt, salt ] = keyChars;
  const baseLabel = base.toUpperCase() !== shift ? base : '';
  const shiftLabel = baseLabel || shift.toLowerCase() === base ? shift : base;
  const saltLabel = altUpperChar(alt, salt);
  element.innerHTML = `
    ${keyLevel(1, keyText(baseLabel),  dkClass(baseLabel),  { x: 12, y: 42 })}
    ${keyLevel(2, keyText(shiftLabel), dkClass(shiftLabel), { x: 12, y: 20 })}
    ${keyLevel(3, keyText(alt),        dkClass(alt),        { x: 38, y: 42 })}
    ${keyLevel(4, keyText(saltLabel),  dkClass(salt),       { x: 38, y: 20 })}
    ${keyLevel(5, '',                  'dk',                { x: 38, y: 42 })}
    ${keyLevel(6, '',                  'dk',                { x: 38, y: 20 })}
  `;
}

export function drawDK(element, keyMap, deadKey) {
  const keyChars = keyMap[element.parentNode.id];
  if (!keyChars) {
    return;
  }
  const alt0 = deadKey[keyChars[0]];
  const alt1 = deadKey[keyChars[1]];
  element.querySelector('.level5').textContent = alt0 || '';
  element.querySelector('.level6').textContent = altUpperChar(alt0, alt1);
}


/**
 * SVG Content
 * https://www.w3.org/TR/uievents-code/
 * https://commons.wikimedia.org/wiki/File:Physical_keyboard_layouts_comparison_ANSI_ISO_KS_ABNT_JIS.png
 */

const numberRow = g('left', [
  key('specialKey', 'l5', 0, 'Escape', [
    rect('ergo'),
    text('⎋', 'ergo'),
  ]),
  key('pinkyKey', 'l5', 0, 'Backquote', [
    rect('specialKey jis'),
    rect('ansi alt iso ergo'),
    text('半角', 'jis', { x: 25, y: 18 }), // half-width (hankaku)
    text('全角', 'jis', { x: 25, y: 30 }), // full-width (zenkaku)
    text('漢字', 'jis', { x: 25, y: 42 }), // kanji
    g('ansi key'),
  ]),
  key('numberKey', 'l5',  60, 'Digit1'),
  key('numberKey', 'l4', 120, 'Digit2'),
  key('numberKey', 'l3', 180, 'Digit3'),
  key('numberKey', 'l2', 240, 'Digit4'),
  key('numberKey', 'l2', 300, 'Digit5'),
]) + g('right', [
  key('numberKey',  'r2', 360, 'Digit6'),
  key('numberKey',  'r2', 420, 'Digit7'),
  key('numberKey',  'r3', 480, 'Digit8'),
  key('numberKey',  'r4', 540, 'Digit9'),
  key('numberKey',  'r5', 600, 'Digit0'),
  key('pinkyKey',   'r5', 660, 'Minus'),
  key('pinkyKey',   'r5', 720, 'Equal'),
  key('pinkyKey',   'r5', 780, 'IntlYen'),
  key('specialKey', 'r5', 780, 'Backspace', [
    rect('ansi', { width: 110 }),
    rect('ol60', { height: 110, y: -60 }),
    rect('ol40 ol50'),
    rect('alt', { x: 60 }),
    text('⌫', 'ansi'),
    text('⌫', 'ergo'),
    text('⌫', 'alt', { x: 75 }),
  ]),
]);

const letterRow1 = g('left', [
  key('specialKey', 'l5', 0, 'Tab', [
    rect('', { width: 80 }),
    rect('ergo'),
    text('↹'),
    text('↹', 'ergo'),
  ]),
  key('letterKey', 'l5',  90, 'KeyQ'),
  key('letterKey', 'l4', 150, 'KeyW'),
  key('letterKey', 'l3', 210, 'KeyE'),
  key('letterKey', 'l2', 270, 'KeyR'),
  key('letterKey', 'l2', 330, 'KeyT'),
]) + g('right', [
  key('letterKey', 'r2', 390, 'KeyY'),
  key('letterKey', 'r2', 450, 'KeyU'),
  key('letterKey', 'r3', 510, 'KeyI'),
  key('letterKey', 'r4', 570, 'KeyO'),
  key('letterKey', 'r5', 630, 'KeyP'),
  key('pinkyKey',  'r5', 690, 'BracketLeft'),
  key('pinkyKey',  'r5', 750, 'BracketRight'),
  key('pinkyKey',  'r5', 810, 'Backslash', [
    rect('ansi', { width: 80 }),
    rect('iso ol60'),
    g('key'),
  ]),
]);

const letterRow2 = g('left', [
  key('specialKey', 'l5', 0, 'CapsLock', [
    rect('', { width: 95 }),
    text('⇪', 'ansi'),
    text('英数', 'jis', { x: 25 }), // alphanumeric (eisū)
  ]),
  key('letterKey homeKey', 'l5', 105, 'KeyA'),
  key('letterKey homeKey', 'l4', 165, 'KeyS'),
  key('letterKey homeKey', 'l3', 225, 'KeyD'),
  key('letterKey homeKey', 'l2', 285, 'KeyF'),
  key('letterKey',         'l2', 345, 'KeyG'),
]) + g('right', [
  key('letterKey',         'r2', 405, 'KeyH'),
  key('letterKey homeKey', 'r2', 465, 'KeyJ'),
  key('letterKey homeKey', 'r3', 525, 'KeyK'),
  key('letterKey homeKey', 'r4', 585, 'KeyL'),
  key('letterKey homeKey', 'r5', 645, 'Semicolon'),
  key('pinkyKey',          'r5', 705, 'Quote'),
  key('specialKey',        'r5', 765, 'Enter', [
    path('alt', 'M50,-60 h70 a5,5 0 0 1 5,5 v100 a5,5 0 0 1 -5,5 h-115 a5,5 0 0 1 -5,-5 v-40 a5,5 0 0 1 5,-5 h35 a5,5 1 0 0 5,-5 v-50 a5,5 0 0 1 5,-5 z'),
    path('iso', 'M50,-60 h70 a5,5 0 0 1 5,5 v100 a5,5 0 0 1 -5,5 h-55 a5,5 0 0 1 -5,-5 v-50 a5,5 1 0 0 -5,-5 h-5 a5,5 0 0 1 -5,-5 v-40 a5,5 0 0 1 5,-5 z'),
    rect('ansi', { width: 125 }),
    rect('ol60', { height: 110, y: -60 }),
    rect('ol40 ol50'),
    text('⏎', 'ansi alt ergo'),
    text('⏎', 'iso', { x: 75 }),
  ]),
]);

const letterRow3 = g('left', [
  key('specialKey', 'l5', 0, 'ShiftLeft', [
    rect('ansi alt',  { width: 125 }),
    rect('iso',       { width:  65 }),
    rect('ol50 ol60', { height: 110, y: -60 }),
    rect('ol40'),
    text('⇧'),
    text('⇧', 'ergo'),
  ]),
  key('letterKey', 'l5',  75, 'IntlBackslash'),
  key('letterKey', 'l5', 135, 'KeyZ'),
  key('letterKey', 'l4', 195, 'KeyX'),
  key('letterKey', 'l3', 255, 'KeyC'),
  key('letterKey', 'l2', 315, 'KeyV'),
  key('letterKey', 'l2', 375, 'KeyB'),
]) + g('right', [
  key('letterKey',  'r2', 435, 'KeyN'),
  key('letterKey',  'r2', 495, 'KeyM'),
  key('letterKey',  'r3', 555, 'Comma'),
  key('letterKey',  'r4', 615, 'Period'),
  key('letterKey',  'r5', 675, 'Slash'),
  key('pinkyKey',   'r5', 735, 'IntlRo'),
  key('specialKey', 'r5', 735, 'ShiftRight', [
    rect('ansi',      { width: 155 }),
    rect('abnt',      { width:  95,  x:  60 }),
    rect('ol50 ol60', { height: 110, y: -60 }),
    rect('ol40'),
    text('⇧', 'ansi'),
    text('⇧', 'ergo'),
    text('⇧', 'abnt', { x: 75 }),
  ]),
]);

const baseRow = g('left', [
  key('specialKey', 'l5', 0, 'ControlLeft', [
    rect('', { width: 70 }),
    rect('ergo'),
    text('Ctrl', 'win gnu', { x: 10, 'text-anchor': 'left' }),
    text('⌃',    'mac'),
  ]),
  key('specialKey', 'l1', 80, 'MetaLeft', [
    rect('',     { width: 70 }),
    rect('ergo', { width: 80 }),
    text('Win',   'win', { x: 10, 'text-anchor': 'left' }),
    text('Super', 'gnu', { x: 10, 'text-anchor': 'left' }),
    text('⌘',     'mac'),
  ]),
  key('specialKey', 'l1', 160, 'AltLeft', [
    rect('',     { width: 70 }),
    rect('ergo', { width: 80 }),
    text('Alt', 'win gnu', { x: 10, 'text-anchor': 'left' }),
    text('⌥',   'mac'),
  ]),
  key('specialKey', 'l1', 240, 'Lang2', [
    rect(),
    text('한자', '', { x: 25 }), // hanja
  ]),
  key('specialKey', 'l1', 240, 'NonConvert', [
    rect(),
    text('無変換', '', { x: 25 }), // muhenkan
  ]),
]) + key('homeKey', 'm1', 240, 'Space', [
  rect('ansi',      { width: 350 }),
  rect('ol60',      { width: 290, x: -60 }),
  rect('ol50 ol40', { width: 230 }),
  rect('ks',        { width: 230, x: 60 }),
  rect('jis',       { width: 170, x: 60 }),
]) + g('right', [
  key('specialKey', 'r1', 480, 'Convert', [
    rect(),
    text('変換', '', { x: 25 }), // henkan
  ]),
  key('specialKey', 'r1', 540, 'KanaMode', [
    rect(),
    text('カタカナ', '', { x: 25, y: 18 }), // katakana
    text('ひらがな', '', { x: 25, y: 30 }), // hiragana
    text('ローマ字', '', { x: 25, y: 42 }), // romaji
  ]),
  key('specialKey', 'r1', 540, 'Lang1', [
    rect(),
    text('한/영', '', { x: 25 }), // han/yeong
  ]),
  key('specialKey', 'r1', 600, 'AltRight', [
    rect('',     { width: 70 }),
    rect('ergo', { width: 80 }),
    text('Alt', 'win gnu', { x: 10, 'text-anchor': 'left' }),
    text('⌥',   'mac'),
  ]),
  key('specialKey', 'r1', 680, 'MetaRight', [
    rect('',     { width: 70 }),
    rect('ergo', { width: 80 }),
    text('Win',   'win', { x: 10, 'text-anchor': 'left' }),
    text('Super', 'gnu', { x: 10, 'text-anchor': 'left' }),
    text('⌘',     'mac'),
  ]),
  key('specialKey', 'r5', 760, 'ContextMenu', [
    rect(),
    rect('ergo'),
    text('☰'),
    text('☰', 'ol60'),
  ]),
  key('specialKey', 'r5', 820, 'ControlRight', [
    rect('', { width: 70 }),
    rect('ergo'),
    text('Ctrl', 'win gnu', { x: 10, 'text-anchor': 'left' }),
    text('⌃',    'mac'),
  ]),
]);

export const svgContent = `
  <svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg">
    <g id="row_AE" transform="translate(5,  5)"> ${numberRow}  </g>
    <g id="row_AD" transform="translate(5, 65)"> ${letterRow1} </g>
    <g id="row_AC" transform="translate(5,125)"> ${letterRow2} </g>
    <g id="row_AB" transform="translate(5,185)"> ${letterRow3} </g>
    <g id="row_AA" transform="translate(5,245)"> ${baseRow}    </g>
  </svg>
`;
