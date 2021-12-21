const genshin = require("genshin-db");
const fs = require("fs");
const pa = require("path");

const artifactData = {
  types: [
    "생명의 꽃",
    "죽음의 깃털",
    "시간의 모래",
    "공간의 성배",
    "이성의 왕관",
  ],
  stats: [
    "치명타 확률",
    "치명타 피해",
    "공격력",
    "방어력",
    "원소 충전 효율",
    "원소 마스터리",
    "HP",
    "치유 보너스",
    "바람 원소 피해 보너스",
    "바위 원소 피해 보너스",
    "불 원소 피해 보너스",
    "물 원소 피해 보너스",
    "얼음 원소 피해 보너스",
    "번개 원소 피해 보너스",
    "풀 원소 피해 보너스",
  ],
  names: [],
};
const textLength = 10000;

// Get artifacts' names
const artifacts = genshin.artifacts("5", { matchCategories: true }); // Filter only 5-star artifacts
artifacts.forEach((name) => {
  const art = genshin.artifacts(name, { resultLanguage: "Korean" });
  artifactData.names.push(
    art.flower.name,
    art.plume.name,
    art.sands.name,
    art.goblet.name,
    art.circlet.name
  );
});

const unicharLists = new Set([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  ".",
  "%",
]);
const wordLists = new Set();
Object.values(artifactData).forEach((lists) => {
  lists.forEach((str) => {
    // Generate unichar
    str.split("").forEach((chr) => {
      unicharLists.add(chr);
    });

    // Generate Wordlist
    str.split(" ").forEach((word) => {
      wordLists.add(word);
    });
  });
});

// Generate training digit set
const digits = [];
for (let i = 0; i < 20; i++) {
  const value = Math.floor(Math.random() * 1000) / 10;
  const rand = Math.random() < 0.5;
  if (rand) {
    digits.push("+" + value.toFixed(1) + "%");
  } else {
    digits.push("+" + value.toString());
  }
}
const textLists = new Set(wordLists); // Prevent contaminating word lists
digits.forEach((str) => textLists.add(str));

// Generate training text
const texts = [];
const lists = [...textLists];
const length = lists.length;
for (let i = 0; i < textLength; i++) {
  const randIndex = Math.floor(Math.random() * length);
  texts.push(lists[randIndex]);
  if (i > 0 && i / 10 == Math.floor(i / 10)) texts.push("\n");
}

fs.writeFile(
  pa.join(__dirname, "/trainer/gikr/", "gikr.training_text"),
  [...unicharLists].slice(0, 30).join(" ") +
    "\n" +
    texts.join(" ").replace(/\n /g, "\n"),
  "utf-8",
  (err) => {
    if (err) console.log(err);
    else console.log("training_text generated");
  }
);
fs.writeFile(
  pa.join(__dirname, "/trainer/gikr/", "gikr.wordlist"),
  [...wordLists].join("\n"),
  "utf-8",
  (err) => {
    if (err) console.log(err);
    else console.log("wordlist generated");
  }
);
