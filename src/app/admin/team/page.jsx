import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Team | Drew Admin' };

const LIMIT = 10;

export default async function TeamPage({ searchParams }) {
    noStore();
    const currentPage = Math.max(1, parseInt(searchParams?.page || '1'));
    const skip = (currentPage - 1) * LIMIT;

    await connectDB();
    const col = mongoose.connection.collection('teams');

    const [docs, total] = await Promise.all([
        col.find({}).sort({ order: 1 }).skip(skip).limit(LIMIT).toArray(),
        col.countDocuments(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    const items = docs.map((d) => ({
        _id:      d._id.toString(),
        name:     d.name     ?? '—',
        role:     d.role     ?? '—',
        order:    d.order    ?? 0,
        image:    d.image    ?? '',
        facebook: d.facebook ?? '',
        twitter:  d.twitter  ?? '',
        linkedin: d.linkedin ?? '',
    }));

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
                        <i className="bi bi-people-fill me-2" style={{ color: '#e879f9' }}></i>Team Members
                    </span>
                </div>
                <Link
                    href="/admin/team/new"
                    style={{ background: '#e879f9', color: '#fff', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
                >
                    <i className="bi bi-plus-lg"></i> <span className="d-none d-sm-inline">Add Member</span><span className="d-sm-none">Add</span>
                </Link>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '20px 16px', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Team Members</h1>
                    <p style={{ color: '#9aa0b4', margin: 0, fontSize: '14px' }}>{total} member{total !== 1 ? 's' : ''} — sorted by display order</p>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No team members yet. <Link href="/admin/team/new" style={{ color: '#e879f9' }}>Add the first one.</Link>
                    </div>
                ) : (
                    <>
                        <div>
                            {items.map((item) => (
                                <div key={item._id} style={{ background: '#1e2433', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                                            <span style={{ background: 'rgba(232,121,249,0.15)', color: '#e879f9', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                                                {item.order}
                                            </span>
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                            ) : (
                                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(232,121,249,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e879f9', fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>
                                                    {item.name.charAt(0)}
                                                </div>
                                            )}
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ color: '#e0e4f0', fontWeight: 600, fontSize: '15px' }}>{item.name}</div>
                                                <span style={{ background: 'rgba(232,121,249,0.1)', color: '#e879f9', fontSize: '12px', padding: '2px 10px', borderRadius: '20px', fontWeight: 600 }}>{item.role}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                                            {item.facebook && <a href={item.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#4f6ef7', fontSize: '18px' }}><i className="bi bi-facebook"></i></a>}
                                            {item.twitter  && <a href={item.twitter}  target="_blank" rel="noopener noreferrer" style={{ color: '#9aa0b4', fontSize: '18px' }}><i className="bi bi-twitter-x"></i></a>}
                                            {item.linkedin && <a href={item.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', fontSize: '18px' }}><i className="bi bi-linkedin"></i></a>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <Link
                                            href={`/admin/team/edit/${item._id}`}
                                            style={{ background: 'rgba(232,121,249,0.12)', border: '1px solid rgba(232,121,249,0.25)', color: '#e879f9', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <i className="bi bi-pencil"></i> Edit
                                        </Link>
                                        <DeleteButton id={item._id} collectionName="teams" itemName={item.name} />
                                    </div>
                                </div>
                            ))}
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
                                <span style={{ background: '#e879f9', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
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
