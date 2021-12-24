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
  mainOnlyStats: [
    "치유 보너스",
    "바람 원소 피해 보너스",
    "바위 원소 피해 보너스",
    "불 원소 피해 보너스",
    "물 원소 피해 보너스",
    "얼음 원소 피해 보너스",
    "번개 원소 피해 보너스",
    "풀 원소 피해 보너스",
  ],
  stats: [
    "치명타 확률",
    "치명타 피해",
    "공격력",
    "방어력",
    "원소 충전 효율",
    "원소 마스터리",
    "HP",
  ],
  names: [],
};
const textLength = 50;

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

// Generate training digit set
const digits = [];
for (let i = 0; i < 50; i++) {
  const value = Math.floor(Math.random() * 1000) / 10;
  const rand = Math.random() < 0.5;
  if (rand) {
    digits.push("+" + value.toFixed(1) + "%");
  } else {
    digits.push("+" + Math.floor(value).toString());
  }
}

// Generate training text
const texts = [].concat(
  artifactData.types,
  artifactData.names,
  artifactData.mainOnlyStats,
  artifactData.stats
);
const uniChr = new Set([
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
]); // Generate unichr
texts.forEach((text) => text.split("").forEach((chr) => uniChr.add(chr)));

const statLength = artifactData.stats.length;
const digitLength = digits.length;
for (let i = 0; i < textLength; i++) {
  const randStat = Math.floor(Math.random() * statLength);
  const randValue = Math.floor(Math.random() * digitLength);
  texts.push(artifactData.stats[randStat] + digits[randValue]);
}

// 모든 char가 다 들어있는지 검증
const saveStr = texts.join("\n");
if ([...uniChr].some((w) => saveStr.indexOf(w) == -1))
  throw new Error("다시 만들어!");

fs.writeFile(
  pa.join(__dirname, "/train/trainingText.txt"),
  texts.join("\n"),
  "utf-8",
  (err) => {
    if (err) console.log(err);
    else console.log("training_text generated");
  }
);

fs.writeFile(
  pa.join(__dirname, "/train/unichar.txt"),
  [...uniChr].join(""),
  "utf-8",
  (err) => {
    if (err) console.log(err);
    else console.log("unichar generated");
  }
);
