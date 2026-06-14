import connectDB from '@/lib/mongodb';
import Solution from '@/models/Solution';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        if (typeof body.includes === 'string') {
            body.includes = body.includes.split(',').map((s) => s.trim()).filter(Boolean);
        }
        const doc = await Solution.create(body);
        return NextResponse.json(doc, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
