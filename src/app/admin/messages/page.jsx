import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';
import MarkReadButton from '@/app/Components/Admin/MarkReadButton';

export const metadata = { title: 'Messages | Drew Admin' };

export default async function MessagesPage() {
    noStore();
    await connectDB();

    // Sort: unread first, then by newest
    const docs = await mongoose.connection
        .collection('messages')
        .find({})
        .sort({ read: 1, createdAt: -1 })
        .toArray();

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

    const unreadCount = items.filter((i) => !i.read).length;

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e4f0', fontFamily: 'system-ui, sans-serif' }}>

            {/* ── Nav ── */}
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 16px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <Link href="/admin" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <i className="bi bi-arrow-left"></i> <span className="d-none d-sm-inline">Dashboard</span>
                    </Link>
                    <span style={{ color: '#3a4055' }}>|</span>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <i className="bi bi-envelope-fill me-2" style={{ color: '#a78bfa' }}></i>Messages
                    </span>
                    {unreadCount > 0 && (
                        <span style={{ background: '#ff3c00', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>
                            {unreadCount}
                        </span>
                    )}
                </div>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '20px 16px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Contact Messages</h1>
                    <p style={{ color: '#9aa0b4', margin: 0, fontSize: '14px' }}>
                        {items.length} message{items.length !== 1 ? 's' : ''}
                        {unreadCount > 0 && <span style={{ color: '#ff7c5c', fontWeight: 600 }}> — {unreadCount} unread</span>}
                    </p>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No messages yet.
                    </div>
                ) : (
                    <div>
                        {items.map((item) => (
                            <div
                                key={item._id}
                                style={{
                                    background: item.read ? '#1e2433' : 'rgba(167,139,250,0.06)',
                                    border: item.read ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(167,139,250,0.2)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '12px',
                                }}
                            >
                                {/* Status + Date row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                                    {item.read ? (
                                        <span style={{ color: '#3a4055', fontSize: '12px', fontWeight: 600 }}>
                                            <i className="bi bi-check2-circle me-1"></i>Read
                                        </span>
                                    ) : (
                                        <span style={{ background: 'rgba(255,60,0,0.15)', color: '#ff7c5c', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
                                            UNREAD
                                        </span>
                                    )}
                                    <span style={{ color: '#5a6070', fontSize: '12px', flexShrink: 0 }}>{item.createdAt}</span>
                                </div>

                                {/* Sender + Subject */}
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{ color: item.read ? '#c8cdd8' : '#fff', fontWeight: item.read ? 400 : 700, fontSize: '15px', marginBottom: '2px' }}>
                                        {item.name}
                                    </div>
                                    <div style={{ color: '#5a6070', fontSize: '12px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.email}
                                    </div>
                                    <div style={{ color: item.read ? '#9aa0b4' : '#e0e4f0', fontWeight: item.read ? 400 : 600, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.subject}>
                                        {item.subject}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <Link
                                        href={`/admin/messages/${item._id}`}
                                        style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <i className="bi bi-eye"></i> View
                                    </Link>
                                    <MarkReadButton id={item._id} isRead={item.read} />
                                    <DeleteButton id={item._id} collectionName="messages" itemName={`message from ${item.name}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
