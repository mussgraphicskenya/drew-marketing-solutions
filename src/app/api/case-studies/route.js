import connectDB from '@/lib/mongodb';
import CaseStudy from '@/models/CaseStudy';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();
        const caseStudies = await CaseStudy.find({}).sort({ createdAt: -1 });
        return NextResponse.json(caseStudies);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const caseStudy = await CaseStudy.create(body);
        return NextResponse.json(caseStudy, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create case study' }, { status: 500 });
    }
}