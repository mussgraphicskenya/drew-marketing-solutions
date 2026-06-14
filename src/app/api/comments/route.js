import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';

// POST /api/comments — public submission, saved as approved: false
export async function POST(request) {
    try {
        await connectDB();
        const { insightSlug, name, email, comment } = await request.json();

        if (!insightSlug || !name || !email || !comment) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        await Comment.create({ insightSlug, name, email, comment, approved: false });

        return NextResponse.json(
            { message: 'Your comment has been submitted for review.' },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json({ error: 'Failed to submit comment.' }, { status: 500 });
    }
}
