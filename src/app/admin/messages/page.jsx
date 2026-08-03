import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';
import MarkReadButton from '@/app/Components/Admin/MarkReadButton';

export const metadata = { title: 'Messages' };

const LIMIT = 10;

export default async function MessagesPage({ searchParams }) {
    noStore();
    const currentPage = Math.max(1, parseInt(searchParams?.page || '1'));
    const skip = (currentPage - 1) * LIMIT;

    await connectDB();
    const col = mongoose.connection.collection('messages');

    // Sort: unread first, then newest — paginated
    const [docs, total, unreadCount] = await Promise.all([
        col.find({}).sort({ read: 1, createdAt: -1 }).skip(skip).limit(LIMIT).toArray(),
        col.countDocuments(),
        col.countDocuments({ read: { $ne: true } }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    const items = docs.map((d) => ({
        _id:       d._id.toString(),
        name:      d.name      ?? '—',
        email:     d.email     ?? '—',
        subject:   d.subject   ?? '—',
        phone:     d.phone     ?? '',
        message:   d.message   ?? '—',
        read:      d.read      ?? false,
        createdAt: d.createdAt
            ? new Date(d.createdAt).toLocaleString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
              })
            : '—',
    }));

    return (
        <div style={{ fontFamily: 'var(--body-color-font, system-ui, sans-serif)', maxWidth: '1200px' }}>

            {/* Page header */}
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#111827', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
                    Contact Messages
                </h2>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                    {total} message{total !== 1 ? 's' : ''}
                    {unreadCount > 0 && <span style={{ color: '#d97706', fontWeight: 600 }}> — {unreadCount} unread</span>}
                </p>
            </div>

            {items.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9ca3af' }}>
                    <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                    No messages yet.
                </div>
            ) : (
                <>
                    <div>
                        {items.map((item) => (
                            <div
                                key={item._id}
                                style={{
                                    background: item.read ? '#fff' : 'rgba(167,139,250,0.05)',
                                    border: item.read ? '1px solid #e5e7eb' : '1px solid rgba(167,139,250,0.3)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '12px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                }}
                            >
                                {/* Status + Date */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                                    {item.read ? (
                                        <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600 }}>
                                            <i className="bi bi-check2-circle me-1"></i>Read
                                        </span>
                                    ) : (
                                        <span style={{ background: 'rgba(247,148,29,0.12)', color: '#d97706', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
                                            UNREAD
                                        </span>
                                    )}
                                    <span style={{ color: '#9ca3af', fontSize: '12px', flexShrink: 0 }}>{item.createdAt}</span>
                                </div>

                                {/* Sender + Subject */}
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{ color: '#111827', fontWeight: item.read ? 500 : 700, fontSize: '15px', marginBottom: '2px' }}>
                                        {item.name}
                                    </div>
                                    <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.email}
                                    </div>
                                    <div style={{ color: item.read ? '#6b7280' : '#374151', fontWeight: item.read ? 400 : 600, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.subject}>
                                        {item.subject}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <Link
                                        href={`/admin/messages/${item._id}`}
                                        style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#7c3aed', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <i className="bi bi-eye"></i> View
                                    </Link>
                                    <MarkReadButton id={item._id} isRead={item.read} />
                                    <DeleteButton id={item._id} collectionName="messages" itemName={`message from ${item.name}`} />
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
                                <a href={`?page=${currentPage - 1}`} style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#374151', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                                    ← Previous
                                </a>
                            )}
                            <span style={{ background: '#1B3A8C', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
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
