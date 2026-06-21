'use strict';

/**
 * fix-pdf-access.cjs
 *
 * Uses Cloudinary's Admin API to set ALL existing PDFs in the
 * drew-marketing/pdfs folder to public access mode.
 *
 * This fixes 401 errors on already-uploaded PDFs without re-uploading.
 *
 * Run: node src/scripts/fix-pdf-access.cjs
 */

const cloudinary = require('cloudinary').v2;
const https      = require('https');
const path       = require('path');
const fs         = require('fs');

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

function testUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve(res.statusCode);
            res.destroy();
        }).on('error', () => resolve(null));
    });
}

async function main() {
    loadEnv();

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:    process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('Fetching all raw resources in drew-marketing/pdfs …\n');

    // List all raw resources in the pdfs folder
    const result = await cloudinary.api.resources({
        resource_type: 'raw',
        type:          'upload',
        prefix:        'drew-marketing/pdfs/',
        max_results:   50,
    });

    console.log(`Found ${result.resources.length} raw resource(s).\n`);

    let fixed = 0;
    let failed = 0;

    for (const resource of result.resources) {
        const publicId = resource.public_id;
        console.log(`  Processing: ${publicId}`);
        console.log(`    Current access_mode: ${resource.access_mode || '(not set)'}`);

        try {
            // Use Admin API to update access_mode to 'public'
            await cloudinary.api.update(publicId, {
                resource_type: 'raw',
                access_mode:   'public',
            });

            // Build the expected URL (add .pdf if missing)
            const url = resource.secure_url.endsWith('.pdf')
                ? resource.secure_url
                : resource.secure_url + '.pdf';

            // Test the URL
            const status = await testUrl(url);
            const ok = status === 200;

            if (ok) {
                console.log(`    ✅ Now public — HTTP ${status}`);
                console.log(`    URL: ${url}`);
            } else {
                console.log(`    ⚠️  access_mode updated but HTTP ${status} (may need dashboard change)`);
                console.log(`    URL: ${url}`);
            }
            fixed++;
        } catch (err) {
            console.error(`    ❌ Failed: ${err.message}`);
            failed++;
        }
        console.log('');
    }

    console.log(`\nDone: ${fixed} updated, ${failed} failed.`);

    if (fixed > 0) {
        console.log(`
\n⚠️  IF URLS ARE STILL RETURNING 401 after this script:
This means your Cloudinary account has "Restrict PDF and ZIP files delivery" enabled.

To fix it in the Cloudinary dashboard:
1. Go to: https://cloudinary.com/console → Settings (gear icon, top right)
2. Click the "Security" tab
3. Scroll to "Restricted media types" section
4. UNCHECK "PDF and ZIP files" (this is the setting blocking public PDF delivery)
5. Click Save

This is an account-level restriction that overrides all per-resource access_mode settings.
`);
    }
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
