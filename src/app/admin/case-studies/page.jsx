import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Case Studies | Drew Admin' };

export default async function CaseStudiesPage() {
    noStore();
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
        Retail:               { bg: 'rgba(0,196,140,0.12)',   color: '#00c48c' },
        Technology:           { bg: 'rgba(79,110,247,0.12)',  color: '#7b96fb' },
        'Financial Services': { bg: 'rgba(247,193,55,0.12)',  color: '#f7c137' },
    };

    function industryStyle(industry) {
        return INDUSTRY_COLORS[industry] ?? { bg: 'rgba(255,255,255,0.08)', color: '#9aa0b4' };
    }

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
                        <i className="bi bi-briefcase-fill me-2" style={{ color: '#ff3c00' }}></i>Case Studies
                    </span>
                </div>
                <Link
                    href="/admin/case-studies/new"
                    style={{ background: '#ff3c00', color: '#fff', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
                >
                    <i className="bi bi-plus-lg"></i> <span className="d-none d-sm-inline">Add New</span><span className="d-sm-none">Add</span>
                </Link>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '20px 16px', maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Case Studies</h1>
                    <p style={{ color: '#9aa0b4', margin: 0, fontSize: '14px' }}>{items.length} case stud{items.length !== 1 ? 'ies' : 'y'} in the database</p>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No case studies yet. <Link href="/admin/case-studies/new" style={{ color: '#ff3c00' }}>Add the first one.</Link>
                    </div>
                ) : (
                    <div>
                        {items.map((item) => {
                            const iStyle = industryStyle(item.industry);
                            return (
                                <div key={item._id} style={{ background: '#1e2433', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                                    {/* Top row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <div style={{ color: '#e0e4f0', fontWeight: 600, fontSize: '15px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>
                                                {item.title}
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                                <span style={{ background: iStyle.bg, color: iStyle.color, fontSize: '12px', padding: '2px 10px', borderRadius: '20px', fontWeight: 600 }}>{item.industry}</span>
                                                <span style={{ color: '#9aa0b4', fontSize: '13px' }}>{item.client}</span>
                                                {item.slug && <code style={{ color: '#7b96fb', fontSize: '11px', background: 'rgba(79,110,247,0.1)', padding: '2px 7px', borderRadius: '4px' }}>{item.slug}</code>}
                                                {item.featured && <span style={{ color: '#00c48c', fontSize: '12px' }}><i className="bi bi-check-circle-fill me-1"></i>Featured</span>}
                                            </div>
                                        </div>
                                        {item.coverImage && (
                                            <img src={item.coverImage} alt="thumb" style={{ width: '60px', height: '42px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                                        )}
                                    </div>
                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <Link
                                            href={`/admin/case-studies/edit/${item._id}`}
                                            style={{ background: 'rgba(255,60,0,0.12)', border: '1px solid rgba(255,60,0,0.25)', color: '#ff7c5c', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <i className="bi bi-pencil"></i> Edit
                                        </Link>
                                        <DeleteButton id={item._id} collectionName="casestudies" itemName={item.title} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
