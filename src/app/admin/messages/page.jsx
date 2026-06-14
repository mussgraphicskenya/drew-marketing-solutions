import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';
import MarkReadButton from '@/app/Components/Admin/MarkReadButton';

export const metadata = { title: 'Messages | Drew Admin' };

export default async function MessagesPage() {
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
        read:      d.read      ?? false,   // treat missing field as unread
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
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="d-flex align-items-center gap-3">
                    <Link href="/admin" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="bi bi-arrow-left"></i> Dashboard
                    </Link>
                    <span style={{ color: '#3a4055' }}>|</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>
                        <i className="bi bi-envelope-fill me-2" style={{ color: '#a78bfa' }}></i>Messages
                    </span>
                    {unreadCount > 0 && (
                        <span style={{ background: '#ff3c00', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                            {unreadCount} unread
                        </span>
                    )}
                </div>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>Contact Messages</h1>
                        <p style={{ color: '#9aa0b4', margin: '4px 0 0', fontSize: '14px' }}>
                            {items.length} message{items.length !== 1 ? 's' : ''}
                            {unreadCount > 0 && (
                                <span style={{ color: '#ff7c5c', fontWeight: 600 }}> — {unreadCount} unread</span>
                            )}
                        </p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No messages yet.
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                        <table className="table table-dark mb-0" style={{ '--bs-table-bg': 'transparent', '--bs-table-border-color': 'rgba(255,255,255,0.07)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {['Status', 'From', 'Subject', 'Date', 'Actions'].map((h) => (
                                        <th key={h} style={{ color: '#9aa0b4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr
                                        key={item._id}
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            background: item.read ? 'transparent' : 'rgba(167,139,250,0.04)',
                                        }}
                                    >
                                        {/* Status badge */}
                                        <td style={{ padding: '14px 16px', width: '90px' }}>
                                            {item.read ? (
                                                <span style={{ color: '#3a4055', fontSize: '12px', fontWeight: 600 }}>
                                                    <i className="bi bi-check2-circle me-1"></i>Read
                                                </span>
                                            ) : (
                                                <span style={{ background: 'rgba(255,60,0,0.15)', color: '#ff7c5c', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', letterSpacing: '0.4px' }}>
                                                    UNREAD
                                                </span>
                                            )}
                                        </td>

                                        {/* From */}
                                        <td style={{ padding: '14px 16px', maxWidth: '200px' }}>
                                            <div style={{ color: item.read ? '#c8cdd8' : '#fff', fontWeight: item.read ? 400 : 700, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.name}
                                            </div>
                                            <div style={{ color: '#5a6070', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.email}
                                            </div>
                                        </td>

                                        {/* Subject */}
                                        <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                                            <span style={{ color: item.read ? '#9aa0b4' : '#e0e4f0', fontWeight: item.read ? 400 : 600, fontSize: '14px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.subject}>
                                                {item.subject}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td style={{ padding: '14px 16px', color: '#5a6070', fontSize: '13px', whiteSpace: 'nowrap' }}>
                                            {item.createdAt}
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '14px 16px' }}>
                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                <Link
                                                    href={`/admin/messages/${item._id}`}
                                                    style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                                >
                                                    <i className="bi bi-eye"></i>View
                                                </Link>
                                                <MarkReadButton id={item._id} isRead={item.read} />
                                                <DeleteButton id={item._id} collectionName="messages" itemName={`message from ${item.name}`} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
