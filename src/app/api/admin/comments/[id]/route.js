import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';

// PATCH /api/admin/comments/[id] — approve a comment
export async function PATCH(request, { params }) {
    try {
        await connectDB();
        const updated = await Comment.findByIdAndUpdate(
            params.id,
            { approved: true },
            { new: true }
        );
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(updated);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE /api/admin/comments/[id] — reject / delete a comment
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const result = await Comment.findByIdAndDelete(params.id);
        if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
