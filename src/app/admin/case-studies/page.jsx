import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Case Studies | Drew Admin' };

const LIMIT = 10;

export default async function CaseStudiesPage({ searchParams }) {
    noStore();
    const currentPage = Math.max(1, parseInt(searchParams?.page || '1'));
    const skip = (currentPage - 1) * LIMIT;

    await connectDB();
    const col = mongoose.connection.collection('casestudies');

    const [docs, total] = await Promise.all([
        col.find({}).sort({ _id: -1 }).skip(skip).limit(LIMIT).toArray(),
        col.countDocuments(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

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
        Retail:               { bg: 'rgba(0,196,140,0.12)',  color: '#00c48c' },
        Technology:           { bg: 'rgba(79,110,247,0.12)', color: '#7b96fb' },
        'Financial Services': { bg: 'rgba(247,193,55,0.12)', color: '#f7c137' },
    };

    function industryStyle(industry) {
        return INDUSTRY_COLORS[industry] ?? { bg: 'rgba(255,255,255,0.08)', color: '#9aa0b4' };
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e4f0', fontFamily: 'system-ui, sans-serif' }}>

            {/* ── Nav ── */}
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 16px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
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
                    <p style={{ color: '#9aa0b4', margin: 0, fontSize: '14px' }}>{total} case stud{total !== 1 ? 'ies' : 'y'} in the database</p>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No case studies yet. <Link href="/admin/case-studies/new" style={{ color: '#ff3c00' }}>Add the first one.</Link>
                    </div>
                ) : (
                    <>
                        <div>
                            {items.map((item) => {
                                const iStyle = industryStyle(item.industry);
                                return (
                                    <div key={item._id} style={{ background: '#1e2433', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
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

                        {/* ── Pagination ── */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
                            <p style={{ color: '#9aa0b4', margin: 0, fontSize: '14px' }}>
                                Showing {skip + 1}–{Math.min(skip + LIMIT, total)} of {total} items
                            </p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {currentPage > 1 && (
                                    <a href={`?page=${currentPage - 1}`} style={{ background: '#2a3142', color: '#e0e4f0', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                                        ← Previous
                                    </a>
                                )}
                                <span style={{ background: '#ff3c00', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                {currentPage < totalPages && (
                                    <a href={`?page=${currentPage + 1}`} style={{ background: '#2a3142', color: '#e0e4f0', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                                        Next →
                                    </a>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
