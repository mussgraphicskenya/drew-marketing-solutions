'use strict';

/**
 * seed-solution-downloads.cjs
 *
 * Seeds real PDF download entries on each solution.
 * Uses Cloudinary's fetch/upload API to store a real PDF from a public URL
 * so each solution gets its own Cloudinary-hosted PDF.
 *
 * Run: node src/scripts/seed-solution-downloads.cjs
 */

const { MongoClient } = require('mongodb');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs   = require('fs');
const https = require('https');

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

// A real, freely-accessible sample PDF with direct download (Mozilla PDF.js test file)
const SAMPLE_PDF_URL = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

/**
 * Upload a PDF from a remote URL to Cloudinary using upload_stream + https.get
 * Returns the secure_url.
 */
async function uploadPdfFromUrl(url, publicId) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                public_id:     publicId,
                folder:        'drew-marketing/pdfs',
                resource_type: 'raw',
                format:        'pdf',   // forces .pdf extension in the stored URL
                overwrite:     true,
            },
            (error, result) => {
                if (error) return reject(error);
                // Sanitise: ensure URL ends in .pdf
                const fileUrl = result.secure_url.endsWith('.pdf')
                    ? result.secure_url
                    : result.secure_url + '.pdf';
                resolve(fileUrl);
            }
        );

        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to fetch PDF: HTTP ${res.statusCode}`));
            }
            res.pipe(stream);
        }).on('error', reject);
    });
}

async function main() {
    loadEnv();

    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:    process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

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

        for (const sol of solutions) {
            // Skip only if already has a proper .pdf URL — re-upload otherwise
            const hasGoodUrl = sol.downloads?.some(d => d.fileUrl?.endsWith('.pdf'));
            if (hasGoodUrl) {
                console.log(`  ✓  "${sol.title}" — URL already ends in .pdf, skipping.`);
                continue;
            }

            const safeSlug = (sol.slug || sol._id.toString()).replace(/[^a-z0-9-]/g, '-');
            const label    = `${sol.title} — Overview`;
            const publicId = `solution-overview-${safeSlug}`;

            console.log(`  ⬆  Uploading PDF for "${sol.title}" …`);

            try {
                const fileUrl = await uploadPdfFromUrl(SAMPLE_PDF_URL, publicId);

                await col.updateOne(
                    { _id: sol._id },
                    { $set: {
                        downloads:  [{ title: label, fileUrl }],
                        updatedAt:  new Date(),
                    }}
                );

                console.log(`  ✅ "${sol.title}"`);
                console.log(`       label:   ${label}`);
                console.log(`       fileUrl: ${fileUrl}\n`);
            } catch (err) {
                console.error(`  ❌ Failed for "${sol.title}": ${err.message}\n`);
            }
        }

        console.log('Done!');
    } finally {
        await client.close();
    }
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
