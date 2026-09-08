import {
  KEY_WIDTH,
  KEY_PADDING,
} from './geometry.js';

const translate = (x = 0, y = 0, offset) => {
  const dx = KEY_WIDTH * x + (offset ? KEY_PADDING : 0);
  const dy = KEY_WIDTH * y + (offset ? KEY_PADDING : 0);
  return `{ transform: translate(${dx}px, ${dy}px); }`;
};

const themes = `
  svg, :root {
    color-scheme: light dark;

    --key-txt:    #333;
    --key-fg:     #666;
    --key-bg:     #f8f8f8;
    --special-bg: #e4e4e4;
    --target-bg:  #aad;
    --hint-bg:    #a33;
    --press-bg:   #335;
    --press-fg:   #fff;

    --altgr-txt:  blue;
    --1dk-txt:    green;
    --dk-txt:     red;

    --bar-bg:    hsl(-90deg, 100%, 90%);
    --col0-bg:   hsl(-90deg, 100%, 90%);
    --col1-bg:   hsl(200deg, 100%, 85%);
    --col2-bg:   hsl(136deg, 100%, 85%);
    --col3-bg:   hsl( 60deg, 100%, 85%);
    --col4-bg:   hsl( 30deg, 100%, 90%);
    --col4-bg:   hsl(-20deg, 100%, 90%);

    --pinky-bg:  hsl(-90deg,  70%, 90%);
    --number-bg: hsl(295deg, 100%, 95%);
    --letter-bg: hsl(222deg, 100%, 95%);
    --home-bg:   hsl(222deg, 100%, 90%);
  }

  @media (prefers-color-scheme: dark) { svg, :root {
    --key-txt:    #bbb;
    --key-fg:     #777;
    --key-bg:     #4d4d4d;
    --special-bg: #333;
    --target-bg:  #558;
    --press-bg:   #449;

    --altgr-txt:  #99f;
    --1dk-txt:    #6d6;
    --dk-txt:     #f44;

    --bar-bg:    hsl(-90deg, 25%, 35%);
    --col0-bg:   hsl(-90deg, 25%, 50%);
    --col1-bg:   hsl(225deg, 25%, 40%);
    --col2-bg:   hsl(135deg, 25%, 40%);
    --col3-bg:   hsl( 40deg, 27%, 48%);
    --col4-bg:   hsl(330deg, 25%, 53%);

    --pinky-bg:  hsl(-90deg, 10%, 40%);
    --number-bg: hsl(280deg, 10%, 34%);
    --letter-bg: hsl(220deg, 15%, 35%);
    --home-bg:   hsl(225deg, 30%, 30%);
  }}

  rect, path {
    fill:   var(--key-bg);
    stroke: var(--key-fg);
    stroke-width: .5px;
  }
  .specialKey,
  .specialKey rect,
  .specialKey path { fill: var(--special-bg); }

  g:target rect, .press rect,
  g:target path, .press path { fill: var(--target-bg); }

  text {
    font: normal 20px sans-serif;
    fill: var(--key-txt);
    text-shadow: 1px 1px var(--key-bg);
    text-align: center;
  }
  .level3, .level4      { fill: var(--altgr-txt); }
  .level5, .level6, .dk { fill: var(--1dk-txt); }
  .deadKey              { fill: var(--dk-txt); }

  [theme="hints"] {
    [finger="m1"] rect { fill: var(--bar-bg);  }
    [finger="l2"] rect,
    [finger="r2"] rect { fill: var(--col4-bg); }
    [finger="l3"] rect,
    [finger="r3"] rect { fill: var(--col3-bg); }
    [finger="l4"] rect,
    [finger="r4"] rect { fill: var(--col2-bg); }
    [finger="l5"] rect,
    [finger="r5"] rect { fill: var(--col1-bg); }

    [finger="l5"].pinkyKey rect { fill: url(#outerLeft); }
    [finger="l2"].innerKey rect { fill: url(#innerLeft); }
    [finger="r2"].innerKey rect { fill: url(#innerRight); }
    [finger="r5"].pinkyKey rect { fill: url(#outerRight); }

    .specialKey rect,
    .specialKey path { fill: var(--special-bg); } /* duplicate? */
    .press      rect { fill: var(--press-bg);   }
    .press      text { fill: var(--press-fg);   }
    .hint       rect { fill: var(--hint-bg);    }
    .hint text {
      font-weight: bold;
      fill: var(--press-fg);
    }
  }

  [theme="reach"] {
    .pinkyKey  rect { fill: var(--pinky-bg);  } /* disabled on ergol.org */
    .numberKey rect { fill: var(--number-bg); }
    .letterKey rect { fill: var(--letter-bg); }
    .homeKey   rect { fill: var(--home-bg);   }
    .press     rect { fill: var(--bar-bg);    } /* duplicate? */
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

  /* Backslash + Enter */
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
  .iso #Backslash ${translate(12.75, 1)}
  .alt #Backslash ${translate(13.0, -1)}

  /* Backspace + IntlYen */
  #IntlYen, #Backspace .alt,
  .intlYen  #Backspace .ansi { display: none; }
  .intlYen  #Backspace .alt,
  .intlYen  #IntlYen { display: block; }

  /* ShiftLeft + IntlBackslash */
  #IntlBackslash, #ShiftLeft .iso,
  .intlBackslash  #ShiftLeft .ansi { display: none; }
  .intlBackslash  #ShiftLeft .iso,
  .intlBackslash  #IntlBackslash { display: block; }

  /* ShiftRight + IntlRo */
  #IntlRo, #ShiftRight .abnt,
  .intlRo  #ShiftRight .ansi { display: none; }
  .intlRo  #ShiftRight .abnt,
  .intlRo  #IntlRo { display: block; }
`;

// ortholinear geometry: TypeMatrix (60%), OLKB (50%, 40%)
const orthoGeometry = `
  .specialKey   .ergo,
  .specialKey   .ol60,
  .specialKey   .ol40,
  #Space        .ol60,
  #Space        .ol40,
  #Backquote    .ol60,
  #BracketRight .ol60,
  #Equal        .ol60,
  .ergo #CapsLock,
  .ergo #Space      rect,
  .ergo #Backslash  rect,
  .ergo .specialKey rect,
  .ergo .specialKey text { display: none; }
  .ergo #Escape,
  .ol60 #Space        .ol60,
  .ol40 #Space        .ol40,
  .ol60 #Backquote    .ol60,
  .ol60 #BracketRight .ol60,
  .ol60 #Backslash    .ol60,
  .ol60 #Equal        .ol60,
  .ol60 .specialKey   .ol60,
  .ol40 .specialKey   .ol40,
  .ergo .specialKey   .ergo { display: block; }

  .ol40 .pinkyKey,
  .ol40 #row_AE .numberKey { display: none; }

  .ol60 #row_AE ${translate(1.50, 0, true)}
  .ol60 #row_AD ${translate(1.00, 1, true)}
  .ol60 #row_AC ${translate(0.75, 2, true)}
  .ol60 #row_AB ${translate(0.25, 3, true)}

  .ol40 #row_AD ${translate(0.875, 0.5, true)}
  .ol40 #row_AC ${translate(0.625, 1.5, true)}
  .ol40 #row_AB ${translate(0.125, 2.5, true)}
  .ol40 #row_AA ${translate(-0.125, 3.5, true)}

  .ergo .left         ${translate(-0.25)}
  .ergo .right        ${translate(0.25)}
  .ergo #Space        ${translate(5.5)}
  .ergo #ShiftLeft    ${translate(4, 1)}
  .ergo #Tab          ${translate(0.25, 0.5)}

  .ol60 .left         ${translate(-1.25)}
  .ol60 #Escape       ${translate(6.125, 0.5)}
  .ol60 #Enter        ${translate(5.375, 0.5)}
  .ol60 #Backspace    ${translate(4.625, 1.5)}
  .ol60 #Backquote    ${translate(0, 0.5)}
  .ol60 #IntlBackslash ${translate(1.25, -0.5)}
  .ol60 #Minus        ${translate(11.0, 0.5)}
  .ol60 #Equal        ${translate(12.0, 0.5)}
  .ol60 #BracketLeft  ${translate(11.5, 0.5)}
  .ol60 #BracketRight ${translate(12.5, 0.5)}
  .ol60 #Quote        ${translate(11.75, 0.5)}
  .ol60 #Backslash    ${translate(12.5, 1.5)}
  .ol60 #IntlBackslash { display: block; }

  .ol40 #Escape       ${translate(1.125, 2)}
  .ol40 #Backspace    ${translate(12.375, 1)}
  .ol40 #Enter        ${translate(11.75, 0.5)}
`;

// Korean + Japanese input systems
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
  [platform="win"] #AltLeft,   #MetaLeft  ${translate(2.5)}
  [platform="gnu"] #AltRight,
  [platform="win"] #AltRight,  #MetaRight ${translate(10.0)}
  [platform="gnu"] #MetaRight,
  [platform="win"] #MetaRight, #AltRight  ${translate(11.25)}

  /* only show the left Shift and right Option key for ergo layouts */
  .ergo #MetaLeft,
  .ergo #MetaRight,
  .ergo #ControlLeft,
  .ergo #ControlRight,
  .ergo #ContextMenu,
  .ergo #AltLeft,
  .ergo #ShiftRight { display: none; }

  .ergo #AltRight { display: block; }
  .ergo #AltRight ${translate(9.25)}
  .ergo #AltRight .win,
  .ergo #AltRight .gnu { display: none; }
  .ergo #AltRight .mac { display: block; }
`;

// keymap layers
const layers = `
  /* dimmed AltGr + bold dead keys */
  .deadKey {
    font-size: 14px;
  }
  .diacritic {
    font-size: 20px;
    font-weight: bolder;
  }

  .layers-odk .level3,
  .layers-odk .level4       { display: none; }
  .layers-odk.altgr .level3,
  .layers-odk.altgr .level4 { display: block; }

  .layers-altgr .level5,
  .layers-altgr .level6 { display: none; }

  .layers-mixed .level5 { transform: translate(0, -22.8px); }
  .layers-mixed .level6 { display: none; }

  /* hide Level4 (Shift+AltGr) unless AltGr is pressed */
  .level4        { display: none; }
  .altgr .level4 { display: block; }

  .altgr .level5,
  .altgr .level6 { display: none; }

  /* hide Level6 (Shift+AltGr) */
  .level6        { display: none; }

  /* hide dk1 and dk2 unless a dead key is pressed */
  .dk1, .dk2     { display: none; }
  .dk .dk1,
  .dk .dk2       { display: block; }

  /* highlight AltGr + Dead Keys */
  .dk .level1, .altgr .level1,
  .dk .level2, .altgr .level2 { opacity: 0.25; }
  .dk .dk1, .altgr .level3,
  .dk .dk2, .altgr .level4 { opacity: 1; }
  .dk .level3, .dk level4,
  .dk .level5, .dk level6 { display: none; }
`;

// export full stylesheet
const style = `
  ${themes}
  ${classicGeometry}
  ${orthoGeometry}
  ${cjkKeys}
  ${modifiers}
  ${layers}
`;
export default style;
