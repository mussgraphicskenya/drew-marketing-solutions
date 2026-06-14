import connectDB from '@/lib/mongodb';
import Insight from '@/models/Insight';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();
        const insights = await Insight.find({}).sort({ createdAt: -1 });
        return NextResponse.json(insights);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const insight = await Insight.create(body);
        return NextResponse.json(insight, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create insight' }, { status: 500 });
    }
}