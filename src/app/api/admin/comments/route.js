import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

// GET /api/admin/comments — fetch all pending (unapproved) comments
export async function GET() {
    noStore();
    try {
        await connectDB();
        const comments = await Comment.find({ approved: false }).sort({ createdAt: -1 });
        return NextResponse.json(comments);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
