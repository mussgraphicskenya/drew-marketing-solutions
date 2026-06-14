import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

async function getCollection() {
    await connectDB();
    return mongoose.connection.collection('messages');
}

function toOid(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new Error('Invalid id');
    return new mongoose.Types.ObjectId(id);
}

// GET /api/admin/messages/[id]
export async function GET(request, { params }) {
    try {
        const col = await getCollection();
        const doc = await col.findOne({ _id: toOid(params.id) });
        if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ ...doc, _id: doc._id.toString() });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

// PATCH /api/admin/messages/[id]  — body: { read: true|false }
export async function PATCH(request, { params }) {
    try {
        const body = await request.json();
        const col  = await getCollection();
        const result = await col.updateOne(
            { _id: toOid(params.id) },
            { $set: { ...body, updatedAt: new Date() } }
        );
        if (result.matchedCount === 0)
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

// DELETE /api/admin/messages/[id]
export async function DELETE(request, { params }) {
    try {
        const col    = await getCollection();
        const result = await col.deleteOne({ _id: toOid(params.id) });
        if (result.deletedCount === 0)
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
