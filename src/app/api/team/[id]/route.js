import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
    try {
        await connectDB();
        if (!mongoose.Types.ObjectId.isValid(params.id))
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        const member = await Team.findById(params.id).lean();
        if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(member);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        if (!mongoose.Types.ObjectId.isValid(params.id))
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        const body = await request.json();
        const member = await Team.findByIdAndUpdate(params.id, body, { new: true });
        if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(member);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        if (!mongoose.Types.ObjectId.isValid(params.id))
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        const result = await Team.findByIdAndDelete(params.id);
        if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
