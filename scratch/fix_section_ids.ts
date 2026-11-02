import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve('src/data/expandedCandidateBank.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const replacements: [RegExp, string][] = [
  [/sectionId: 'communication',/g, "sectionId: 'communication_style',"],
  [/sectionId: 'conflict_repair',/g, "sectionId: 'emotional_repair',"],
  [/sectionId: 'personal_values',/g, "sectionId: 'everyday_values',"],
  [/sectionId: 'finances_independence',/g, "sectionId: 'independence_finances',"],
  [/sectionId: 'family_domestic',/g, "sectionId: 'family_future',"],
  [/sectionId: 'daily_lifestyle',/g, "sectionId: 'lifestyle_health',"],
  [/sectionId: 'intellectual_curiosity',/g, "sectionId: 'everyday_values',"],
  [/sectionId: 'emotional_regulation',/g, "sectionId: 'emotional_repair',"],
  [/sectionId: 'long_term_goals',/g, "sectionId: 'family_future',"],
  [/sectionId: 'romantic_expectations',/g, "sectionId: 'relationship_intentions',"],
];

for (const [pattern, repl] of replacements) {
  content = content.replace(pattern, repl);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed sectionId values in expandedCandidateBank.ts');

