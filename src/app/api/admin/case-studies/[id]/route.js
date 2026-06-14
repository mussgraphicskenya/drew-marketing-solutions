import connectDB from '@/lib/mongodb';
import CaseStudy from '@/models/CaseStudy';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const doc = await CaseStudy.findById(params.id);
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
        const updated = await CaseStudy.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(updated);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
