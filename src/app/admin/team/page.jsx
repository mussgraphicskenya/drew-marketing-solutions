import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Team' };

const LIMIT = 10;

export default async function TeamPage({ searchParams }) {
    noStore();
    const currentPage = Math.max(1, parseInt(searchParams?.page || '1'));
    const skip = (currentPage - 1) * LIMIT;

    await connectDB();
    const col = mongoose.connection.collection('teams');

    const [docs, total] = await Promise.all([
        col.find({}).sort({ order: 1 }).skip(skip).limit(LIMIT).toArray(),
        col.countDocuments(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    const items = docs.map((d) => ({
        _id:      d._id.toString(),
        name:     d.name     ?? '—',
        role:     d.role     ?? '—',
        order:    d.order    ?? 0,
        image:    d.image    ?? '',
        facebook: d.facebook ?? '',
        twitter:  d.twitter  ?? '',
        linkedin: d.linkedin ?? '',
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
        <div style={{ fontFamily: 'var(--body-color-font, system-ui, sans-serif)', maxWidth: '1000px' }}>

            {/* Page header + Add button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ color: '#111827', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Team Members</h2>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>{total} member{total !== 1 ? 's' : ''} — sorted by display order</p>
                </div>
                <Link href="/admin/team/new" style={{ background: '#1B3A8C', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-plus-lg"></i> Add Member
                </Link>
            </div>

            {items.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9ca3af' }}>
                    <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                    No team members yet. <Link href="/admin/team/new" style={{ color: '#1B3A8C' }}>Add the first one.</Link>
                </div>
            ) : (
                <>
                    <div>
                        {items.map((item) => (
                            <div key={item._id} style={card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                                        <span style={{ background: 'rgba(232,121,249,0.12)', color: '#7e22ce', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                                            {item.order}
                                        </span>
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                        ) : (
                                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(232,121,249,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7e22ce', fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>
                                                {item.name.charAt(0)}
                                            </div>
                                        )}
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ color: '#111827', fontWeight: 600, fontSize: '15px' }}>{item.name}</div>
                                            <span style={{ background: '#f3e8ff', color: '#7e22ce', fontSize: '12px', padding: '2px 10px', borderRadius: '20px', fontWeight: 600 }}>{item.role}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                                        {item.facebook && <a href={item.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#4f6ef7', fontSize: '18px' }}><i className="bi bi-facebook"></i></a>}
                                        {item.twitter  && <a href={item.twitter}  target="_blank" rel="noopener noreferrer" style={{ color: '#374151', fontSize: '18px' }}><i className="bi bi-twitter-x"></i></a>}
                                        {item.linkedin && <a href={item.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', fontSize: '18px' }}><i className="bi bi-linkedin"></i></a>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <Link
                                        href={`/admin/team/edit/${item._id}`}
                                        style={{ background: '#f3e8ff', border: '1px solid #e9d5ff', color: '#7e22ce', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <i className="bi bi-pencil"></i> Edit
                                    </Link>
                                    <DeleteButton id={item._id} collectionName="teams" itemName={item.name} />
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
