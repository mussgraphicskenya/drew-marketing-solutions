import connectDB from '@/lib/mongodb';
import Solution from '@/models/Solution';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();
        const solutions = await Solution.find({}).sort({ order: 1 });
        return NextResponse.json(solutions);
    } catch (error) {
        console.error('Solutions API Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const solution = await Solution.create(body);
        return NextResponse.json(solution, { status: 201 });
    } catch (error) {
        console.error('Solutions API Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}