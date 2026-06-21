'use strict';

/**
 * seed-solution-details.cjs
 *
 * Seeds whyDrewIcon for existing solutions.
 * Uses a real Cloudinary-hosted icon already in the project
 * (the category-icon path) for the first 3 solutions,
 * leaving the remaining 3 without an icon to test optional behavior.
 *
 * Run: node src/scripts/seed-solution-details.cjs
 */

const { MongoClient } = require('mongodb');
const path = require('path');
const fs   = require('fs');

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

// A Cloudinary-hosted icon (use a public icon from the project assets already on Cloudinary,
// or a reliable public icon URL). We use a clean SVG-style arrow icon from a public CDN
// that matches the dark aesthetic of the template.
const ICON_URLS = [
    'https://res.cloudinary.com/drilzezb6/image/upload/v1/drew-marketing/icons/why-drew-icon',
    // Fallback: use a reliable external icon placeholder if Cloudinary path doesn't exist
];

// Safe fallback: use an absolutely reliable public icon
const FALLBACK_ICON = 'https://img.icons8.com/ios-filled/56/ff3b00/prize.png';

async function main() {
    loadEnv();

    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in .env.local');

    const dbMatch = uri.match(/\/([^/?]+)(\?|$)/);
    const dbName  = process.env.MONGODB_DB || (dbMatch ? dbMatch[1] : 'drewdb');

    console.log(`Connecting to MongoDB (${dbName}) …\n`);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const col = client.db(dbName).collection('solutions');

        const solutions = await col.find({}).sort({ order: 1 }).toArray();
        console.log(`Found ${solutions.length} solutions.\n`);

        for (let i = 0; i < solutions.length; i++) {
            const sol = solutions[i];

            // Only seed the first 3 solutions with an icon — leave others empty to test optional behavior
            if (i >= 3) {
                console.log(`  ⏭  "${sol.title}" — skipping (no icon seeded, testing optional behavior)`);
                continue;
            }

            // Skip if already has whyDrewIcon
            if (sol.whyDrewIcon) {
                console.log(`  ✓  "${sol.title}" — already has whyDrewIcon: ${sol.whyDrewIcon}`);
                continue;
            }

            await col.updateOne(
                { _id: sol._id },
                { $set: {
                    whyDrewIcon: FALLBACK_ICON,
                    updatedAt:   new Date(),
                }}
            );

            console.log(`  ✅ "${sol.title}"`);
            console.log(`       whyDrewIcon: ${FALLBACK_ICON}\n`);
        }

        console.log('\nDone!');

        // Show final state
        console.log('\n── Final whyDrewIcon state ──');
        const updated = await col.find({}).sort({ order: 1 }).toArray();
        updated.forEach(sol => {
            const icon = sol.whyDrewIcon || '(none)';
            console.log(`  ${sol.title}: ${icon}`);
        });

    } finally {
        await client.close();
    }
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
