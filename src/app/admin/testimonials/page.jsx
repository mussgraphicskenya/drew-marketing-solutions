import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Testimonials' };

const LIMIT = 10;

export default async function TestimonialsPage({ searchParams }) {
    noStore();
    const currentPage = Math.max(1, parseInt(searchParams?.page || '1'));
    const skip = (currentPage - 1) * LIMIT;

    await connectDB();
    const col = mongoose.connection.collection('testimonials');

    const [docs, total] = await Promise.all([
        col.find({}).sort({ _id: -1 }).skip(skip).limit(LIMIT).toArray(),
        col.countDocuments(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const featuredCount = await col.countDocuments({ featured: true });

    const items = docs.map((d) => ({
        _id:      d._id.toString(),
        name:     d.name     ?? '—',
        role:     d.role     ?? '—',
        company:  d.company  ?? '—',
        quote:    d.quote    ?? '—',
        featured: d.featured ?? false,
        image:    d.image    ?? '',
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
                    <h2 style={{ color: '#111827', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Testimonials</h2>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                        {total} total — <span style={{ color: '#d97706', fontWeight: 600 }}>{featuredCount} featured</span>
                    </p>
                </div>
                <Link href="/admin/testimonials/new" style={{ background: '#1B3A8C', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-plus-lg"></i> Add New
                </Link>
            </div>

            {items.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9ca3af' }}>
                    <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                    No testimonials yet. <Link href="/admin/testimonials/new" style={{ color: '#1B3A8C' }}>Add the first one.</Link>
                </div>
            ) : (
                <>
                    <div>
                        {items.map((item) => (
                            <div key={item._id} style={card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                            ) : (
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(247,193,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', fontWeight: 700, fontSize: '15px', flexShrink: 0 }}>
                                                    {item.name.charAt(0)}
                                                </div>
                                            )}
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ color: '#111827', fontWeight: 600, fontSize: '15px' }}>{item.name}</div>
                                                <div style={{ color: '#6b7280', fontSize: '12px' }}>{item.role} · <span style={{ background: '#fef3c7', color: '#d97706', padding: '1px 7px', borderRadius: '20px', fontWeight: 600 }}>{item.company}</span></div>
                                            </div>
                                        </div>
                                        <p style={{ color: '#374151', fontSize: '13px', fontStyle: 'italic', margin: '8px 0 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            &ldquo;{item.quote}&rdquo;
                                        </p>
                                        {item.featured && (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px', color: '#d97706', fontSize: '12px', fontWeight: 600 }}>
                                                <i className="bi bi-star-fill"></i> Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <Link
                                        href={`/admin/testimonials/edit/${item._id}`}
                                        style={{ background: 'rgba(247,193,55,0.1)', border: '1px solid rgba(247,193,55,0.3)', color: '#d97706', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <i className="bi bi-pencil"></i> Edit
                                    </Link>
                                    <DeleteButton id={item._id} collectionName="testimonials" itemName={item.name} />
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
