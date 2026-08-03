import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Solutions' };

const LIMIT = 10;

export default async function SolutionsPage({ searchParams }) {
    noStore();
    const currentPage = Math.max(1, parseInt(searchParams?.page || '1'));
    const skip = (currentPage - 1) * LIMIT;

    await connectDB();
    const col = mongoose.connection.collection('solutions');

    const [docs, total] = await Promise.all([
        col.find({}).sort({ order: 1 }).skip(skip).limit(LIMIT).toArray(),
        col.countDocuments(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    const items = docs.map((d) => ({
        _id:      d._id.toString(),
        title:    d.title    ?? '—',
        headline: d.headline ?? '—',
        order:    d.order    ?? 0,
        icon:     d.icon     ?? '',
        featured: d.featured ?? false,
        includes: Array.isArray(d.includes) ? d.includes : [],
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
                    <h2 style={{ color: '#111827', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Solutions</h2>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>{total} solution{total !== 1 ? 's' : ''} — sorted by display order</p>
                </div>
                <Link href="/admin/solutions/new" style={{ background: '#1B3A8C', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-plus-lg"></i> Add New
                </Link>
            </div>

            {items.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9ca3af' }}>
                    <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                    No solutions yet. <Link href="/admin/solutions/new" style={{ color: '#1B3A8C' }}>Add the first one.</Link>
                </div>
            ) : (
                <>
                    <div>
                        {items.map((item) => (
                            <div key={item._id} style={card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                            <span style={{ background: 'rgba(0,196,140,0.12)', color: '#047857', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                                                {item.order}
                                            </span>
                                            <span style={{ color: '#111827', fontWeight: 600, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>
                                                {item.title}
                                            </span>
                                            {item.featured && (
                                                <span title="Shown on homepage" style={{ background: '#d1fae5', color: '#047857', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <i className="bi bi-star-fill"></i> Featured
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.headline}>
                                            {item.headline}
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {item.includes.slice(0, 4).map((tag, i) => (
                                                <span key={i} style={{ background: '#f3f4f6', color: '#374151', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>{tag}</span>
                                            ))}
                                            {item.includes.length > 4 && (
                                                <span style={{ color: '#9ca3af', fontSize: '11px' }}>+{item.includes.length - 4} more</span>
                                            )}
                                        </div>
                                    </div>
                                    {item.icon && (
                                        <img src={item.icon} alt="icon" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <Link
                                        href={`/admin/solutions/edit/${item._id}`}
                                        style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#047857', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <i className="bi bi-pencil"></i> Edit
                                    </Link>
                                    <DeleteButton id={item._id} collectionName="solutions" itemName={item.title} />
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
