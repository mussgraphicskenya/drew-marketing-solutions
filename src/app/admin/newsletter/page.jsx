import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export const metadata = { title: 'Newsletter' };

const LIMIT = 10;

export default async function NewsletterPage({ searchParams }) {
    noStore();
    const currentPage = Math.max(1, parseInt(searchParams?.page || '1'));
    const skip = (currentPage - 1) * LIMIT;

    await connectDB();
    const col = mongoose.connection.collection('newsletter');

    const [docs, total] = await Promise.all([
        col.find({}).sort({ createdAt: -1 }).skip(skip).limit(LIMIT).toArray(),
        col.countDocuments(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    const items = docs.map((d, idx) => ({
        _id:       d._id.toString(),
        email:     d.email ?? '—',
        createdAt: d.createdAt
            ? new Date(d.createdAt).toLocaleString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
              })
            : '—',
        globalIndex: skip + idx + 1,
    }));

    /* shared card style */
    const card = {
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    };

    return (
        <div style={{ fontFamily: 'var(--body-color-font, system-ui, sans-serif)', maxWidth: '900px' }}>

            {/* Page header */}
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#111827', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
                    Newsletter Subscribers
                </h2>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                    {total} subscriber{total !== 1 ? 's' : ''}
                </p>
            </div>

            {items.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9ca3af' }}>
                    <i className="bi bi-envelope-x" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                    No subscribers yet.
                </div>
            ) : (
                <>
                    <div>
                        {items.map((item) => (
                            <div key={item._id} style={card}>
                                {/* Left: email + date */}
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <a
                                        href={`mailto:${item.email}`}
                                        style={{ color: '#1B3A8C', fontWeight: 600, fontSize: '15px', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                        title={item.email}
                                    >
                                        {item.email}
                                    </a>
                                    <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>
                                        <i className="bi bi-calendar3 me-1"></i>Subscribed: {item.createdAt}
                                    </div>
                                </div>

                                {/* Right: subscriber number badge */}
                                <div style={{
                                    background: 'rgba(52,211,153,0.1)',
                                    color: '#059669',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    flexShrink: 0,
                                    letterSpacing: '0.3px',
                                }}>
                                    #{item.globalIndex}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
                        <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                            Showing {skip + 1}–{Math.min(skip + LIMIT, total)} of {total} subscribers
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {currentPage > 1 && (
                                <a href={`?page=${currentPage - 1}`} style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#374151', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                                    ← Previous
                                </a>
                            )}
                            <span style={{ background: '#1B3A8C', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 700 }}>
                                Page {currentPage} of {totalPages}
                            </span>
                            {currentPage < totalPages && (
                                <a href={`?page=${currentPage + 1}`} style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#374151', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                                    Next →
                                </a>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
