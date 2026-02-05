// Gujarati → English transliteration map
export const gujaratiToEnglishMap = {
  // Vowels
  "અ": ["a"],
  "આ": ["aa", "a"],
  "ઇ": ["i"],
  "ઈ": ["ee", "i"],
  "ઉ": ["u"],
  "ઊ": ["oo", "u"],
  "એ": ["e"],
  "ઐ": ["ai"],
  "ઓ": ["o"],
  "ઔ": ["au"],

  // Consonants
  "ક": ["k", "c"],
  "ખ": ["kh"],
  "ગ": ["g"],
  "ઘ": ["gh"],
  "ચ": ["ch"],
  "છ": ["chh"],
  "જ": ["j"],
  "ઝ": ["jh"],
  "ટ": ["t"],
  "ઠ": ["th"],
  "ડ": ["d"],
  "ઢ": ["dh"],
  "ત": ["t"],
  "થ": ["th"],
  "દ": ["d"],
  "ધ": ["dh"],
  "ન": ["n"],

  "પ": ["p"],
  "ફ": ["f", "ph"],
  "બ": ["b"],
  "ભ": ["bh"],
  "મ": ["m"],

  "ય": ["y"],
  "ર": ["r"],
  "લ": ["l"],
  "વ": ["v", "w" , "Wa" , "va" , "wa"],
  "શ": ["sh"],
  "ષ": ["sh"],
  "સ": ["s"],
  "હ": ["h"],

  // Matras
  "ા": ["a", ""],
  "િ": ["i", ""],
  "ી": ["ee", "i"],   // required for Deep
  "ુ": ["u", ""],
  "ૂ": ["oo", "u"],
  "ે": ["e"],
  "ૈ": ["ai"],
  "ો": ["o"],
  "ૌ": ["au"],
};

// Generate transliterations
export const generateTransliterations = (text = "") => {
  let results = [""];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    const nextNextChar = text[i + 2];

    if (
      gujaratiToEnglishMap[char] &&
      nextChar === "્" &&
      gujaratiToEnglishMap[nextNextChar]
    ) {
      const joined = [];

      for (const prefix of results) {
        for (const a of gujaratiToEnglishMap[char]) {
          for (const b of gujaratiToEnglishMap[nextNextChar]) {
            joined.push(prefix + a + b);
          }
        }
      }

      results = joined;
      i += 2;
      continue;
    }

    if (char === "્") continue;

    const mappings = gujaratiToEnglishMap[char] || [char];
    const next = [];

    for (const prefix of results) {
      for (const map of mappings) {
        next.push(prefix + map);
      }
    }

    results = next;
  }

  // ✅ CLEAN + CAPITALIZE
  const finalSet = new Set();

  for (let word of results) {
    word = word.trim();           // 🔥 FIX: remove spaces
    if (!word) continue;          // 🔥 remove empty

    const lower = word.toLowerCase();
    finalSet.add(lower);                          // deep
    finalSet.add(lower[0].toUpperCase() + lower.slice(1)); // Deep
    finalSet.add(lower.toUpperCase());            // DEEP
  }

  return [...finalSet];
};

