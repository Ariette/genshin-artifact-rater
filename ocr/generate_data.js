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
const textLength = 500;

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
for (let i = 0; i < 100; i++) {
  const value = Math.floor(Math.random() * 1000) / 10;
  const rand = Math.random() < 0.5;
  if (rand) {
    digits.push("+" + value.toFixed(1) + "%");
  } else {
    digits.push("+" + Math.floor(value).toString());
  }
}

// Generate training text
const texts = [];

const constText = [].concat(
  artifactData.types,
  artifactData.names,
  artifactData.stats
);
const constLength = constText.length;
for (let i = 0; i < textLength; i++) {
  const randIndex = Math.floor(Math.random() * constLength);
  texts.push(constText[randIndex]);
}

const statLength = artifactData.stats.length;
const digitLength = digits.length;
for (let i = 0; i < textLength; i++) {
  const randStat = Math.floor(Math.random() * statLength);
  const randValue = Math.floor(Math.random() * digitLength);
  texts.push(artifactData.stats[randStat] + digits[randValue]);
}

texts.sort(() => Math.random() - 0.5);

// 모든 char가 다 들어있는지 검증
const saveStr = texts.join("\n");
if ([...unicharLists].some((w) => saveStr.indexOf(w) == -1))
  throw new Error("다시 만들어!");

fs.writeFile(
  pa.join(__dirname, "/langdata/kor/", "kor.training_text"),
  saveStr.replace(/\n /g, "\n"),
  "utf-8",
  (err) => {
    if (err) console.log(err);
    else console.log("training_text generated");
  }
);
fs.writeFile(
  pa.join(__dirname, "/langdata/kor/", "kor.wordlist"),
  [...wordLists].join("\n"),
  "utf-8",
  (err) => {
    if (err) console.log(err);
    else console.log("wordlist generated");
  }
);
