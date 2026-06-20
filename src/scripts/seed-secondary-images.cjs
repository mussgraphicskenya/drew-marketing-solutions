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
        const col = client.db(dbName).collection('casestudies');

        // Find all case studies missing a secondaryImage
        const missing = await col.find({
            $or: [
                { secondaryImage: { $exists: false } },
                { secondaryImage: null },
                { secondaryImage: '' },
            ]
        }).toArray();

        if (missing.length === 0) {
            console.log('✅ All case studies already have a secondaryImage — nothing to do.');
            return;
        }

        console.log(`\nFound ${missing.length} case studies without a secondaryImage:\n`);

        let updated = 0;
        for (const doc of missing) {
            const seed = `${doc.slug}-secondary`;
            const imageUrl = `https://picsum.photos/seed/${seed}/800/600`;

            await col.updateOne(
                { _id: doc._id },
                { $set: { secondaryImage: imageUrl, updatedAt: new Date() } }
            );

            console.log(`  ✅ [${doc.industry || 'General'}] "${doc.title}"`);
            console.log(`        slug: ${doc.slug}`);
            console.log(`        secondaryImage: ${imageUrl}\n`);
            updated++;
        }

        console.log(`Done! ${updated} case studies updated.`);
    } finally {
        await client.close();
    }
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
