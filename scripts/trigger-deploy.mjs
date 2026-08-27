// Fires the Cloudflare deploy hook stored in .deploy-hook (gitignored).
// Usage: node scripts/trigger-deploy.mjs
import { readFileSync } from 'node:fs';

let url;
try {
  url = readFileSync(new URL('../.deploy-hook', import.meta.url), 'utf8').trim();
} catch {
  console.error('Missing .deploy-hook. Create it with the deploy hook URL from');
  console.error('Cloudflare > Workers & Pages > swimlac-site > Settings > Build > Deploy Hooks.');
  process.exit(1);
}
if (!/^https:\/\/api\.cloudflare\.com\//.test(url)) {
  console.error('.deploy-hook does not look like a Cloudflare deploy hook URL.');
  process.exit(1);
}
const res = await fetch(url, { method: 'POST' });
const body = await res.text();
console.log(res.status, body.slice(0, 400));
process.exit(res.ok ? 0 : 1);
