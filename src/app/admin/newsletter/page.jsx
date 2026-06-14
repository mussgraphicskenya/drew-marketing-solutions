import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';

export const metadata = { title: 'Newsletter Subscribers | Drew Admin' };

export default async function NewsletterPage() {
    await connectDB();
    const docs = await mongoose.connection
        .collection('newsletter')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    const items = docs.map((d) => ({
        _id:       d._id.toString(),
        email:     d.email ?? '—',
        createdAt: d.createdAt ? new Date(d.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
    }));

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e4f0', fontFamily: 'system-ui, sans-serif' }}>

            {/* ── Nav ── */}
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/admin" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-arrow-left"></i> Dashboard
                </Link>
                <span style={{ color: '#3a4055' }}>|</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>
                    <i className="bi bi-mailbox2-flag me-2" style={{ color: '#34d399' }}></i>Newsletter Subscribers
                </span>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
                <div className="mb-4">
                    <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>Newsletter Subscribers</h1>
                    <p style={{ color: '#9aa0b4', margin: '4px 0 0', fontSize: '14px' }}>{items.length} subscriber{items.length !== 1 ? 's' : ''}</p>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-envelope-x" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No subscribers yet.
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    <th style={{ padding: '14px 20px', textAlign: 'left', color: '#9aa0b4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>#</th>
                                    <th style={{ padding: '14px 20px', textAlign: 'left', color: '#9aa0b4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                                    <th style={{ padding: '14px 20px', textAlign: 'left', color: '#9aa0b4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subscribed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, idx) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '14px 20px', color: '#5a6070', fontSize: '14px' }}>{idx + 1}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <a href={`mailto:${item.email}`} style={{ color: '#34d399', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                                                {item.email}
                                            </a>
                                        </td>
                                        <td style={{ padding: '14px 20px', color: '#9aa0b4', fontSize: '13px' }}>{item.createdAt}</td>
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
