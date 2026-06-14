import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request) {
    try {
        const { name, email, subject, phone, message } = await request.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        await mongoose.connection.collection('messages').insertOne({
            name,
            email,
            subject,
            phone:     phone ?? '',
            message,
            read:      false,          // ← new: track read status
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[/api/contact]', err.message);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
