'use strict';

const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

function loadEnv() {
    const envPath = path.join(__dirname, '../../.env.local');
    if (!fs.existsSync(envPath)) throw new Error('.env.local not found');
    fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
        const t = line.trim();
        if (!t || t.startsWith('#')) return;
        const eq = t.indexOf('=');
        if (eq === -1) return;
        process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    });
}

const CATEGORIES = [
    'Retail',
    'Technology',
    'Financial Services',
    'Healthcare',
    'Hospitality',
    'Real Estate',
];

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
        const col = client.db(dbName).collection('categories');

        let inserted = 0;
        let skipped  = 0;

        for (const name of CATEGORIES) {
            const exists = await col.findOne({ name, type: 'case-study' });
            if (exists) {
                console.log(`  ⏭  Already exists: "${name}"`);
                skipped++;
                continue;
            }
            await col.insertOne({ name, type: 'case-study', createdAt: new Date(), updatedAt: new Date() });
            console.log(`  ✅ Added category: "${name}"`);
            inserted++;
        }

        console.log(`\nDone! ${inserted} inserted, ${skipped} already existed.`);
    } finally {
        await client.close();
    }
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
