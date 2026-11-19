const divisionNames: Record<string, string> = {
  খুলনা: "Khulna",
  চট্টগ্রাম: "Chattogram",
  ঢাকা: "Dhaka",
  বরিশাল: "Barishal",
  ময়মনসিংহ: "Mymensingh",
  রংপুর: "Rangpur",
  রাজশাহী: "Rajshahi",
  সিলেট: "Sylhet",
};

const consonants: Record<string, string> = {
  ক: "k", খ: "kh", গ: "g", ঘ: "gh", ঙ: "ng", চ: "ch", ছ: "chh", জ: "j", ঝ: "jh", ঞ: "ny",
  ট: "t", ঠ: "th", ড: "d", ঢ: "dh", ণ: "n", ত: "t", থ: "th", দ: "d", ধ: "dh", ন: "n",
  প: "p", ফ: "ph", ব: "b", ভ: "bh", ম: "m", য: "j", র: "r", ল: "l", শ: "sh", ষ: "sh",
  স: "s", হ: "h", ড়: "r", ঢ়: "rh", য়: "y", ৎ: "t", ক্ষ: "kkh", জ্ঞ: "gg",
};

const vowels: Record<string, string> = {
  অ: "o", আ: "a", ই: "i", ঈ: "i", উ: "u", ঊ: "u", ঋ: "ri", এ: "e", ঐ: "oi", ও: "o", ঔ: "ou",
};

const vowelSigns: Record<string, string> = {
  "া": "a", "ি": "i", "ী": "i", "ু": "u", "ূ": "u", "ৃ": "ri", "ে": "e", "ৈ": "oi", "ো": "o", "ৌ": "ou",
};

/** Display Bangla location names in Latin script while keeping their stored values unchanged. */
export function transliterateBanglaLocation(value: string): string {
  if (divisionNames[value]) return divisionNames[value];

  const chars = Array.from(value.normalize("NFC"));
  let result = "";
  let pendingConsonant = false;
  let suppressInherentVowel = false;

  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];
    const pair = char + (chars[index + 1] ?? "");
    const conjunct = consonants[pair];

    if (conjunct) {
      if (pendingConsonant && !suppressInherentVowel) result += "o";
      result += conjunct;
      pendingConsonant = true;
      suppressInherentVowel = false;
      index += 1;
      continue;
    }

    if (consonants[char]) {
      if (pendingConsonant && !suppressInherentVowel) result += "o";
      result += consonants[char];
      pendingConsonant = true;
      suppressInherentVowel = false;
      continue;
    }

    if (vowelSigns[char]) {
      result += vowelSigns[char];
      pendingConsonant = false;
      suppressInherentVowel = false;
      continue;
    }

    if (char === "্") {
      suppressInherentVowel = true;
      pendingConsonant = false;
      continue;
    }

    if (vowels[char]) {
      if (pendingConsonant && !suppressInherentVowel) result += "o";
      result += vowels[char];
      pendingConsonant = false;
      suppressInherentVowel = false;
      continue;
    }

    if (char === "ং") {
      result += "ng";
      pendingConsonant = false;
      continue;
    }
    if (char === "ঃ") {
      result += "h";
      pendingConsonant = false;
      continue;
    }
    if (char === "ঁ") {
      result += "n";
      continue;
    }

    if (pendingConsonant && !suppressInherentVowel) result += "o";
    result += char;
    pendingConsonant = false;
    suppressInherentVowel = false;
  }

  if (pendingConsonant && !suppressInherentVowel) result += "a";
  return result;
}
