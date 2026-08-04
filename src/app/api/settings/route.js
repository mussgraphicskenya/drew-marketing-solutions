import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
    try {
        await connectDB();
        // Return first (and only) settings document; create defaults if none
        let settings = await Settings.findOne({});
        if (!settings) {
            settings = await Settings.create({});
        }
        return NextResponse.json(settings);
    } catch (err) {
        console.error('[GET /api/settings]', err.message);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        // Upsert: update the single settings doc, or create it if missing
        const settings = await Settings.findOneAndUpdate(
            {},
            { $set: body },
            { upsert: true, new: true, runValidators: true }
        );

        return NextResponse.json(settings);
    } catch (err) {
        console.error('[POST /api/settings]', err.message);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
