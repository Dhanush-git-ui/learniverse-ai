const fs = require('fs');
const ts = require('typescript');

const tsCode = fs.readFileSync('./src/data/top100Data.ts', 'utf8');
const result = ts.transpileModule(tsCode, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
});

const sandbox = { exports: {}, module: { exports: {} } };
const fn = new Function('exports', 'module', result.outputText);
fn(sandbox.exports, sandbox.module);

const questions = sandbox.module.exports.TOP_100_QUESTIONS || sandbox.exports.TOP_100_QUESTIONS;
console.log('Extracted questions:', questions ? questions.length : 'none');
if (questions) {
  fs.writeFileSync('./scratch/extracted_existing_100.json', JSON.stringify(questions, null, 2));
  console.log('Saved extracted_existing_100.json successfully!');
}
