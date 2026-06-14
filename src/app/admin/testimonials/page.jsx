import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Testimonials | Drew Admin' };



export default async function TestimonialsPage() {
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
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="d-flex align-items-center gap-3">
                    <Link href="/admin" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="bi bi-arrow-left"></i> Dashboard
                    </Link>
                    <span style={{ color: '#3a4055' }}>|</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>
                        <i className="bi bi-chat-quote-fill me-2" style={{ color: '#f7c137' }}></i>Testimonials
                    </span>
                </div>
                <Link
                    href="/admin/testimonials/new"
                    style={{ background: '#f7c137', color: '#0a0f1e', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <i className="bi bi-plus-lg"></i> Add New Testimonial
                </Link>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>Testimonials</h1>
                        <p style={{ color: '#9aa0b4', margin: '4px 0 0', fontSize: '14px' }}>
                            {items.length} total &mdash; <span style={{ color: '#f7c137' }}>{featuredCount} featured</span>
                        </p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No testimonials yet. <Link href="/admin/testimonials/new" style={{ color: '#f7c137' }}>Add the first one.</Link>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                        <table className="table table-dark mb-0" style={{ '--bs-table-bg': 'transparent', '--bs-table-border-color': 'rgba(255,255,255,0.07)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {['Name', 'Role', 'Company', 'Quote', 'Featured', 'Actions'].map((h) => (
                                        <th key={h} style={{ color: '#9aa0b4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(247,193,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f7c137', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                                                    {item.name.charAt(0)}
                                                </div>
                                                <span style={{ color: '#e0e4f0', fontWeight: 600, fontSize: '14px' }}>{item.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: '#9aa0b4', fontSize: '14px' }}>{item.role}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ background: 'rgba(247,193,55,0.1)', color: '#f7c137', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>{item.company}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', maxWidth: '260px' }}>
                                            <span style={{ color: '#9aa0b4', fontSize: '13px', fontStyle: 'italic', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.quote}>
                                                &ldquo;{item.quote}&rdquo;
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            {item.featured
                                                ? <span style={{ color: '#f7c137', fontSize: '13px' }}><i className="bi bi-star-fill me-1"></i>Yes</span>
                                                : <span style={{ color: '#5a6070', fontSize: '13px' }}><i className="bi bi-star me-1"></i>No</span>}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div className="d-flex align-items-center gap-2">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt="thumb"
                                                        style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '50%', marginRight: '4px', verticalAlign: 'middle', flexShrink: 0 }}
                                                    />
                                                )}
                                                <Link
                                                    href={`/admin/testimonials/edit/${item._id}`}
                                                    style={{ background: 'rgba(247,193,55,0.12)', border: '1px solid rgba(247,193,55,0.25)', color: '#f7c137', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                                                >
                                                    <i className="bi bi-pencil me-1"></i>Edit
                                                </Link>
                                                <DeleteButton id={item._id} collectionName="testimonials" itemName={item.name} />
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
