import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Insights' };

const LIMIT = 10;

export default async function InsightsPage({ searchParams }) {
    noStore();
    const currentPage = Math.max(1, parseInt(searchParams?.page || '1'));
    const skip = (currentPage - 1) * LIMIT;

    await connectDB();
    const col = mongoose.connection.collection('insights');

    const [docs, total] = await Promise.all([
        col.find({}).sort({ createdAt: -1 }).skip(skip).limit(LIMIT).toArray(),
        col.countDocuments(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    const items = docs.map((d) => ({
        _id:        d._id.toString(),
        title:      d.title     ?? '—',
        category:   d.category  ?? '—',
        author:     d.author    ?? '—',
        featured:   d.featured  ?? false,
        coverImage: d.coverImage ?? '',
        createdAt:  d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB') : '—',
    }));

    const card = {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    };

    return (
        <div style={{ fontFamily: 'var(--body-color-font, system-ui, sans-serif)', maxWidth: '1100px' }}>

            {/* Page header + Add button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ color: '#111827', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Insights</h2>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>{total} article{total !== 1 ? 's' : ''} in the database</p>
                </div>
                <Link href="/admin/insights/new" style={{ background: '#1B3A8C', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-plus-lg"></i> Add New
                </Link>
            </div>

            {items.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9ca3af' }}>
                    <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                    No insights yet. <Link href="/admin/insights/new" style={{ color: '#1B3A8C' }}>Add the first one.</Link>
                </div>
            ) : (
                <>
                    <div>
                        {items.map((item) => (
                            <div key={item._id} style={card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ color: '#111827', fontWeight: 600, fontSize: '15px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>
                                            {item.title}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ background: '#eef2ff', color: '#4338ca', fontSize: '12px', padding: '2px 10px', borderRadius: '20px', fontWeight: 600 }}>{item.category}</span>
                                            <span style={{ color: '#9ca3af', fontSize: '12px' }}>{item.author}</span>
                                            <span style={{ color: '#9ca3af', fontSize: '12px' }}>{item.createdAt}</span>
                                            {item.featured && <span style={{ color: '#047857', fontSize: '12px', fontWeight: 600 }}><i className="bi bi-check-circle-fill me-1"></i>Featured</span>}
                                        </div>
                                    </div>
                                    {item.coverImage && (
                                        <img src={item.coverImage} alt="thumb" style={{ width: '60px', height: '42px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <Link
                                        href={`/admin/insights/edit/${item._id}`}
                                        style={{ background: '#eef2ff', border: '1px solid #c7d2fe', color: '#4338ca', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <i className="bi bi-pencil"></i> Edit
                                    </Link>
                                    <DeleteButton id={item._id} collectionName="insights" itemName={item.title} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
                        <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                            Showing {skip + 1}–{Math.min(skip + LIMIT, total)} of {total} items
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {currentPage > 1 && (
                                <a href={`?page=${currentPage - 1}`} style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#374151', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>← Previous</a>
                            )}
                            <span style={{ background: '#1B3A8C', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 700 }}>
                                Page {currentPage} of {totalPages}
                            </span>
                            {currentPage < totalPages && (
                                <a href={`?page=${currentPage + 1}`} style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#374151', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Next →</a>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
