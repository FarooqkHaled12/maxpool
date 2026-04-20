/**
 * upload-images.js
 * Uploads all product images to Railway /uploads/products/
 * then updates MongoDB with the new /uploads/ URLs.
 *
 * Run once: node scripts/upload-images.js
 */

require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs       = require('fs');
const path     = require('path');
const https    = require('https');
const http     = require('http');
const FormData = require('form-data');
const mongoose = require('mongoose');
const Product  = require('../models/Product');

const API_BASE       = 'https://maxpool-production.up.railway.app';
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@maxpool.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';
const ASSETS_ROOT    = path.join(__dirname, '..', '..');

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── HTTP helper ──────────────────────────────────────────────────────────────
function request(method, url, body, token, isForm) {
  return new Promise((resolve, reject) => {
    const u      = new URL(url);
    const lib    = u.protocol === 'https:' ? https : http;
    const hdrs   = token ? { Authorization: `Bearer ${token}` } : {};
    if (!isForm && body) { hdrs['Content-Type'] = 'application/json'; }

    const opts = {
      hostname: u.hostname,
      port:     u.port || (u.protocol === 'https:' ? 443 : 80),
      path:     u.pathname,
      method,
      headers:  isForm ? { ...hdrs, ...body.getHeaders() } : hdrs,
    };

    const req = lib.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    if (isForm) body.pipe(req);
    else { if (body) req.write(JSON.stringify(body)); req.end(); }
  });
}

// ── Login ────────────────────────────────────────────────────────────────────
async function login() {
  const res = await request('POST', `${API_BASE}/api/auth/login`,
    { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, null, false);
  if (!res.body.token) throw new Error('Login failed: ' + JSON.stringify(res.body));
  return res.body.token;
}

// ── Upload one image via create+delete trick ─────────────────────────────────
async function uploadFile(filePath, token) {
  if (!fs.existsSync(filePath)) return null;

  const form = new FormData();
  form.append('name',        'tmp-' + Date.now());
  form.append('description', 'tmp');
  form.append('category',    'cat-pumps');
  form.append('images',      fs.createReadStream(filePath), path.basename(filePath));

  const res = await request('POST', `${API_BASE}/api/products`, form, token, true);
  if (res.status === 201 && res.body.data?.images?.[0]) {
    const url = res.body.data.images[0];
    await request('DELETE', `${API_BASE}/api/products/${res.body.data._id}`, null, token, false);
    return url; // e.g. /uploads/products/1234567890-123456789.jpg
  }
  return null;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== Max Pool — Upload Images to Railway ===\n');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('[DB] Connected\n');

  const token = await login();
  console.log('[Auth] Logged in\n');

  const products = await Product.find({}).lean();
  const cache    = {};
  let ok = 0, skip = 0, fail = 0;

  for (const p of products) {
    const old = p.images?.[0];
    if (!old) { skip++; continue; }

    // Already on Railway
    if (old.startsWith('/uploads/')) {
      console.log(`[SKIP] ${p.name}`);
      skip++; continue;
    }

    // Use cache if same file already uploaded
    if (cache[old]) {
      await Product.findByIdAndUpdate(p._id, { images: [cache[old]] });
      console.log(`[CACHE] ${p.name} → ${cache[old]}`);
      ok++; continue;
    }

    const fullPath = path.join(ASSETS_ROOT, old);
    process.stdout.write(`[UPLOAD] ${p.name} ... `);

    const newUrl = await uploadFile(fullPath, token);
    if (newUrl) {
      cache[old] = newUrl;
      await Product.findByIdAndUpdate(p._id, { images: [newUrl] });
      console.log(`✓ ${newUrl}`);
      ok++;
    } else {
      console.log(`✗ FAILED`);
      fail++;
    }

    await sleep(400);
  }

  console.log(`\n=== Done: ${ok} uploaded, ${skip} skipped, ${fail} failed ===`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(e => { console.error('[Fatal]', e.message); process.exit(1); });
