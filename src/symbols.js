/**
 * Deak Keys
 * defined in the Kalamine project: https://github.com/fabi1cazenave/kalamine
 * identifiers -> symbols dictionary, for presentation purposes
 */

const symbols = {
  // diacritics, represented by a space + a combining character
  '*`': ' \u0300', // grave
  '*´': ' \u0301', // acute
  '*^': ' \u0302', // circumflex
  '*~': ' \u0303', // tilde
  '*¯': ' \u0304', // macron
  '*˘': ' \u0306', // breve
  '*˙': ' \u0307', // dot above
  '*¨': ' \u0308', // diaeresis
  '*˚': ' \u030a', // ring above
  '*”': ' \u030b', // double acute
  '*ˇ': ' \u030c', // caron
  '*‟': ' \u030f', // double grave
  '*⁻': ' \u0311', // inverted breve
  '*.': ' \u0323', // dot below
  '*,': ' \u0326', // comma below
  '*¸': ' \u0327', // cedilla
  '*˛': ' \u0328', // ogonek
  '*/': ' \u0335', // stroke
  // special keys, represented by a single character
  '*¤': '\u00a4', // currency
  '*µ': '\u00b5', // greek
  '**': '\u2605', // 1dk = Kalamine "one dead key" = multi-purpose dead key
  // other dead key identifiers (= two-char string starting with a `*`) are not
  // supported by Kalamine, but can still be used with <x-keyboard>
};
export default symbols;
