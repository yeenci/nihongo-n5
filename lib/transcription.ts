// Specific romaji-to-hiragana conversions
const replaceHiragana: [RegExp, string][] = [
    [/_/g, "ー"],
    [/[âā]/g, "aあ"], [/[îī]/g, "iい"], [/[ūû]/g, "uう"], [/[êē]/g, "eい"], [/[ôō]/g, "oう"],
    [/n/g, "ん"],
    [/wa/g, "わ"], [/wo/g, "を"],
    [/ra/g, "ら"], [/ri/g, "り"], [/ru/g, "る"], [/re/g, "れ"], [/ro/g, "ろ"],
    [/pya/g, "ぴゃ"], [/pyu/g, "ぴゅ"], [/pyo/g, "ぴょ"],
    [/bya/g, "びゃ"], [/byu/g, "びゅ"], [/byo/g, "びょ"],
    [/ja/g, "ぢゃ"], [/ju/g, "ぢゅ"], [/jo/g, "ぢょ"],
    [/ja/g, "じゃ"], [/ju/g, "じゅ"], [/jo/g, "じょ"],
    [/gya/g, "ぎゃ"], [/gyu/g, "ぎゅ"], [/gyo/g, "ぎょ"],
    [/rya/g, "りゃ"], [/ryu/g, "りゅ"], [/ryo/g, "りょ"],
    [/mya/g, "みゃ"], [/myu/g, "みゅ"], [/myo/g, "みょ"],
    [/hya/g, "ひゃ"], [/hyu/g, "ひゅ"], [/hyo/g, "ひょ"],
    [/nya/g, "にゃ"], [/nyu/g, "にゅ"], [/nyo/g, "にょ"], [/んya/g, "にゃ"], [/んyu/g, "にゅ"], [/んyo/g, "にょ"],
    [/cha/g, "ちゃ"], [/chu/g, "ちゅ"], [/cho/g, "ちょ"],
    [/sha/g, "しゃ"], [/shu/g, "しゅ"], [/sho/g, "しょ"],
    [/kya/g, "きゃ"], [/kyu/g, "きゅ"], [/kyo/g, "きょ"],
    [/ya/g, "や"], [/yu/g, "ゆ"], [/yo/g, "よ"],
    [/ma/g, "ま"], [/mi/g, "み"], [/mu/g, "む"], [/me/g, "め"], [/mo/g, "も"],
    [/pa/g, "ぱ"], [/pi/g, "ぴ"], [/pu/g, "ぷ"], [/pe/g, "ぺ"], [/po/g, "ぽ"],
    [/ba/g, "ば"], [/bi/g, "び"], [/bu/g, "ぶ"], [/be/g, "べ"], [/bo/g, "ぼ"],
    [/ha/g, "は"], [/hi/g, "ひ"], [/fu/g, "ふ"], [/he/g, "へ"], [/ho/g, "ほ"], [/hu/g, "ふ"],
    [/んa/g, "な"], [/んi/g, "に"], [/んu/g, "ぬ"], [/んe/g, "ね"], [/んo/g, "の"],
    [/da/g, "だ"], [/ji/g, "ぢ"], [/zu/g, "づ"], [/de/g, "て"], [/do/g, "ど"], [/di/g, "ぢ"], [/du/g, "づ"],
    [/ta/g, "た"], [/ti/g, "ち"], [/tu/g, "つ"], [/te/g, "て"], [/to/g, "と"], [/chi/g, "ち"], [/cひ/g, "ち"], [/tsu/g, "つ"],
    [/za/g, "ざ"], [/ji/g, "じ"], [/zu/g, "ず"], [/ze/g, "ぜ"], [/zo/g, "ぞ"], [/zi/g, "じ"],
    [/sa/g, "さ"], [/si/g, "し"], [/su/g, "す"], [/se/g, "せ"], [/so/g, "そ"], [/shi/g, "し"], [/sひ/g, "し"],
    [/ga/g, "が"], [/gi/g, "ぎ"], [/gu/g, "ぐ"], [/ge/g, "げ"], [/go/g, "ご"],
    [/ka/g, "か"], [/ki/g, "き"], [/ku/g, "く"], [/ke/g, "け"], [/ko/g, "こ"],
    [/a/g, "あ"], [/i/g, "い"], [/u/g, "う"], [/e/g, "え"], [/o/g, "お"],
];

// Specific romaji-to-katakana conversions
const replaceKatakana: [RegExp, string][] = [
    [/_/g, "ー"],
    [/[âā]/g, "aア"], [/[îī]/g, "iイ"], [/[ūû]/g, "uウ"], [/[êē]/g, "eイ"], [/[ôō]/g, "oウ"],
    [/n/g, "ン"],
    [/wa/g, "ワ"], [/wo/g, "ヲ"],
    [/ra/g, "ラ"], [/ri/g, "リ"], [/ru/g, "ル"], [/re/g, "レ"], [/ro/g, "ロ"],
    [/pya/g, "ピャ"], [/pyu/g, "ピュ"], [/pyo/g, "ピョ"],
    [/bya/g, "ビャ"], [/byu/g, "ビュ"], [/byo/g, "ビョ"],
    [/ja/g, "ヂャ"], [/ju/g, "ヂュ"], [/jo/g, "ヂョ"],
    [/ja/g, "ジャ"], [/ju/g, "ジュ"], [/jo/g, "ジョ"],
    [/gya/g, "ギャ"], [/gyu/g, "ギュ"], [/gyo/g, "ギョ"],
    [/rya/g, "リャ"], [/ryu/g, "リュ"], [/ryo/g, "リョ"],
    [/mya/g, "ミャ"], [/myu/g, "ミュ"], [/myo/g, "ミョ"],
    [/hya/g, "ヒャ"], [/hyu/g, "ヒュ"], [/hyo/g, "ヒョ"],
    [/nya/g, "ニャ"], [/nyu/g, "ニュ"], [/nyo/g, "ニョ"], [/ンya/g, "ニャ"], [/ンyu/g, "ニュ"], [/んyo/g, "ニョ"],
    [/cha/g, "チャ"], [/chu/g, "チュ"], [/cho/g, "チョ"],
    [/sha/g, "シャ"], [/shu/g, "シュ"], [/sho/g, "ショ"],
    [/kya/g, "キャ"], [/kyu/g, "キュ"], [/kyo/g, "キョ"],
    [/ya/g, "ヤ"], [/yu/g, "ユ"], [/yo/g, "ヨ"],
    [/ma/g, "マ"], [/mi/g, "ミ"], [/mu/g, "ム"], [/me/g, "メ"], [/mo/g, "モ"],
    [/pa/g, "パ"], [/pi/g, "ピ"], [/pu/g, "プ"], [/pe/g, "ペ"], [/po/g, "ポ"],
    [/ba/g, "バ"], [/bi/g, "ビ"], [/bu/g, "ブ"], [/be/g, "ベ"], [/bo/g, "ボ"],
    [/ha/g, "ハ"], [/hi/g, "ヒ"], [/fu/g, "フ"], [/he/g, "ヘ"], [/ho/g, "ホ"], [/hu/g, "フ"],
    [/ンa/g, "ナ"], [/ンi/g, "ニ"], [/ンu/g, "ヌ"], [/ンe/g, "ネ"], [/ンo/g, "ノ"],
    [/da/g, "ダ"], [/ji/g, "ヂ"], [/du/g, "ヅ"], [/de/g, "デ"], [/do/g, "ド"], [/di/g, "ヂ"], [/zu/g, "ヅ"],
    [/ta/g, "タ"], [/ti/g, "チ"], [/tu/g, "ツ"], [/te/g, "テ"], [/to/g, "ト"], [/chi/g, "チ"], [/cヒ/g, "チ"], [/tsu/g, "ツ"],
    [/za/g, "ザ"], [/ji/g, "ジ"], [/zu/g, "ズ"], [/ze/g, "ゼ"], [/zo/g, "ゾ"], [/zi/g, "ジ"],
    [/sa/g, "サ"], [/si/g, "シ"], [/su/g, "ス"], [/se/g, "セ"], [/so/g, "ソ"], [/shi/g, "シ"], [/sヒ/g, "シ"],
    [/ga/g, "ガ"], [/gi/g, "ギ"], [/gu/g, "グ"], [/ge/g, "ゲ"], [/go/g, "ゴ"],
    [/ka/g, "カ"], [/ki/g, "キ"], [/ku/g, "ク"], [/ke/g, "ケ"], [/ko/g, "コ"],
    [/a/g, "ア"], [/i/g, "イ"], [/u/g, "ウ"], [/e/g, "エ"], [/o/g, "オ"],
];

export const normalizeRomaji = (input: string): string => {
  let car = input.toLowerCase();
  const replaceText: [string, string][] = [
    ["hu", "fu"],
    ["ti", "chi"],
    ["tu", "tsu"],
    ["si", "shi"],
    ["zi", "ji"],
    ["di", "ji"],
    ["du", "zu"],
    ["nn", "n"],
  ];

  replaceText.forEach(([pattern, replacement]) => {
    car = car.replace(pattern, replacement);
  });

  return car;
};

export const transcribeToHiragana = (input: string): string => {
    const normalized = normalizeRomaji(input)
    let car = normalized;

    replaceHiragana.forEach(([pattern, replacement]) => {
        car = car.replace(pattern, replacement);
    });

    car = car.replace(/n'/g, "ん");
    car = car.replace(/n/g, "ん");

    return car;
}

export const transcribeToKatakana = (input: string): string => {
    const normalized = normalizeRomaji(input)
    let car = normalized;

    replaceKatakana.forEach(([pattern, replacement]) => {
        car = car.replace(pattern, replacement);
    });

    car = car.replace(/n'/g, "ン");
    car = car.replace(/n/g, "ン");

    return car;
}