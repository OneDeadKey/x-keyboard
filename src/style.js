import {
  KEY_WIDTH,
  KEY_PADDING,
  KEY_BG,
  KEY_COLOR,
  KEY_COLOR_L3,
  KEY_COLOR_L5,
  DEAD_KEY_COLOR,
  SPECIAL_KEY_BG,
} from './constants.js';

const translate = (x = 0, y = 0, offset) => {
  const dx = KEY_WIDTH * x + (offset ? KEY_PADDING : 0);
  const dy = KEY_WIDTH * y + (offset ? KEY_PADDING : 0);
  return `{ transform: translate(${dx}px, ${dy}px); }`;
};

const main = `
  rect, path {
    stroke: #666;
    stroke-width: .5px;
    fill: ${KEY_BG};
  }
  .specialKey,
  .specialKey rect,
  .specialKey path {
    fill: ${SPECIAL_KEY_BG};
  }
  text {
    fill: ${KEY_COLOR};
    font: normal 20px sans-serif;
    text-align: center;
  }
  #Backspace text {
    font-size: 12px;
  }
`;

// keyboard geometry: ANSI, ISO, ABNT, ALT
const classicGeometry = `
  #Escape { display: none; }

  #row_AE ${translate(0, 0, true)}
  #row_AD ${translate(0, 1, true)}
  #row_AC ${translate(0, 2, true)}
  #row_AB ${translate(0, 3, true)}
  #row_AA ${translate(0, 4, true)}

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
  .alt #Backslash ${translate(12.75, 1)}

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
`;

// ortholinear geometry: TypeMatrix (60%), OLKB (50%, 40%)
const orthoGeometry = `
  .specialKey .ergo,
  .specialKey .ol60,
  .specialKey .ol50,
  .specialKey .ol40,
  #Space      .ol60,
  #Space      .ol50,
  #Space      .ol40,
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

  .ergo #row_AE       ${translate(1.50, 0, true)}
  .ergo #row_AD       ${translate(1.00, 1, true)}
  .ergo #row_AC       ${translate(0.75, 2, true)}
  .ergo #row_AB       ${translate(0.25, 3, true)}

  .ergo #Tab          ${translate(0.50)}
  .ergo #ShiftLeft    ${translate(1.25)}
  .ergo #ControlLeft  ${translate(1.50)}
  .ergo #MetaLeft     ${translate(2.50)}
  .ergo #AltLeft      ${translate(4.00)}
  .ergo #Space        ${translate(5.50)}
  .ergo #AltRight     ${translate(9.00)}
  .ergo #MetaRight    ${translate(10.5)}
  .ergo #ControlRight ${translate(12.5)}

  .ol60 .left         ${translate(-1.00)}
  .ol60 #ControlRight ${translate(13.50)}
  .ol60 #ShiftRight   ${translate(13.25)}
  .ol60 #ContextMenu  ${translate(12.50)}
  .ol60 #Backslash    ${translate(11.50, 2)}
  .ol60 #Backspace    ${translate(5.00, 1)}
  .ol60 #Enter        ${translate(5.75, 1)}

  .ol50 #Backspace    ${translate(11.00)}
  .ol50 #Enter        ${translate(11.75, -1)}

  .ol40 #Escape       ${translate(0, 2)}
  .ol40 #Backspace    ${translate(11.00, 1)}
  .ol40 #Enter        ${translate(11.75, 0)}

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
                  .ergo #AltLeft   ${translate(2.5)}
  [platform="gnu"].ergo #AltLeft,
  [platform="win"].ergo #AltLeft,
                  .ergo #MetaLeft  ${translate(4.0)}
  [platform="gnu"].ergo #AltRight,
  [platform="win"].ergo #AltRight,
                  .ergo #MetaRight ${translate(9.5)}
  [platform="gnu"].ergo #MetaRight,
  [platform="win"].ergo #MetaRight,
                  .ergo #AltRight  ${translate(11.0)}
`;

// Korean & Japanese input systems
const cjkKeys = `
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
`;

// Windows / MacOSX / Linux modifiers
const modifiers = `
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
  [platform="win"] #MetaLeft,  #AltLeft   ${translate(1.25)}
  [platform="gnu"] #AltLeft,
  [platform="win"] #AltLeft,   #MetaLeft  ${translate(2.50)}
  [platform="gnu"] #AltRight,
  [platform="win"] #AltRight,  #MetaRight ${translate(10.00)}
  [platform="gnu"] #MetaRight,
  [platform="win"] #MetaRight, #AltRight  ${translate(11.25)}
`;

// color themes
const themes = `
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
  [theme="hints"] .specialKey   path { fill: ${SPECIAL_KEY_BG}; }
  [theme="hints"] .hint         rect { fill: #a33; }
  [theme="hints"] .press        rect { fill: #335; }
  [theme="hints"] .press        text { fill: #fff; }
  [theme="hints"] .hint text {
    font-weight: bold;
    fill: white;
  }

  /* dimmed AltGr & bold dead keys */
  .level3, .level4 { fill: ${KEY_COLOR_L3}; opacity: .4; }
  .level5, .level6 { fill: ${KEY_COLOR_L5}; }
  .deadKey {
    fill: ${DEAD_KEY_COLOR};
    font-size: 14px;
  }
  .diacritic  {
    font-size: 20px;
    font-weight: bolder;
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

// export full stylesheet
const style = `
  ${main}
  ${classicGeometry}
  ${orthoGeometry}
  ${cjkKeys}
  ${modifiers}
  ${themes}
`;
export default style;
