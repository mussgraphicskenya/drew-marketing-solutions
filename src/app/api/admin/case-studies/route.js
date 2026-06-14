import connectDB from '@/lib/mongodb';
import CaseStudy from '@/models/CaseStudy';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const doc = await CaseStudy.create(body);
        return NextResponse.json(doc, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
