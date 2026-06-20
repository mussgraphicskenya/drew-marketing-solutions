import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

// GET /api/categories?type=case-study
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'case-study';
        const categories = await Category.find({ type }).sort({ name: 1 }).lean();
        return NextResponse.json(categories);
    } catch (err) {
        console.error('[GET /api/categories]', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/categories
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, type = 'case-study' } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        const trimmed = name.trim();

        // Check for duplicate (case-insensitive)
        const existing = await Category.findOne({
            name: { $regex: `^${trimmed}$`, $options: 'i' },
            type,
        });
        if (existing) {
            // Return the existing one so the UI can still select it
            return NextResponse.json(existing, { status: 200 });
        }

        const category = await Category.create({ name: trimmed, type });
        return NextResponse.json(category, { status: 201 });
    } catch (err) {
        console.error('[POST /api/categories]', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
