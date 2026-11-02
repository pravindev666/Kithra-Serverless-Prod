import * as fs from 'fs';
import * as path from 'path';

const filePath = path.resolve('src/data/expandedCandidateBank.ts');
let content = fs.readFileSync(filePath, 'utf8');

// For each q-101 to q-125
for (let num = 101; num <= 125; num++) {
  const qIdRegex = new RegExp(`(id:\\s*'q-${num}-[^']+',[\\s\\S]*?)(options:\\s*\\[)`, 'm');
  const match = content.match(qIdRegex);
  if (match) {
    let block = match[1];
    if (!block.includes('optionTranslationsReviewStatus')) {
      block = block.replace(
        "validationStatus: 'PILOT_REVIEWED',",
        "validationStatus: 'PILOT_REVIEWED',\n    optionTranslationsReviewStatus: 'machine_translation_pending_human_review',"
      );
    }
    if (!block.includes('Draft translation awaiting formal human linguistic review')) {
      block = block.replace(
        /(culturalSuitabilityNotes:\s*'[^']+)(',)/,
        "$1. Draft translation awaiting formal human linguistic review in Stage A research pilot.$2"
      );
    }
    content = content.replace(match[1], block);
  }
}

// Add translationReviewStatus to options of q-101 to q-125
content = content.replace(
  /(id:\s*'opt-q1(?:0[1-9]|1[0-9]|2[0-5])-[^']+',[\s\S]*?)(welcomesComplementarity:)/g,
  (m, p1, p2) => {
    if (!p1.includes('translationReviewStatus')) {
      return `${p1}translationReviewStatus: 'machine_translation_pending_human_review',\n        ${p2}`;
    }
    return m;
  }
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated Q101–Q125 translation statuses.');

