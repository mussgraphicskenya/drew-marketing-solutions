import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import MarkReadButton from '@/app/Components/Admin/MarkReadButton';
import DeleteButton from '../../DeleteButton';

export async function generateMetadata({ params }) {
    await connectDB();
    const doc = await mongoose.connection
        .collection('messages')
        .findOne({ _id: new mongoose.Types.ObjectId(params.id) });
    return { title: doc ? `Message from ${doc.name} | Drew Admin` : 'Message | Drew Admin' };
}

export default async function MessageDetailPage({ params }) {
    if (!mongoose.Types.ObjectId.isValid(params.id)) redirect('/admin/messages');

    await connectDB();

    const doc = await mongoose.connection
        .collection('messages')
        .findOne({ _id: new mongoose.Types.ObjectId(params.id) });

    if (!doc) redirect('/admin/messages');

    // Auto-mark as read when viewed
    if (!doc.read) {
        await mongoose.connection
            .collection('messages')
            .updateOne(
                { _id: new mongoose.Types.ObjectId(params.id) },
                { $set: { read: true, updatedAt: new Date() } }
            );
    }

    const item = {
        _id:       doc._id.toString(),
        name:      doc.name    ?? '—',
        email:     doc.email   ?? '—',
        subject:   doc.subject ?? '—',
        phone:     doc.phone   ?? '',
        message:   doc.message ?? '—',
        read:      true, // just marked read (or was already)
        createdAt: doc.createdAt
            ? new Date(doc.createdAt).toLocaleString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long',
                  day: 'numeric', hour: '2-digit', minute: '2-digit',
              })
            : '—',
    };

    const fieldStyle = {
        background:   'rgba(255,255,255,0.03)',
        border:       '1px solid rgba(255,255,255,0.07)',
        borderRadius: '8px',
        padding:      '14px 18px',
        marginBottom: '12px',
    };
    const labelStyle = { color: '#5a6070', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' };
    const valueStyle = { color: '#e0e4f0', fontSize: '15px', margin: 0 };

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e4f0', fontFamily: 'system-ui, sans-serif' }}>

            {/* ── Nav ── */}
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="d-flex align-items-center gap-3">
                    <Link href="/admin/messages" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="bi bi-arrow-left"></i> Messages
                    </Link>
                    <span style={{ color: '#3a4055' }}>|</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>
                        <i className="bi bi-envelope-open-fill me-2" style={{ color: '#a78bfa' }}></i>Message Detail
                    </span>
                </div>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '32px', maxWidth: '760px', margin: '0 auto' }}>

                {/* Header */}
                <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
                            {item.subject}
                        </h1>
                        <p style={{ color: '#5a6070', fontSize: '13px', margin: 0 }}>
                            <i className="bi bi-clock me-1"></i>{item.createdAt}
                        </p>
                    </div>
                    <span style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.4px' }}>
                        <i className="bi bi-check2-circle me-1"></i>READ
                    </span>
                </div>

                {/* Sender details */}
                <div style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontWeight: 700, fontSize: '20px', flexShrink: 0 }}>
                        {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>{item.name}</div>
                        <div style={{ color: '#9aa0b4', fontSize: '14px' }}>
                            <i className="bi bi-envelope me-1"></i>
                            <a href={`mailto:${item.email}`} style={{ color: '#a78bfa', textDecoration: 'none' }}>{item.email}</a>
                        </div>
                        {item.phone && (
                            <div style={{ color: '#9aa0b4', fontSize: '13px', marginTop: '2px' }}>
                                <i className="bi bi-phone me-1"></i>{item.phone}
                            </div>
                        )}
                    </div>
                </div>

                {/* Message body */}
                <div style={{ ...fieldStyle, marginTop: '4px' }}>
                    <p style={labelStyle}>Message</p>
                    <p style={{ ...valueStyle, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: '#c8cdd8' }}>
                        {item.message}
                    </p>
                </div>

                {/* Action buttons */}
                <div className="d-flex align-items-center gap-3 flex-wrap mt-4">
                    <a
                        href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject)}`}
                        style={{ background: '#a78bfa', color: '#fff', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '7px' }}
                    >
                        <i className="bi bi-reply-fill"></i>Reply via Email
                    </a>

                    <MarkReadButton id={item._id} isRead={item.read} />

                    <DeleteButton
                        id={item._id}
                        collectionName="messages"
                        itemName={`message from ${item.name}`}
                    />

                    <Link href="/admin/messages" style={{ color: '#5a6070', fontSize: '14px', textDecoration: 'none', marginLeft: 'auto' }}>
                        <i className="bi bi-arrow-left me-1"></i>Back to Messages
                    </Link>
                </div>
            </main>
        </div>
    );
}
