/**
 * src/scripts/add-solution-slugs.cjs
 * For any solution missing a slug, generate one from the title and update it.
 * Run with: node src/scripts/add-solution-slugs.cjs
 */

'use strict';

const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

function loadEnv() {
    const envPath = path.join(__dirname, '../../.env.local');
    if (!fs.existsSync(envPath)) throw new Error('.env.local not found at: ' + envPath);
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = val;
    }
}

function makeSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Ensure uniqueness — append -2, -3 etc. if slug already taken
function uniqueSlug(base, taken) {
    if (!taken.has(base)) return base;
    let i = 2;
    while (taken.has(`${base}-${i}`)) i++;
    return `${base}-${i}`;
}

async function main() {
    loadEnv();
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in .env.local');

    const dbMatch = uri.match(/\/([^/?]+)(\?|$)/);
    const dbName  = process.env.MONGODB_DB || (dbMatch ? dbMatch[1] : 'drewdb');

    console.log(`Connecting to MongoDB (${dbName}) …`);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const col = client.db(dbName).collection('solutions');

        const all = await col.find({}).toArray();

        // Build a set of existing slugs to avoid collisions
        const taken = new Set(all.filter(s => s.slug).map(s => s.slug));

        let updated = 0;
        let skipped = 0;

        for (const sol of all) {
            if (sol.slug) { skipped++; continue; }
            if (!sol.title) { console.warn(`  ⚠ Skipping _id=${sol._id}: no title`); continue; }

            const base = makeSlug(sol.title);
            const slug = uniqueSlug(base, taken);
            taken.add(slug);

            await col.updateOne({ _id: sol._id }, { $set: { slug } });
            console.log(`  ✅ [${sol.title}] → slug: "${slug}"`);
            updated++;
        }

        console.log(`\nDone! ${updated} updated, ${skipped} already had slugs.`);
    } finally {
        await client.close();
    }
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
