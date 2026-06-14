import connectDB from '@/lib/mongodb';
import CaseStudy from '@/models/CaseStudy';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const caseStudy = await CaseStudy.findOne({ slug: params.slug });
        if (!caseStudy) {
            return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
        }
        return NextResponse.json(caseStudy);
    } catch (error) {
        // Log full error server-side for debugging
        console.error('[/api/case-studies] DB error:', error.message);
        return NextResponse.json(
            { error: error.message }, // expose real error during development
            { status: 500 }
        );
    }
}