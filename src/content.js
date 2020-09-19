import { KEY_WIDTH, KEY_PADDING, KEY_RADIUS } from './constants.js';
import { isDeadKey } from './x-keyboard-layout.js';
import dkSymbols from './symbols.js';

/**
 * Enter Key: ISO & ALT
 */

const arc = (xAxisRotation, x, y) => [
  `a${KEY_RADIUS},${KEY_RADIUS}`,
  xAxisRotation ? '1 0 0' : '0 0 1',
  `${KEY_RADIUS * x},${KEY_RADIUS * y}`,
].join(' ');

const lineLength = (length, gap) => {
  const offset = 2 * (KEY_PADDING + KEY_RADIUS) - 2 * gap * KEY_PADDING;
  return KEY_WIDTH * length - Math.sign(length) * offset;
};

const h = (length, gap = 0, ccw = 0) => {
  const l = lineLength(length, gap);
  const sign = Math.sign(length);
  return `h${l} ${ccw ? arc(1, sign, -sign) : arc(0, sign, sign)}`;
};

const v = (length, gap = 0, ccw = 0) => {
  const l = lineLength(length, gap);
  const sign = Math.sign(length);
  return `v${l} ${ccw ? arc(1, sign, sign) : arc(0, -sign, sign)}`;
};

const M = `M${0.75 * KEY_WIDTH + KEY_RADIUS},-${KEY_WIDTH}`;

const altEnterPath = [
  M, h(1.5), v(2.0), h(-2.25), v(-1.0), h(0.75, 1, 1), v(-1.0, 1), 'z',
].join(' ');

const isoEnterPath = [
  M, h(1.5), v(2.0), h(-1.25), v(-1.0, 1, 1), h(-0.25, 1), v(-1.0), 'z',
].join(' ');

/**
 * DOM-to-Text Utils
 */

const sgml = (nodeName, attributes = {}, children = []) => `<${nodeName} ${
  Object.entries(attributes)
    .map(([ id, value ]) => {
      if (id === 'x' || id === 'y') {
        return `${id}="${KEY_WIDTH * Number(value)
            - (nodeName === 'text' ? KEY_PADDING : 0)}"`;
      }
      if (id === 'width' || id === 'height') {
        return `${id}="${KEY_WIDTH * Number(value) - 2 * KEY_PADDING}"`;
      }
      if (id === 'translateX') {
        return `transform="translate(${KEY_WIDTH * Number(value)}, 0)"`;
      }
      return `${id}="${value}"`;
    })
    .join(' ')
}>${children.join('\n')}</${nodeName}>`;

const path = (cname = '', d) => sgml('path', { class: cname, d });

const rect = (cname = '', attributes) => sgml('rect', {
  class: cname,
  width: 1,
  height: 1,
  rx: KEY_RADIUS,
  ry: KEY_RADIUS,
  ...attributes,
});

const text = (content, cname = '', attributes) => sgml('text', {
  class: cname,
  width: 0.50,
  height: 0.50,
  x: 0.34,
  y: 0.78,
  'text-anchor': 'middle',
  ...attributes,
}, [content]);

const g = (className, children) => sgml('g', { class: className }, children);

const emptyKey = [ rect(), g('key') ];

const gKey = (className, finger, x, id, children = emptyKey) => sgml('g', {
  class: className, finger, id, transform: `translate(${x * KEY_WIDTH}, 0)`,
}, children);

/**
 * Keyboard Layout Utils
 */

const keyLevel = (level, label, position) => {
  const attrs = { 'text-anchor': 'middle', ...position };
  const symbol = dkSymbols[label] || '';
  const content = symbol || (label || '').slice(-1);
  let className = '';
  if (level > 4) {
    className = 'dk';
  } else if (isDeadKey(label)) {
    className = `deadKey ${symbol.startsWith(' ') ? 'diacritic' : ''}`;
  }
  return text(content, `level${level} ${className}`, attrs);
};

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
  const [ l1, l2, l3, l4 ] = keyChars;
  const base = l1.toUpperCase() !== l2 ? l1 : '';
  const shift = base || l2.toLowerCase() === l1 ? l2 : l1;
  const salt = altUpperChar(l3, l4);
  element.innerHTML = `
    ${keyLevel(1, base,  { x: 0.28, y: 0.79 })}
    ${keyLevel(2, shift, { x: 0.28, y: 0.41 })}
    ${keyLevel(3, l3,    { x: 0.70, y: 0.79 })}
    ${keyLevel(4, salt,  { x: 0.70, y: 0.41 })}
    ${keyLevel(5, '',    { x: 0.70, y: 0.79 })}
    ${keyLevel(6, '',    { x: 0.70, y: 0.41 })}
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
  gKey('specialKey', 'l5', 0, 'Escape', [
    rect('ergo'),
    text('⎋', 'ergo'),
  ]),
  gKey('pinkyKey', 'l5', 0, 'Backquote', [
    rect('specialKey jis'),
    rect('ansi alt iso ergo'),
    text('半角', 'jis', { x: 0.5, y: 0.4 }), // half-width (hankaku)
    text('全角', 'jis', { x: 0.5, y: 0.6 }), // full-width (zenkaku)
    text('漢字', 'jis', { x: 0.5, y: 0.8 }), // kanji
    g('ansi key'),
  ]),
  gKey('numberKey', 'l5', 1, 'Digit1'),
  gKey('numberKey', 'l4', 2, 'Digit2'),
  gKey('numberKey', 'l3', 3, 'Digit3'),
  gKey('numberKey', 'l2', 4, 'Digit4'),
  gKey('numberKey', 'l2', 5, 'Digit5'),
]) + g('right', [
  gKey('numberKey',  'r2',  6, 'Digit6'),
  gKey('numberKey',  'r2',  7, 'Digit7'),
  gKey('numberKey',  'r3',  8, 'Digit8'),
  gKey('numberKey',  'r4',  9, 'Digit9'),
  gKey('numberKey',  'r5', 10, 'Digit0'),
  gKey('pinkyKey',   'r5', 11, 'Minus'),
  gKey('pinkyKey',   'r5', 12, 'Equal'),
  gKey('pinkyKey',   'r5', 13, 'IntlYen'),
  gKey('specialKey', 'r5', 13, 'Backspace', [
    rect('ansi', { width: 2 }),
    rect('ol60', { height: 2, y: -1 }),
    rect('ol40 ol50'),
    rect('alt', { x: 1 }),
    text('⌫', 'ansi'),
    text('⌫', 'ergo'),
    text('⌫', 'alt', { translateX: 1 }),
  ]),
]);

const letterRow1 = g('left', [
  gKey('specialKey', 'l5', 0, 'Tab', [
    rect('', { width: 1.5 }),
    rect('ergo'),
    text('↹'),
    text('↹', 'ergo'),
  ]),
  gKey('letterKey', 'l5', 1.5, 'KeyQ'),
  gKey('letterKey', 'l4', 2.5, 'KeyW'),
  gKey('letterKey', 'l3', 3.5, 'KeyE'),
  gKey('letterKey', 'l2', 4.5, 'KeyR'),
  gKey('letterKey', 'l2', 5.5, 'KeyT'),
]) + g('right', [
  gKey('letterKey', 'r2',  6.5, 'KeyY'),
  gKey('letterKey', 'r2',  7.5, 'KeyU'),
  gKey('letterKey', 'r3',  8.5, 'KeyI'),
  gKey('letterKey', 'r4',  9.5, 'KeyO'),
  gKey('letterKey', 'r5', 10.5, 'KeyP'),
  gKey('pinkyKey',  'r5', 11.5, 'BracketLeft'),
  gKey('pinkyKey',  'r5', 12.5, 'BracketRight'),
  gKey('pinkyKey',  'r5', 13.5, 'Backslash', [
    rect('ansi', { width: 1.5 }),
    rect('iso ol60'),
    g('key'),
  ]),
]);

const letterRow2 = g('left', [
  gKey('specialKey', 'l5', 0, 'CapsLock', [
    rect('', { width: 1.75 }),
    text('⇪', 'ansi'),
    text('英数', 'jis', { x: 0.45 }), // alphanumeric (eisū)
  ]),
  gKey('letterKey homeKey', 'l5',  1.75, 'KeyA'),
  gKey('letterKey homeKey', 'l4',  2.75, 'KeyS'),
  gKey('letterKey homeKey', 'l3',  3.75, 'KeyD'),
  gKey('letterKey homeKey', 'l2',  4.75, 'KeyF'),
  gKey('letterKey',         'l2',  5.75, 'KeyG'),
]) + g('right', [
  gKey('letterKey',         'r2',  6.75, 'KeyH'),
  gKey('letterKey homeKey', 'r2',  7.75, 'KeyJ'),
  gKey('letterKey homeKey', 'r3',  8.75, 'KeyK'),
  gKey('letterKey homeKey', 'r4',  9.75, 'KeyL'),
  gKey('letterKey homeKey', 'r5', 10.75, 'Semicolon'),
  gKey('pinkyKey',          'r5', 11.75, 'Quote'),
  gKey('specialKey',        'r5', 12.75, 'Enter', [
    path('alt', altEnterPath),
    path('iso', isoEnterPath),
    rect('ansi', { width: 2.25 }),
    rect('ol60', { height: 2, y: -1 }),
    rect('ol40 ol50'),
    text('⏎', 'ansi alt ergo'),
    text('⏎', 'iso', { translateX: 1 }),
  ]),
]);

const letterRow3 = g('left', [
  gKey('specialKey', 'l5', 0, 'ShiftLeft', [
    rect('ansi alt',  { width: 2.25 }),
    rect('iso',       { width: 1.25 }),
    rect('ol50 ol60', { height: 2, y: -1 }),
    rect('ol40'),
    text('⇧'),
    text('⇧', 'ergo'),
  ]),
  gKey('letterKey', 'l5', 1.25, 'IntlBackslash'),
  gKey('letterKey', 'l5', 2.25, 'KeyZ'),
  gKey('letterKey', 'l4', 3.25, 'KeyX'),
  gKey('letterKey', 'l3', 4.25, 'KeyC'),
  gKey('letterKey', 'l2', 5.25, 'KeyV'),
  gKey('letterKey', 'l2', 6.25, 'KeyB'),
]) + g('right', [
  gKey('letterKey',  'r2',  7.25, 'KeyN'),
  gKey('letterKey',  'r2',  8.25, 'KeyM'),
  gKey('letterKey',  'r3',  9.25, 'Comma'),
  gKey('letterKey',  'r4', 10.25, 'Period'),
  gKey('letterKey',  'r5', 11.25, 'Slash'),
  gKey('pinkyKey',   'r5', 12.25, 'IntlRo'),
  gKey('specialKey', 'r5', 12.25, 'ShiftRight', [
    rect('ansi',      { width: 2.75 }),
    rect('abnt',      { width: 1.75,  x: 1 }),
    rect('ol50 ol60', { height: 2, y: -1 }),
    rect('ol40'),
    text('⇧', 'ansi'),
    text('⇧', 'ergo'),
    text('⇧', 'abnt', { translateX: 1 }),
  ]),
]);

const nonIcon = { x: 0.25, 'text-anchor': 'start' };
const baseRow = g('left', [
  gKey('specialKey', 'l5', 0, 'ControlLeft', [
    rect('', { width: 1.25 }),
    rect('ergo'),
    text('Ctrl', 'win gnu', nonIcon),
    text('⌃',    'mac'),
  ]),
  gKey('specialKey', 'l1', 1.25, 'MetaLeft', [
    rect('',     { width: 1.25 }),
    rect('ergo', { width: 1.50 }),
    text('Win',   'win', nonIcon),
    text('Super', 'gnu', nonIcon),
    text('⌘',     'mac'),
  ]),
  gKey('specialKey', 'l1', 2.50, 'AltLeft', [
    rect('',     { width: 1.25 }),
    rect('ergo', { width: 1.50 }),
    text('Alt', 'win gnu', nonIcon),
    text('⌥',   'mac'),
  ]),
  gKey('specialKey', 'l1', 3.75, 'Lang2', [
    rect(),
    text('한자', '', { x: 0.4 }), // hanja
  ]),
  gKey('specialKey', 'l1', 3.75, 'NonConvert', [
    rect(),
    text('無変換', '', { x: 0.5 }), // muhenkan
  ]),
]) + gKey('homeKey', 'm1', 3.75, 'Space', [
  rect('ansi',      { width: 6.25 }),
  rect('ol60',      { width: 5.00, x: -1 }),
  rect('ol50 ol40', { width: 4.00 }),
  rect('ks',        { width: 4.25, x: 1 }),
  rect('jis',       { width: 3.25, x: 1 }),
]) + g('right', [
  gKey('specialKey', 'r1', 8.00, 'Convert', [
    rect(),
    text('変換', '', { x: 0.5 }), // henkan
  ]),
  gKey('specialKey', 'r1', 9.00, 'KanaMode', [
    rect(),
    text('カタカナ', '', { x: 0.5, y: 0.4 }), // katakana
    text('ひらがな', '', { x: 0.5, y: 0.6 }), // hiragana
    text('ローマ字', '', { x: 0.5, y: 0.8 }), // romaji
  ]),
  gKey('specialKey', 'r1', 9.00, 'Lang1', [
    rect(),
    text('한/영', '', { x: 0.4 }), // han/yeong
  ]),
  gKey('specialKey', 'r1', 10.00, 'AltRight', [
    rect('',     { width: 1.25 }),
    rect('ergo', { width: 1.50 }),
    text('Alt', 'win gnu', nonIcon),
    text('⌥',   'mac'),
  ]),
  gKey('specialKey', 'r1', 11.50, 'MetaRight', [
    rect('',     { width: 1.25 }),
    rect('ergo', { width: 1.50 }),
    text('Win',   'win', nonIcon),
    text('Super', 'gnu', nonIcon),
    text('⌘',     'mac'),
  ]),
  gKey('specialKey', 'r5', 12.50, 'ContextMenu', [
    rect('',     { width: 1.25 }),
    rect('ergo'),
    text('☰'),
    text('☰', 'ol60'),
  ]),
  gKey('specialKey', 'r5', 13.75, 'ControlRight', [
    rect('', { width: 1.25 }),
    rect('ergo'),
    text('Ctrl', 'win gnu', nonIcon),
    text('⌃',    'mac'),
  ]),
]);

export const svgContent = `
  <svg viewBox="0 0 ${KEY_WIDTH * 15} ${KEY_WIDTH * 5}"
      xmlns="http://www.w3.org/2000/svg">
    <g id="row_AE"> ${numberRow}  </g>
    <g id="row_AD"> ${letterRow1} </g>
    <g id="row_AC"> ${letterRow2} </g>
    <g id="row_AB"> ${letterRow3} </g>
    <g id="row_AA"> ${baseRow}    </g>
  </svg>
`;
