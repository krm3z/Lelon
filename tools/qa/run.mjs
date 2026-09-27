import { themeCheckRun } from '@shopify/theme-check-node';
const root = process.argv[2];
const { offenses } = await themeCheckRun(root, undefined, (m) => {});
const byCheck = {};
for (const o of offenses) {
  const file = o.uri.replace('file://' + root + '/', '');
  console.log(`[${['ERR','WARN','INFO'][o.severity] ?? o.severity}] ${o.check} ${file}:${o.start.line + 1} ${o.message}`);
  byCheck[o.check] = (byCheck[o.check] || 0) + 1;
}
console.log('\nTOTAL', offenses.length, byCheck);
