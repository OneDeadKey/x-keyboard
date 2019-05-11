const keyBG = 'none';
const specialKeyBG = '#e4e4e4';

const main = `
  rect, path {
    stroke: #666;
    stroke-width: .5px;
    fill: ${keyBG};
  }
  .specialKey,
  .specialKey rect,
  .specialKey path {
    fill: ${specialKeyBG};
  }
  text {
    fill: #333;
    font: normal 20px sans-serif;
    text-align: center;
  }
  #Backspace text { font-size: 12px; }
`;

// keyboard geometry: ANSI, ISO, ABNT, ALT
const classicGeometry = `
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
  [platform="win"] #MetaLeft,  #AltLeft   { transform: translate( 80px, 0); }
  [platform="gnu"] #AltLeft,
  [platform="win"] #AltLeft,   #MetaLeft  { transform: translate(160px, 0); }
  [platform="gnu"] #AltRight,
  [platform="win"] #AltRight,  #MetaRight { transform: translate(600px, 0); }
  [platform="gnu"] #MetaRight,
  [platform="win"] #MetaRight, #AltRight  { transform: translate(680px, 0); }
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
  [theme="hints"] .specialKey   path { fill: ${specialKeyBG}; }
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
