import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Insights | Drew Admin' };



export default async function InsightsPage() {
    noStore();
    await connectDB();
    const docs = await mongoose.connection
        .collection('insights')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    const items = docs.map((d) => ({
        _id:        d._id.toString(),
        title:      d.title     ?? '—',
        category:   d.category  ?? '—',
        author:     d.author    ?? '—',
        featured:   d.featured  ?? false,
        coverImage: d.coverImage ?? '',
        createdAt:  d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB') : '—',
    }));

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
                        <i className="bi bi-pencil-square me-2" style={{ color: '#4f6ef7' }}></i>Insights
                    </span>
                </div>
                <Link
                    href="/admin/insights/new"
                    style={{ background: '#4f6ef7', color: '#fff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <i className="bi bi-plus-lg"></i> Add New Insight
                </Link>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>Insights</h1>
                        <p style={{ color: '#9aa0b4', margin: '4px 0 0', fontSize: '14px' }}>{items.length} article{items.length !== 1 ? 's' : ''} in the database</p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No insights yet. <Link href="/admin/insights/new" style={{ color: '#4f6ef7' }}>Add the first one.</Link>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                        <table className="table table-dark mb-0" style={{ '--bs-table-bg': 'transparent', '--bs-table-border-color': 'rgba(255,255,255,0.07)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {['Title', 'Category', 'Author', 'Date', 'Featured', 'Actions'].map((h) => (
                                        <th key={h} style={{ color: '#9aa0b4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '14px 16px', color: '#e0e4f0', fontWeight: 500, maxWidth: '260px' }}>
                                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>{item.title}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ background: 'rgba(79,110,247,0.15)', color: '#7b96fb', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>{item.category}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: '#9aa0b4', fontSize: '14px' }}>{item.author}</td>
                                        <td style={{ padding: '14px 16px', color: '#9aa0b4', fontSize: '14px' }}>{item.createdAt}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            {item.featured
                                                ? <span style={{ color: '#00c48c', fontSize: '13px' }}><i className="bi bi-check-circle-fill me-1"></i>Yes</span>
                                                : <span style={{ color: '#5a6070', fontSize: '13px' }}><i className="bi bi-dash-circle me-1"></i>No</span>}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div className="d-flex align-items-center gap-2">
                                                {item.coverImage && (
                                                    <img
                                                        src={item.coverImage}
                                                        alt="thumb"
                                                        style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px', marginRight: '4px', verticalAlign: 'middle', flexShrink: 0 }}
                                                    />
                                                )}
                                                <Link
                                                    href={`/admin/insights/edit/${item._id}`}
                                                    style={{ background: 'rgba(79,110,247,0.15)', border: '1px solid rgba(79,110,247,0.3)', color: '#7b96fb', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                                                >
                                                    <i className="bi bi-pencil me-1"></i>Edit
                                                </Link>
                                                <DeleteButton id={item._id} collectionName="insights" itemName={item.title} />
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
