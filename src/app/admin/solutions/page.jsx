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
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 16px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <Link href="/admin" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <i className="bi bi-arrow-left"></i> <span className="d-none d-sm-inline">Dashboard</span>
                    </Link>
                    <span style={{ color: '#3a4055' }}>|</span>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <i className="bi bi-gear-fill me-2" style={{ color: '#00c48c' }}></i>Solutions
                    </span>
                </div>
                <Link
                    href="/admin/solutions/new"
                    style={{ background: '#00c48c', color: '#fff', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
                >
                    <i className="bi bi-plus-lg"></i> <span className="d-none d-sm-inline">Add New</span><span className="d-sm-none">Add</span>
                </Link>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '20px 16px', maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Solutions</h1>
                    <p style={{ color: '#9aa0b4', margin: 0, fontSize: '14px' }}>{items.length} solution{items.length !== 1 ? 's' : ''} — sorted by display order</p>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No solutions yet. <Link href="/admin/solutions/new" style={{ color: '#00c48c' }}>Add the first one.</Link>
                    </div>
                ) : (
                    <div>
                        {items.map((item) => (
                            <div key={item._id} style={{ background: '#1e2433', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                                {/* Top row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                            <span style={{ background: 'rgba(0,196,140,0.15)', color: '#00c48c', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                                                {item.order}
                                            </span>
                                            <span style={{ color: '#e0e4f0', fontWeight: 600, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>
                                                {item.title}
                                            </span>
                                        </div>
                                        <p style={{ color: '#9aa0b4', fontSize: '13px', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.headline}>
                                            {item.headline}
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {item.includes.slice(0, 4).map((tag, i) => (
                                                <span key={i} style={{ background: 'rgba(0,196,140,0.1)', color: '#00c48c', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>{tag}</span>
                                            ))}
                                            {item.includes.length > 4 && (
                                                <span style={{ color: '#5a6070', fontSize: '11px' }}>+{item.includes.length - 4} more</span>
                                            )}
                                        </div>
                                    </div>
                                    {item.icon && (
                                        <img src={item.icon} alt="icon" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                                    )}
                                </div>
                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <Link
                                        href={`/admin/solutions/edit/${item._id}`}
                                        style={{ background: 'rgba(0,196,140,0.12)', border: '1px solid rgba(0,196,140,0.25)', color: '#00c48c', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <i className="bi bi-pencil"></i> Edit
                                    </Link>
                                    <DeleteButton id={item._id} collectionName="solutions" itemName={item.title} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
