const badwords = require('../config/Badwords');

const LEET_MAP = {
  a: '[a@4]',
  i: '[i1!|]',
  e: '[e3]',
  o: '[o0]',
  u: '[uv]',
  s: '[s$5]',
  t: '[t7]',
  g: '[g9]',
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Bangun regex per kata/frasa yang toleran terhadap:
// - huruf diulang-ulang (anjinggg, goblookk)
// - substitusi angka/simbol (k0nt0l, b4ngsat)
// - spasi/simbol sisipan antar huruf (k.o.n.t.o.l, a_n_j_i_n_g)
function buildPattern(phrase) {
  const tokenPatterns = phrase.split(' ').map((token) => {
    return token
      .split('')
      .map((ch) => {
        const cls = LEET_MAP[ch] || escapeRegex(ch);
        return `${cls}+`; // toleransi huruf diulang
      })
      .join('[\\W_]{0,2}'); // toleransi simbol/spasi kecil di antara huruf
  });
  return tokenPatterns.join('\\s+');
}

function buildRegex(phrase) {
  const pattern = buildPattern(phrase);
  // (?<![a-zA-Z]) ... (?![a-zA-Z]) supaya gak ke-trigger sama kata lain
  // yang kebetulan mengandung potongan huruf yang sama
  return new RegExp(`(?<![a-zA-Z])(${pattern})(?![a-zA-Z])`, 'gi');
}

/**
 * Cek & sensor kata kasar/pelecehan dalam sebuah teks.
 * @param {string} text
 * @returns {{ text: string, wasFiltered: boolean, matchedCount: number }}
 */
function censorText(text) {
  if (!text || typeof text !== 'string') {
    return { text, wasFiltered: false, matchedCount: 0 };
  }

  let result = text;
  let matchedCount = 0;

  for (const word of badwords.all) {
    const regex = buildRegex(word);
    const matches = result.match(regex);
    if (matches && matches.length) {
      matchedCount += matches.length;
      regex.lastIndex = 0;
      result = result.replace(regex, (m) => '*'.repeat(m.length));
    }
  }

  return { text: result, wasFiltered: matchedCount > 0, matchedCount };
}

module.exports = { censorText };