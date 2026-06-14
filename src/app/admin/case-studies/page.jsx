import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Case Studies | Drew Admin' };



export default async function CaseStudiesPage() {
    await connectDB();
    const docs = await mongoose.connection
        .collection('casestudies')
        .find({})
        .sort({ _id: -1 })
        .toArray();

    const items = docs.map((d) => ({
        _id:        d._id.toString(),
        title:      d.title    ?? '—',
        industry:   d.industry ?? '—',
        client:     d.client   ?? '—',
        featured:   d.featured ?? false,
        slug:       d.slug     ?? '',
        coverImage: d.coverImage ?? '',
    }));

    const INDUSTRY_COLORS = {
        Retail:              { bg: 'rgba(0,196,140,0.12)', color: '#00c48c' },
        Technology:          { bg: 'rgba(79,110,247,0.12)', color: '#7b96fb' },
        'Financial Services':{ bg: 'rgba(247,193,55,0.12)', color: '#f7c137' },
    };

    function industryBadge(industry) {
        const c = INDUSTRY_COLORS[industry] ?? { bg: 'rgba(255,255,255,0.08)', color: '#9aa0b4' };
        return (
            <span style={{ background: c.bg, color: c.color, fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>
                {industry}
            </span>
        );
    }

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
                        <i className="bi bi-briefcase-fill me-2" style={{ color: '#ff3c00' }}></i>Case Studies
                    </span>
                </div>
                <Link
                    href="/admin/case-studies/new"
                    style={{ background: '#ff3c00', color: '#fff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <i className="bi bi-plus-lg"></i> Add New Case Study
                </Link>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
                <div className="mb-4">
                    <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>Case Studies</h1>
                    <p style={{ color: '#9aa0b4', margin: '4px 0 0', fontSize: '14px' }}>{items.length} case stud{items.length !== 1 ? 'ies' : 'y'} in the database</p>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No case studies yet. <Link href="/admin/case-studies/new" style={{ color: '#ff3c00' }}>Add the first one.</Link>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                        <table className="table table-dark mb-0" style={{ '--bs-table-bg': 'transparent', '--bs-table-border-color': 'rgba(255,255,255,0.07)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {['Title', 'Industry', 'Client', 'Slug', 'Featured', 'Actions'].map((h) => (
                                        <th key={h} style={{ color: '#9aa0b4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '14px 16px', color: '#e0e4f0', fontWeight: 500, maxWidth: '240px' }}>
                                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>{item.title}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>{industryBadge(item.industry)}</td>
                                        <td style={{ padding: '14px 16px', color: '#9aa0b4', fontSize: '14px' }}>{item.client}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <code style={{ color: '#7b96fb', fontSize: '12px', background: 'rgba(79,110,247,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{item.slug || '—'}</code>
                                        </td>
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
                                                    href={`/admin/case-studies/edit/${item._id}`}
                                                    style={{ background: 'rgba(255,60,0,0.12)', border: '1px solid rgba(255,60,0,0.25)', color: '#ff7c5c', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                                                >
                                                    <i className="bi bi-pencil me-1"></i>Edit
                                                </Link>
                                                <DeleteButton id={item._id} collectionName="casestudies" itemName={item.title} />
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
