// Daftar kata yang akan disensor pada komentar/ulasan.


const indonesian = [
  // umpatan umum
  'anjing', 'anjir', 'anjrit', 'asu', 'bangsat', 'bajingan', 'brengsek',
  'kampret', 'keparat', 'kunyuk', 'jancok', 'jancuk', 'sialan', 'tolol',
  'goblok', 'goblog', 'bego', 'bodoh', 'idiot', 'dungu', 'bebal',
  'sampah', 'busuk', 'biadab', 'laknat', 'celaka',

  // vulgar / seksual
  'kontol', 'memek', 'ngentot', 'ngewe', 'pepek', 'pantat', 'colmek',
  'jembut', 'titit', 'peju',

  // pelecehan / hinaan ke orang
  'pelacur', 'lonte', 'pecun', 'sundal', 'bencong', 'banci',
  'cacat', 'autis', 'monyet', 'babi', 'anjingmu', 'goblokmu',

  // frasa pelecehan/hinaan langsung
  'dasar bodoh', 'dasar goblok', 'dasar tolol', 'otak udang',
  'muka pantat', 'gak punya otak',

  // varian kata kasar lain
  'tai', 'taik', 'kampang', 'kampangan', 'setan', 'iblis',
];

const english = [
  'fuck', 'fucking', 'fucker', 'shit', 'bullshit', 'bitch', 'asshole',
  'bastard', 'dick', 'pussy', 'cunt', 'slut', 'whore', 'cock',
  'douchebag', 'retard', 'retarded', 'moron', 'idiot', 'stupid',
  'faggot', 'nigger', 'nigga',
];

module.exports = { indonesian, english, all: [...indonesian, ...english] };