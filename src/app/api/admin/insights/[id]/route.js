import connectDB from '@/lib/mongodb';
import Insight from '@/models/Insight';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const insight = await Insight.findById(params.id);
        if (!insight) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(insight);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const body = await request.json();
        const updated = await Insight.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(updated);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
