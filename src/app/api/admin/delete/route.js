import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const ALLOWED_COLLECTIONS = ['insights', 'casestudies', 'solutions', 'testimonials', 'teams', 'messages', 'comments'];

export async function POST(request) {
    try {
        const { id, collectionName } = await request.json();

        if (!id || !collectionName) {
            return NextResponse.json({ error: 'Missing id or collectionName' }, { status: 400 });
        }

        if (!ALLOWED_COLLECTIONS.includes(collectionName)) {
            return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid id format' }, { status: 400 });
        }

        await connectDB();

        const result = await mongoose.connection
            .collection(collectionName)
            .deleteOne({ _id: new mongoose.Types.ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[admin/delete]', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
