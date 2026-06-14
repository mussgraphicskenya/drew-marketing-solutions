import connectDB from '@/lib/mongodb';
import Insight from '@/models/Insight';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const insight = await Insight.findOne({ slug: params.slug });
        if (!insight) {
            return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
        }
        return NextResponse.json(insight);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch insight' }, { status: 500 });
    }
}