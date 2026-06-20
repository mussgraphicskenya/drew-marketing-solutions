/**
 * src/scripts/set-featured.cjs
 * Marks the first 3 solutions (by order) as featured: true.
 * Run with: node src/scripts/set-featured.cjs
 */

'use strict';

const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

// Load MONGODB_URI from .env.local
function loadEnv() {
    const envPath = path.join(__dirname, '../../.env.local');
    if (!fs.existsSync(envPath)) {
        throw new Error('.env.local not found at: ' + envPath);
    }
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

async function main() {
    loadEnv();

    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in .env.local');

    const dbName = process.env.MONGODB_DB
        || (() => {
            // Extract db name from path: everything after the last / before any ?
            const match = uri.match(/\/([^/?]+)(\?|$)/);
            return match ? match[1] : 'drewdb';
        })();

    console.log(`Connecting to MongoDB database: ${dbName} …`);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('solutions');

        // Find the first 3 by order
        const top3 = await col.find({}).sort({ order: 1 }).limit(3).toArray();

        if (top3.length === 0) {
            console.log('No solutions found in the database. Add some first.');
            return;
        }

        const ids = top3.map((s) => s._id);

        // Mark the top 3 as featured
        const featuredResult = await col.updateMany(
            { _id: { $in: ids } },
            { $set: { featured: true } }
        );

        // Unmark any others (in case previously featured were different)
        const unfeaturedResult = await col.updateMany(
            { _id: { $nin: ids } },
            { $set: { featured: false } }
        );

        console.log(`\n✅ Done!`);
        console.log(`   Marked as featured:   ${featuredResult.modifiedCount} solution(s)`);
        console.log(`   Marked as unfeatured: ${unfeaturedResult.modifiedCount} solution(s)`);
        console.log(`\nFeatured solutions:`);
        top3.forEach((s, i) => {
            console.log(`   ${i + 1}. [order=${s.order}] ${s.title}`);
        });

    } finally {
        await client.close();
    }
}

main().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
