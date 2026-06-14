import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Testimonials | Drew Admin' };

export default async function TestimonialsPage() {
    noStore();
    await connectDB();
    const docs = await mongoose.connection
        .collection('testimonials')
        .find({})
        .sort({ _id: -1 })
        .toArray();

    const items = docs.map((d) => ({
        _id:      d._id.toString(),
        name:     d.name     ?? '—',
        role:     d.role     ?? '—',
        company:  d.company  ?? '—',
        quote:    d.quote    ?? '—',
        featured: d.featured ?? false,
        image:    d.image    ?? '',
    }));

    const featuredCount = items.filter((i) => i.featured).length;

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
                        <i className="bi bi-chat-quote-fill me-2" style={{ color: '#f7c137' }}></i>Testimonials
                    </span>
                </div>
                <Link
                    href="/admin/testimonials/new"
                    style={{ background: '#f7c137', color: '#0a0f1e', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
                >
                    <i className="bi bi-plus-lg"></i> <span className="d-none d-sm-inline">Add New</span><span className="d-sm-none">Add</span>
                </Link>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '20px 16px', maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Testimonials</h1>
                    <p style={{ color: '#9aa0b4', margin: 0, fontSize: '14px' }}>
                        {items.length} total — <span style={{ color: '#f7c137' }}>{featuredCount} featured</span>
                    </p>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No testimonials yet. <Link href="/admin/testimonials/new" style={{ color: '#f7c137' }}>Add the first one.</Link>
                    </div>
                ) : (
                    <div>
                        {items.map((item) => (
                            <div key={item._id} style={{ background: '#1e2433', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                                {/* Top row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                            ) : (
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(247,193,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f7c137', fontWeight: 700, fontSize: '15px', flexShrink: 0 }}>
                                                    {item.name.charAt(0)}
                                                </div>
                                            )}
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ color: '#e0e4f0', fontWeight: 600, fontSize: '15px' }}>{item.name}</div>
                                                <div style={{ color: '#9aa0b4', fontSize: '12px' }}>{item.role} · <span style={{ background: 'rgba(247,193,55,0.1)', color: '#f7c137', padding: '1px 7px', borderRadius: '20px', fontWeight: 600 }}>{item.company}</span></div>
                                            </div>
                                        </div>
                                        <p style={{ color: '#9aa0b4', fontSize: '13px', fontStyle: 'italic', margin: '8px 0 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            &ldquo;{item.quote}&rdquo;
                                        </p>
                                        {item.featured && (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px', color: '#f7c137', fontSize: '12px' }}>
                                                <i className="bi bi-star-fill"></i> Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <Link
                                        href={`/admin/testimonials/edit/${item._id}`}
                                        style={{ background: 'rgba(247,193,55,0.12)', border: '1px solid rgba(247,193,55,0.25)', color: '#f7c137', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <i className="bi bi-pencil"></i> Edit
                                    </Link>
                                    <DeleteButton id={item._id} collectionName="testimonials" itemName={item.name} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
