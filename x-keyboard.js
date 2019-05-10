import { newKeyboardLayout, newKalamineLayout, isDeadKey }
  from './x-keyboard-layout.js';

// Useful links:
// https://www.w3.org/TR/uievents-code/
// https://commons.wikimedia.org/wiki/File:Physical_keyboard_layouts_comparison_ANSI_ISO_KS_ABNT_JIS.png


/**
 * Shadow DOM
 */

const joinAttrs = (defaults, attributes) => Object
  .entries(Object.assign(defaults, attributes))
  .map(([ id, value ]) => `${id}="${value}"`)
  .join(' ');

const rect = (className, attributes) => {
  const attrs = joinAttrs({
    width: 50, height: 50, rx: 5, ry: 5,
  }, attributes);
  return `<rect ${attrs} class="${className || ''}" />`;
};

const text = (value, className, attributes) => {
  const attrs = joinAttrs({
    width: 25, height: 25, x: 15, y: 42, 'text-anchor': 'middle',
  }, attributes);
  return `<text ${attrs} class="${className || ''}">${value}</text>`;
};

const keyRect = `${rect()} <g class="key" />`;
const keyAttr = (className, finger, offset, id) => `
  class="${className}" finger="${finger}" id="${id}"
  transform="translate(${offset || 0})"`;

const svg = `
  <svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg">
    <!-- number row -->
    <g id="row_AE" transform="translate(5,5)">
      <g class="left">
        <g ${keyAttr('specialKey', 'l5', 0, 'Escape')}>
          ${rect('ergo')}
          ${text('⎋', 'ergo')}
        </g>
        <g ${keyAttr('pinkyKey', 'l5', 0, 'Backquote')}>
          ${rect('specialKey jis')}
          ${rect('ansi alt iso ergo')}
          <!-- halfwidth/fullwidth/kanji (hankaku/zenkaku/kanji) -->
          ${text('半角', 'jis', { x: 25, y: 18 })}
          ${text('全角', 'jis', { x: 25, y: 30 })}
          ${text('漢字', 'jis', { x: 25, y: 42 })}
          <g class="ansi key" />
        </g>
        <g ${keyAttr('numberKey',  'l5',  60, 'Digit1')}>  ${keyRect} </g>
        <g ${keyAttr('numberKey',  'l4', 120, 'Digit2')}>  ${keyRect} </g>
        <g ${keyAttr('numberKey',  'l3', 180, 'Digit3')}>  ${keyRect} </g>
        <g ${keyAttr('numberKey',  'l2', 240, 'Digit4')}>  ${keyRect} </g>
        <g ${keyAttr('numberKey',  'l2', 300, 'Digit5')}>  ${keyRect} </g>
      </g>
      <g class="right">
        <g ${keyAttr('numberKey',  'r2', 360, 'Digit6')}>  ${keyRect} </g>
        <g ${keyAttr('numberKey',  'r2', 420, 'Digit7')}>  ${keyRect} </g>
        <g ${keyAttr('numberKey',  'r3', 480, 'Digit8')}>  ${keyRect} </g>
        <g ${keyAttr('numberKey',  'r4', 540, 'Digit9')}>  ${keyRect} </g>
        <g ${keyAttr('numberKey',  'r5', 600, 'Digit0')}>  ${keyRect} </g>
        <g ${keyAttr('pinkyKey',   'r5', 660, 'Minus')}>   ${keyRect} </g>
        <g ${keyAttr('pinkyKey',   'r5', 720, 'Equal')}>   ${keyRect} </g>
        <g ${keyAttr('pinkyKey',   'r5', 780, 'IntlYen')}> ${keyRect} </g>
        <g ${keyAttr('specialKey', 'r5', 780, 'Backspace')}>
          ${rect('ansi', { width: 110 })}
          ${rect('ol60', { height: 110, y: -60 })}
          ${rect('ol40 ol50')}
          ${rect('alt', { x: 60 })}
          ${text('⌫', 'ansi')}
          ${text('⌫', 'ergo')}
          ${text('⌫', 'alt', { x: 75 })}
        </g>
      </g>
    </g>
    <!-- letters, first row -->
    <g id="row_AD" transform="translate(5,65)">
      <g class="left">
        <g ${keyAttr('specialKey', 'l5', 0, 'Tab')}>
          ${rect('', { width: 80 })}
          ${rect('ergo')}
          ${text('↹')}
          ${text('↹', 'ergo')}
        </g>
        <g ${keyAttr('letterKey', 'l5',  90, 'KeyQ')}> ${keyRect} </g>
        <g ${keyAttr('letterKey', 'l4', 150, 'KeyW')}> ${keyRect} </g>
        <g ${keyAttr('letterKey', 'l3', 210, 'KeyE')}> ${keyRect} </g>
        <g ${keyAttr('letterKey', 'l2', 270, 'KeyR')}> ${keyRect} </g>
        <g ${keyAttr('letterKey', 'l2', 330, 'KeyT')}> ${keyRect} </g>
      </g>
      <g class="right">
        <g ${keyAttr('letterKey', 'r2', 390, 'KeyY')}>         ${keyRect} </g>
        <g ${keyAttr('letterKey', 'r2', 450, 'KeyU')}>         ${keyRect} </g>
        <g ${keyAttr('letterKey', 'r3', 510, 'KeyI')}>         ${keyRect} </g>
        <g ${keyAttr('letterKey', 'r4', 570, 'KeyO')}>         ${keyRect} </g>
        <g ${keyAttr('letterKey', 'r5', 630, 'KeyP')}>         ${keyRect} </g>
        <g ${keyAttr('pinkyKey',  'r5', 690, 'BracketLeft')}>  ${keyRect} </g>
        <g ${keyAttr('pinkyKey',  'r5', 750, 'BracketRight')}> ${keyRect} </g>
        <g ${keyAttr('pinkyKey',  'r5', 810, 'Backslash')}>
          ${rect('ansi', { width: 80 })}
          ${rect('iso ol60')}
          <g class="key" />
        </g>
      </g>
    </g>
    <!-- letters, second row -->
    <g id="row_AC" transform="translate(5,125)">
      <g class="left">
        <g ${keyAttr('specialKey', 'l5', 0, 'CapsLock')}>
          ${rect('', { width: 95 })}
          ${text('⇪', 'ansi')}
          ${text('英数', 'jis', { x: 25 })}
        </g>
        <g ${keyAttr('letterKey homeKey', 'l5', 105, 'KeyA')}> ${keyRect} </g>
        <g ${keyAttr('letterKey homeKey', 'l4', 165, 'KeyS')}> ${keyRect} </g>
        <g ${keyAttr('letterKey homeKey', 'l3', 225, 'KeyD')}> ${keyRect} </g>
        <g ${keyAttr('letterKey homeKey', 'l2', 285, 'KeyF')}> ${keyRect} </g>
        <g ${keyAttr('letterKey',         'l2', 345, 'KeyG')}> ${keyRect} </g>
      </g>
      <g class="right">
        <g ${keyAttr('letterKey',         'r2', 405, 'KeyH')}>      ${keyRect} </g>
        <g ${keyAttr('letterKey homeKey', 'r2', 465, 'KeyJ')}>      ${keyRect} </g>
        <g ${keyAttr('letterKey homeKey', 'r3', 525, 'KeyK')}>      ${keyRect} </g>
        <g ${keyAttr('letterKey homeKey', 'r4', 585, 'KeyL')}>      ${keyRect} </g>
        <g ${keyAttr('letterKey homeKey', 'r5', 645, 'Semicolon')}> ${keyRect} </g>
        <g ${keyAttr('pinkyKey',          'r5', 705, 'Quote')}>     ${keyRect} </g>
        <g ${keyAttr('specialKey',        'r5', 765, 'Enter')}>
          <path class="alt" d="M50,-60 h70 a5,5 0 0 1 5,5 v100 a5,5 0 0 1 -5,5 h-115 a5,5 0 0 1 -5,-5 v-40 a5,5 0 0 1 5,-5 h35 a5,5 1 0 0 5,-5 v-50 a5,5 0 0 1 5,-5 z" />
          <path class="iso" d="M50,-60 h70 a5,5 0 0 1 5,5 v100 a5,5 0 0 1 -5,5 h-55 a5,5 0 0 1 -5,-5 v-50 a5,5 1 0 0 -5,-5 h-5 a5,5 0 0 1 -5,-5 v-40 a5,5 0 0 1 5,-5 z" />
          ${rect('ansi', { width: 125 })}
          ${rect('ol60', { height: 110, y: -60 })}
          ${rect('ol40 ol50')}
          ${text('⏎', 'ansi alt ergo')}
          ${text('⏎', 'iso', { x: 75 })}
        </g>
      </g>
    </g>
    <!-- letters, third row -->
    <g id="row_AB" transform="translate(5,185)">
      <g class="left">
        <g ${keyAttr('specialKey', 'l5', 0, 'ShiftLeft')}>
          ${rect('ansi alt',  { width: 125 })}
          ${rect('iso',       { width:  65 })}
          ${rect('ol50 ol60', { height: 110, y: -60 })}
          ${rect('ol40')}
          ${text('⇧')}
          ${text('⇧', 'ergo')}
        </g>
        <g ${keyAttr('letterKey', 'l5',  75, 'IntlBackslash')}> ${keyRect} </g>
        <g ${keyAttr('letterKey', 'l5', 135, 'KeyZ')}>          ${keyRect} </g>
        <g ${keyAttr('letterKey', 'l4', 195, 'KeyX')}>          ${keyRect} </g>
        <g ${keyAttr('letterKey', 'l3', 255, 'KeyC')}>          ${keyRect} </g>
        <g ${keyAttr('letterKey', 'l2', 315, 'KeyV')}>          ${keyRect} </g>
        <g ${keyAttr('letterKey', 'l2', 375, 'KeyB')}>          ${keyRect} </g>
      </g>
      <g class="right">
        <g ${keyAttr('letterKey',  'r2', 435, 'KeyN')}>   ${keyRect} </g>
        <g ${keyAttr('letterKey',  'r2', 495, 'KeyM')}>   ${keyRect} </g>
        <g ${keyAttr('letterKey',  'r3', 555, 'Comma')}>  ${keyRect} </g>
        <g ${keyAttr('letterKey',  'r4', 615, 'Period')}> ${keyRect} </g>
        <g ${keyAttr('letterKey',  'r5', 675, 'Slash')}>  ${keyRect} </g>
        <g ${keyAttr('pinkyKey',   'r5', 735, 'IntlRo')}> ${keyRect} </g>
        <g ${keyAttr('specialKey', 'r5', 735, 'ShiftRight')}>
          ${rect('ansi',      { width: 155 })}
          ${rect('abnt',      { width:  95,  x:  60 })}
          ${rect('ol50 ol60', { height: 110, y: -60 })}
          ${rect('ol40')}
          ${text('⇧', 'ansi')}
          ${text('⇧', 'ergo')}
          ${text('⇧', 'abnt', { x: 75 })}
        </g>
      </g>
    </g>
    <!-- base row -->
    <g id="row_AA" transform="translate(5,245)">
      <g class="left">
        <g ${keyAttr('specialKey', 'l5', 0, 'ControlLeft')}>
          ${rect('', { width: 70 })}
          ${rect('ergo')}
          ${text('Ctrl', 'win gnu', { x: 10, 'text-anchor': 'left' })}
          ${text('⌃',    'mac')}
        </g>
        <g ${keyAttr('specialKey', 'l1', 80, 'MetaLeft')}>
          ${rect('',     { width: 70 })}
          ${rect('ergo', { width: 80 })}
          ${text('Win',   'win', { x: 10, 'text-anchor': 'left' })}
          ${text('Super', 'gnu', { x: 10, 'text-anchor': 'left' })}
          ${text('⌘',     'mac')}
        </g>
        <g ${keyAttr('specialKey', 'l1', 160, 'AltLeft')}>
          ${rect('',     { width: 70 })}
          ${rect('ergo', { width: 80 })}
          ${text('Alt', 'win gnu', { x: 10, 'text-anchor': 'left' })}
          ${text('⌥',   'mac')}
        </g>
        <g ${keyAttr('specialKey', 'l1', 240, 'Lang2')}>
          ${rect()}
          ${text('한자', '', { x: 25 })} <!-- hanja  -->
        </g>
        <g ${keyAttr('specialKey', 'l1', 240, 'NonConvert')}>
          ${rect()}
          ${text('無変換', '', { x: 25 })} <!-- muhenkan -->
        </g>
      </g>
      <g ${keyAttr('homeKey', 'm1', 240, 'Space')}>
        ${rect('ansi',      { width: 350 })}
        ${rect('ol60',      { width: 290, x: -60 })}
        ${rect('ol50 ol40', { width: 230 })}
        ${rect('ks',        { width: 230, x: 60 })}
        ${rect('jis',       { width: 170, x: 60 })}
      </g>
      <g class="right">
        <g ${keyAttr('specialKey', 'r1', 480, 'Convert')}>
          ${rect()}
          ${text('変換', '', { x: 25 })} <!-- henkan -->
        </g>
        <g ${keyAttr('specialKey', 'r1', 540, 'KanaMode')}>
          ${rect()}
          ${text('カタカナ', '', { x: 25, y: 18 })} <!-- katakana / hiragana / romaji -->
          ${text('ひらがな', '', { x: 25, y: 30 })}
          ${text('ローマ字', '', { x: 25, y: 42 })}
        </g>
        <g ${keyAttr('specialKey', 'r1', 540, 'Lang1')}>
          ${rect()}
          ${text('한/영', '', { x: 25 })} <!-- han/yeong -->
        </g>
        <g ${keyAttr('specialKey', 'r1', 600, 'AltRight')}>
          ${rect('',     { width: 70 })}
          ${rect('ergo', { width: 80 })}
          ${text('Alt', 'win gnu', { x: 10, 'text-anchor': 'left' })}
          ${text('⌥',   'mac')}
        </g>
        <g ${keyAttr('specialKey', 'r1', 680, 'MetaRight')}>
          ${rect('',     { width: 70 })}
          ${rect('ergo', { width: 80 })}
          ${text('Win',   'win', { x: 10, 'text-anchor': 'left' })}
          ${text('Super', 'gnu', { x: 10, 'text-anchor': 'left' })}
          ${text('⌘',     'mac')}
        </g>
        <g ${keyAttr('specialKey', 'r5', 760, 'ContextMenu')}>
          ${rect()}
          ${rect('ergo')}
          ${text('☰')}
          ${text('☰', 'ol60')}
        </g>
        <g ${keyAttr('specialKey', 'r5', 820, 'ControlRight')}>
          ${rect('', { width: 70 })}
          ${rect('ergo')}
          ${text('Ctrl', 'win gnu', { x: 10, 'text-anchor': 'left' })}
          ${text('⌃',    'mac')}
        </g>
      </g>
    </g>
  </svg>
`;

const css = `
  rect, path {
    stroke: #666;
    stroke-width: .5px;
    fill: none;
  }
  .specialKey,
  .specialKey rect,
  .specialKey path {
    fill: #e4e4e4;
  }

  text {
    fill: #333;
    font: normal 20px sans-serif;
    text-align: center;
  }

  #Backspace text { font-size: 12px; }

  /**
   * Keyboard Geometry: ANSI, ISO, ABNT, ALT
   */

  #Escape { display: none; }

  /* Backslash & Enter */
  #Enter path.alt,
  #Enter     .iso,
  #Backslash .iso,
  .alt #Enter rect.ansi,
  .iso #Enter rect.ansi,
  .iso #Enter text.ansi,
  .alt #Backslash .ansi,
  .iso #Backslash .ansi { display: none; }
  #Enter text.ansi,
  .alt #Enter     .alt,
  .iso #Enter     .iso,
  .iso #Backslash .iso { display: block; }
  .iso #Backslash,
  .alt #Backslash {
    transform: translate(765px, 60px);
  }

  /* Backspace & IntlYen */
  #IntlYen, #Backspace .alt,
  .intlYen  #Backspace .ansi { display: none; }
  .intlYen  #Backspace .alt,
  .intlYen  #IntlYen { display: block; }

  /* ShiftLeft & IntlBackslash */
  #IntlBackslash, #ShiftLeft .iso,
  .intlBackslash  #ShiftLeft .ansi { display: none; }
  .intlBackslash  #ShiftLeft .iso,
  .intlBackslash  #IntlBackslash { display: block; }

  /* ShiftRight & IntlRo */
  #IntlRo, #ShiftRight .abnt,
  .intlRo  #ShiftRight .ansi { display: none; }
  .intlRo  #ShiftRight .abnt,
  .intlRo  #IntlRo { display: block; }

  /**
   * Korean & Japanese Input Systems
   */

  #NonConvert, #Convert, #KanaMode,
  #Lang1, #Lang2,
  #Space .jis,
  #Space .ks,
  .ks  #Space .ansi,
  .ks  #Space .jis,
  .jis #Space .ansi,
  .jis #Space .ks { display: none; }
  .ks  #Space .ks,
  .jis #NonConvert, .jis #Convert, .jis #KanaMode,
  .ks #Lang1, .ks #Lang2,
  .jis #Space .jis { display: block; }

  #Backquote .jis,
  #CapsLock  .jis,
  .jis #Backquote .ansi,
  .jis #CapsLock  .ansi { display: none; }
  .jis #Backquote .jis,
  .jis #CapsLock .jis { display: block; }

  #Lang1 text,
  #Lang2 text,
  #Convert text,
  #NonConvert text,
  .jis #CapsLock text { font-size: 14px; }
  #KanaMode text,
  .jis #Backquote text { font-size: 10px; }

  /**
   * Windows / MacOSX / Linux modifiers
   */

  .specialKey .win,
  .specialKey .gnu {
    display: none;
    font-size: 14px;
  }

  /* display MacOSX by default */
  [platform="gnu"] .specialKey .win,
  [platform="gnu"] .specialKey .mac,
  [platform="win"] .specialKey .gnu,
  [platform="win"] .specialKey .mac { display: none; }
  [platform="mac"] .specialKey .mac,
  [platform="gnu"] .specialKey .gnu,
  [platform="win"] .specialKey .win { display: block; }

  /* swap Alt/Meta for MacOSX */
  [platform="gnu"] #MetaLeft,
  [platform="win"] #MetaLeft,
                   #AltLeft   { transform: translate(80px, 0); }
  [platform="gnu"] #AltLeft,
  [platform="win"] #AltLeft,
                   #MetaLeft  { transform: translate(160px, 0); }
  [platform="gnu"] #AltRight,
  [platform="win"] #AltRight,
                   #MetaRight { transform: translate(600px, 0); }
  [platform="gnu"] #MetaRight,
  [platform="win"] #MetaRight,
                   #AltRight  { transform: translate(680px, 0); }

  /**
   * Ortholinear
   */

  #Space      .ol60,
  #Space      .ol50,
  #Space      .ol40,
  .specialKey .ergo,
  .specialKey .ol60,
  .specialKey .ol50,
  .specialKey .ol40,
  .ergo #CapsLock,
  .ergo #Space      rect,
  .ergo #Backslash  rect,
  .ergo .specialKey rect,
  .ergo .specialKey text { display: none; }
  .ol50 #Escape,
  .ol40 #Escape,
  .ol60 #Space      .ol60,
  .ol50 #Space      .ol50,
  .ol40 #Space      .ol40,
  .ol60 #Backslash  .ol60,
  .ol60 .specialKey .ol60,
  .ol50 .specialKey .ol50,
  .ol40 .specialKey .ol40,
  .ergo .specialKey .ergo { display: block; }

  .ol50 .pinkyKey, .ol50 #ContextMenu,
  .ol40 .pinkyKey, .ol40 #ContextMenu,
  .ol40 #row_AE .numberKey { display: none; }

  .ergo #row_AE       { transform: translate(  95px,   5px ); }
  .ergo #row_AD       { transform: translate(  65px,  65px ); }
  .ergo #row_AC       { transform: translate(  50px, 125px ); }
  .ergo #row_AB       { transform: translate(  20px, 185px ); }

  .ergo #Tab          { transform: translate(  30px,   0px ); }
  .ergo #ShiftLeft    { transform: translate(  75px,   0px ); }
  .ergo #ControlLeft  { transform: translate(  90px,   0px ); }
  .ergo #MetaLeft     { transform: translate( 150px,   0px ); }
  .ergo #AltLeft      { transform: translate( 240px,   0px ); }
  .ergo #Space        { transform: translate( 330px,   0px ); }
  .ergo #AltRight     { transform: translate( 570px,   0px ); }
  .ergo #MetaRight    { transform: translate( 660px,   0px ); }
  .ergo #ControlRight { transform: translate( 750px,   0px ); }

  .ol60 .left         { transform: translate(-60px,    0px ); }
  .ol60 #ControlRight { transform: translate( 810px,   0px ); }
  .ol60 #ShiftRight   { transform: translate( 795px,   0px ); }
  .ol60 #ContextMenu  { transform: translate( 750px,   0px ); }
  .ol60 #Backslash    { transform: translate( 690px, 120px ); }
  .ol60 #Backspace    { transform: translate( 300px,  60px ); }
  .ol60 #Enter        { transform: translate( 345px,  60px ); }

  .ol50 #Backspace    { transform: translate( 660px,   0px ); }
  .ol50 #Enter        { transform: translate( 705px, -60px ); }

  .ol40 #Escape       { transform: translate(   0px, 120px ); }
  .ol40 #Backspace    { transform: translate( 660px,  60px ); }
  .ol40 #Enter        { transform: translate( 705px,   0px ); }

  [platform="gnu"].ergo .specialKey .win,
  [platform="gnu"].ergo .specialKey .mac,
  [platform="win"].ergo .specialKey .gnu,
  [platform="win"].ergo .specialKey .mac { display: none; }
  .ergo .specialKey .mac,
  [platform="gnu"].ergo .specialKey .gnu,
  [platform="win"].ergo .specialKey .win { display: block; }

  /* swap Alt/Meta for MacOSX */
  [platform="gnu"].ergo #MetaLeft,
  [platform="win"].ergo #MetaLeft,
                  .ergo #AltLeft   { transform: translate(150px, 0); }
  [platform="gnu"].ergo #AltLeft,
  [platform="win"].ergo #AltLeft,
                  .ergo #MetaLeft  { transform: translate(240px, 0); }
  [platform="gnu"].ergo #AltRight,
  [platform="win"].ergo #AltRight,
                  .ergo #MetaRight { transform: translate(570px, 0); }
  [platform="gnu"].ergo #MetaRight,
  [platform="win"].ergo #MetaRight,
                  .ergo #AltRight  { transform: translate(660px, 0); }

  /**
   * Color Theme
   */

  g:target rect, .press rect,
  g:target path, .press path {
    fill: #aad;
  }

  [theme="reach"] .pinkyKey  rect { fill: hsl(  0, 100%, 90%); }
  [theme="reach"] .numberKey rect { fill: hsl( 42, 100%, 90%); }
  [theme="reach"] .letterKey rect { fill: hsl(122, 100%, 90%); }
  [theme="reach"] .homeKey   rect { fill: hsl(122, 100%, 75%); }
  [theme="reach"] .press     rect { fill: #aaf; }

  [theme="hints"] [finger="m1"] rect { fill: hsl(  0, 100%, 95%); }
  [theme="hints"] [finger="l2"] rect { fill: hsl( 42, 100%, 85%); }
  [theme="hints"] [finger="r2"] rect { fill: hsl( 61, 100%, 85%); }
  [theme="hints"] [finger="l3"] rect,
  [theme="hints"] [finger="r3"] rect { fill: hsl(136, 100%, 85%); }
  [theme="hints"] [finger="l4"] rect,
  [theme="hints"] [finger="r4"] rect { fill: hsl(200, 100%, 85%); }
  [theme="hints"] [finger="l5"] rect,
  [theme="hints"] [finger="r5"] rect { fill: hsl(230, 100%, 85%); }
  [theme="hints"] .specialKey   rect,
  [theme="hints"] .specialKey   path { fill: #e4e4e4; }
  [theme="hints"] .hint         rect { fill: #a33; }
  [theme="hints"] .press        rect { fill: #335; }
  [theme="hints"] .press        text { fill: #fff; }
  [theme="hints"] .hint text {
    font-weight: bold;
    fill: white;
  }

  /* dimmed AltGr & bold dead keys */
  .level3, .level4 { fill: blue; opacity: .4; }
  .level5, .level6 { fill: red; }
  .deadKey {
    fill: red;
    font-weight: bold;
  }

  /* hide Level4 (Shift+AltGr) unless AltGr is pressed */
  .level4        { display: none; }
  .altgr .level4 { display: block; }

  /* highlight AltGr & Dead Keys */
  .dk .level1, .altgr .level1,
  .dk .level2, .altgr .level2 { opacity: 0.25; }
  .dk .level5, .altgr .level3,
  .dk .level6, .altgr .level4 { opacity: 1; }
  .dk .level3,
  .dk .level4 { display: none; }
`;

const template = document.createElement('template');
template.innerHTML = `<style>${css}</style>${svg}`;


/**
 * Keyboard Layout
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

const drawKey = (element, keyMap) => {
  const key = keyMap[element.parentNode.id];
  if (!key) {
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
  const [ base, shift, alt, salt ] = key;
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
};

const drawDK = (element, keyMap, deadKey) => {
  const key = keyMap[element.parentNode.id];
  if (!key) {
    return;
  }
  const alt0 = deadKey[key[0]];
  const alt1 = deadKey[key[1]];
  element.querySelector('.level5').textContent = alt0 || '';
  element.querySelector('.level6').textContent = altUpperChar(alt0, alt1);
};

const setFingerAssignment = (root, ansiStyle) => {
  (ansiStyle
    ? ['l5', 'l4', 'l3', 'l2', 'l2', 'r2', 'r2', 'r3', 'r4', 'r5']
    : ['l5', 'l5', 'l4', 'l3', 'l2', 'l2', 'r2', 'r2', 'r3', 'r4'])
    .forEach((attr, i) => {
      root.getElementById(`Digit${(i + 1) % 10}`).setAttribute('finger', attr);
    });
};

const getKeyChord = (root, key) => {
  if (!key || !key.id) {
    return [];
  }
  const element = root.getElementById(key.id);
  const chord = [ element ];
  if (key.level > 1) { // altgr
    chord.push(root.getElementById('AltRight'));
  }
  if (key.level % 2) { // shift
    chord.push(root.getElementById(element.getAttribute('finger')[0] === 'l'
      ? 'ShiftRight' : 'ShiftLeft'));
  }
  return chord;
};

const guessPlatform = () => {
  const p = navigator.platform.toLowerCase();
  if (p.startsWith('win')) {
    return 'win';
  }
  if (p.startsWith('mac')) {
    return 'mac';
  }
  if (p.startsWith('linux')) {
    return 'linux';
  }
  return '';
};


/**
 * Custom Element
 */

class Keyboard extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));
    this._state = {
      geometry: this.getAttribute('geometry') || '',
      platform: this.getAttribute('platform') || '',
      theme:    this.getAttribute('theme')    || '',
      layout:   newKeyboardLayout(),
    };
    this.geometry = this._state.geometry;
    this.platform = this._state.platform;
    this.theme    = this._state.theme;
  }

  /**
   * User Interface: color theme, shape, layout.
   */

  get theme() {
    return this._state.theme;
  }

  set theme(value) {
    this._state.theme = value;
    this.root.querySelector('svg').setAttribute('theme', value);
  }

  get geometry() {
    return this._state.geometry;
  }

  set geometry(value) {
    /**
     * Supported geometries (besides ANSI):
     * - Euro-style [Enter] key:
     *     ISO  = ANSI + IntlBackslash
     *     ABNT = ISO + IntlRo + NumpadComma
     *     JIS  = ISO + IntlRo + IntlYen - IntlBackslash
     *                + NonConvert + Convert + KanaMode
     * - Russian-style [Enter] key:
     *     ALT = ANSI - Backslash + IntlYen
     *     KS = ALT + Lang1 + Lang2
     * - Ortholinear:
     *     OL60 = TypeMatrix 2030
     *     OL50 = OLKB Preonic
     *     OL40 = OLKB Planck
     */
    const supportedShapes = {
      alt:  'alt intlYen',
      ks:   'alt intlYen ks',
      jis:  'iso intlYen intlRo jis',
      abnt: 'iso intlBackslash intlRo',
      iso:  'iso intlBackslash',
      ansi: '',
      ol60: 'ergo ol60',
      ol50: 'ergo ol50',
      ol40: 'ergo ol40',
    };
    this._state.geometry = value in supportedShapes ? value : '';
    const geometry = this._state.geometry || this.layout.geometry || 'ansi';
    const shape = supportedShapes[geometry];
    this.root.querySelector('svg').className.baseVal = shape;
    setFingerAssignment(this.root, !shape.startsWith('iso'));
  }

  get platform() {
    return this._state.platform;
  }

  set platform(value) {
    const supportedPlatforms = {
      win: 'win',
      mac: 'mac',
      linux: 'gnu',
    };
    this._state.platform = value in supportedPlatforms ? value : '';
    const platform = this._state.platform || guessPlatform();
    this.layout.platform = platform;
    this.root.querySelector('svg')
      .setAttribute('platform', supportedPlatforms[platform]);
  }

  get layout() {
    return this._state.layout;
  }

  set layout(value) {
    this._state.layout = value;
    this._state.layout.platform = this.platform;
    this.geometry = this._state.geometry;
    Array.from(this.root.querySelectorAll('.key'))
      .filter(key => !key.classList.contains('specialKey'))
      .forEach(key => drawKey(key, value.keyMap));
  }

  setKalamineLayout(keyMap, deadKeys, geometry) {
    this.layout = newKalamineLayout(keyMap, deadKeys, geometry);
  }

  setKeyboardLayout(keyMap, deadKeys, geometry) {
    this.layout = newKeyboardLayout(keyMap, deadKeys, geometry);
  }

  /**
   * KeyboardEvent helpers
   */

  keyDown(keyCode) {
    const code = keyCode.replace(/^OS/, 'Meta'); // https://bugzil.la/1264150
    if (!code) {
      return '';
    }
    const element = this.root.getElementById(code);
    if (!element) {
      return '';
    }
    element.classList.add('press');
    const dk = this.layout.pendingDK;
    const rv = this.layout.keyDown(code);
    if (this.layout.modifiers.altgr) {
      this.root.querySelector('svg').classList.add('altgr');
    }
    if (dk) { // a dead key has just been unlatched, hide all key hints
      if (!element.classList.contains('specialKey')) {
        this.root.querySelector('svg').classList.remove('dk');
        Array.from(this.root.querySelectorAll('.dk'))
          .forEach((span) => {
            span.textContent = '';
          });
      }
    } else if (this.layout.pendingDK) { // show hints for this dead key
      Array.from(this.root.querySelectorAll('.key'))
        .forEach(key => drawDK(key, this.layout.keyMap, this.layout.pendingDK));
      this.root.querySelector('svg').classList.add('dk');
    }
    return rv;
  }

  keyUp(keyCode) {
    const code = keyCode.replace(/^OS/, 'Meta'); // https://bugzil.la/1264150
    if (!code) {
      return;
    }
    const element = this.root.getElementById(code);
    if (!element) {
      return;
    }
    element.classList.remove('press');
    this.layout.keyUp(code);
    if (!this.layout.modifiers.altgr) {
      this.root.querySelector('svg').classList.remove('altgr');
    }
  }

  /**
   * Keyboard hints
   */

  clearStyle() {
    Array.from(this.root.querySelectorAll('[style]'))
      .forEach(element => element.removeAttribute('style'));
    Array.from(this.root.querySelectorAll('.press'))
      .forEach(element => element.classList.remove('press'));
  }

  showKeys(chars, cssText) {
    this.clearStyle();
    this.layout.getKeySequence(chars)
      .forEach((key) => {
        this.root.getElementById(key.id).style.cssText = cssText;
      });
  }

  showHint(keyObj) {
    let hintClass = '';
    Array.from(this.root.querySelectorAll('.hint'))
      .forEach(key => key.classList.remove('hint'));
    getKeyChord(this.root, keyObj).forEach((key) => {
      key.classList.add('hint');
      hintClass += `${key.getAttribute('finger')} `;
    });
    return hintClass;
  }

  pressKey(keyObj) {
    this.clearStyle();
    getKeyChord(this.root, keyObj)
      .forEach((key) => {
        key.classList.add('press');
      });
  }

  pressKeys(str, duration) {
    function* pressKeys(keys) {
      for (const key of keys) { // eslint-disable-line
        yield key;
      }
    }
    const it = pressKeys(this.layout.getKeySequence(str));
    const send = setInterval(() => {
      const { value, done } = it.next();
      // this.showHint(value);
      this.pressKey(value);
      if (done) {
        clearInterval(send);
      }
    }, duration || 250);
  }
}

customElements.define('x-keyboard', Keyboard);
