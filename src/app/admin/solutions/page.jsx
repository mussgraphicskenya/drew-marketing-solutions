import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Solutions | Drew Admin' };



export default async function SolutionsPage() {
    noStore();
    await connectDB();
    const docs = await mongoose.connection
        .collection('solutions')
        .find({})
        .sort({ order: 1 })
        .toArray();

    const items = docs.map((d) => ({
        _id:      d._id.toString(),
        title:    d.title    ?? '—',
        headline: d.headline ?? '—',
        order:    d.order    ?? 0,
        icon:     d.icon     ?? '',
        includes: Array.isArray(d.includes) ? d.includes : [],
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
                        <i className="bi bi-gear-fill me-2" style={{ color: '#00c48c' }}></i>Solutions
                    </span>
                </div>
                <Link
                    href="/admin/solutions/new"
                    style={{ background: '#00c48c', color: '#fff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <i className="bi bi-plus-lg"></i> Add New Solution
                </Link>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
                <div className="mb-4">
                    <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>Solutions</h1>
                    <p style={{ color: '#9aa0b4', margin: '4px 0 0', fontSize: '14px' }}>{items.length} solution{items.length !== 1 ? 's' : ''} — sorted by display order</p>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No solutions yet. <Link href="/admin/solutions/new" style={{ color: '#00c48c' }}>Add the first one.</Link>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                        <table className="table table-dark mb-0" style={{ '--bs-table-bg': 'transparent', '--bs-table-border-color': 'rgba(255,255,255,0.07)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {['#', 'Title', 'Headline', 'Includes', 'Actions'].map((h) => (
                                        <th key={h} style={{ color: '#9aa0b4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '14px 16px', width: '50px' }}>
                                            <span style={{ background: 'rgba(0,196,140,0.15)', color: '#00c48c', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
                                                {item.order}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: '#e0e4f0', fontWeight: 600, maxWidth: '220px' }}>
                                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>{item.title}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: '#9aa0b4', fontSize: '13px', maxWidth: '260px' }}>
                                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.headline}>{item.headline}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div className="d-flex flex-wrap gap-1">
                                                {item.includes.slice(0, 3).map((tag, i) => (
                                                    <span key={i} style={{ background: 'rgba(0,196,140,0.1)', color: '#00c48c', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>{tag}</span>
                                                ))}
                                                {item.includes.length > 3 && (
                                                    <span style={{ color: '#5a6070', fontSize: '11px' }}>+{item.includes.length - 3} more</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div className="d-flex align-items-center gap-2">
                                                {item.icon && (
                                                    <img
                                                        src={item.icon}
                                                        alt="thumb"
                                                        style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px', marginRight: '4px', verticalAlign: 'middle', flexShrink: 0 }}
                                                    />
                                                )}
                                                <Link
                                                    href={`/admin/solutions/edit/${item._id}`}
                                                    style={{ background: 'rgba(0,196,140,0.12)', border: '1px solid rgba(0,196,140,0.25)', color: '#00c48c', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                                                >
                                                    <i className="bi bi-pencil me-1"></i>Edit
                                                </Link>
                                                <DeleteButton id={item._id} collectionName="solutions" itemName={item.title} />
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
