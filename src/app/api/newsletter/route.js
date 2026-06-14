import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }

        await connectDB();

        const existing = await mongoose.connection
            .collection('newsletter')
            .findOne({ email: email.toLowerCase().trim() });

        if (existing) {
            return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
        }

        await mongoose.connection.collection('newsletter').insertOne({
            email:     email.toLowerCase().trim(),
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[/api/newsletter]', err.message);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
