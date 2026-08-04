/**
 * seed-settings.cjs
 * Creates or updates the single Settings document with default values.
 * Run: node src/scripts/seed-settings.cjs
 */

'use strict';

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌  MONGODB_URI not found in .env.local');
    process.exit(1);
}

const SettingsSchema = new mongoose.Schema(
    {
        homepageAboutImage:    { type: String, default: '' },
        aboutPageImage:        { type: String, default: '' },
        homepageAboutSubTitle: { type: String, default: 'ABOUT DREW' },
        homepageAboutTitle:    { type: String, default: 'Strategy-led growth for brands ready to align.' },
        aboutPageSubTitle:     { type: String, default: 'DREW MARKETING SOLUTIONS' },
        aboutPageTitle:        { type: String, default: "We didn't start Drew to do marketing. We started it to fix it." },
        phone:                 { type: String, default: '+254 700 000 000' },
        email:                 { type: String, default: 'hello@drewmarketingsolutions.com' },
        address:               { type: String, default: 'Westlands, Nairobi - Kenya' },
        hours:                 { type: String, default: '8.00 am - 6.00 pm' },
    },
    { timestamps: true }
);

async function main() {
    console.log('🔌  Connecting to MongoDB…');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000, family: 4 });
    console.log('✅  Connected');

    const Settings = mongoose.model('Settings', SettingsSchema);

    const existing = await Settings.findOne({});

    if (existing) {
        console.log('ℹ️   Settings document already exists — skipping seed.');
        console.log('     To update, use the Admin → Settings page instead.');
    } else {
        const doc = await Settings.create({});
        console.log('🌱  Settings document created with defaults:', doc._id.toString());
    }

    await mongoose.disconnect();
    console.log('🔌  Disconnected. Done.');
}

main().catch((err) => {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
});
