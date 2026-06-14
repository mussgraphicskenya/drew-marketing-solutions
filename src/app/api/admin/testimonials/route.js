import connectDB from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const doc = await Testimonial.create(body);
        return NextResponse.json(doc, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
