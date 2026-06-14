import connectDB from '@/lib/mongodb';
import Solution from '@/models/Solution';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const doc = await Solution.findById(params.id);
        if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(doc);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const body = await request.json();
        // Parse includes if sent as comma-separated string
        if (typeof body.includes === 'string') {
            body.includes = body.includes.split(',').map((s) => s.trim()).filter(Boolean);
        }
        const updated = await Solution.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(updated);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
