import fs from 'fs';
import path from 'path';
import { pool } from './pool';

async function main() {
  const schema = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
  console.log('[migrate] applying schema...');
  await pool.query(schema);
  console.log('[migrate] done');
  await pool.end();
}

main().catch((e) => {
  console.error('[migrate] failed', e);
  process.exit(1);
});
