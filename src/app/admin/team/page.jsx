import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Link from 'next/link';
import DeleteButton from '../DeleteButton';

export const metadata = { title: 'Team | Drew Admin' };

export default async function TeamPage() {
    noStore();
    await connectDB();
    const docs = await mongoose.connection
        .collection('teams')
        .find({})
        .sort({ order: 1 })
        .toArray();

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
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="d-flex align-items-center gap-3">
                    <Link href="/admin" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="bi bi-arrow-left"></i> Dashboard
                    </Link>
                    <span style={{ color: '#3a4055' }}>|</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>
                        <i className="bi bi-people-fill me-2" style={{ color: '#e879f9' }}></i>Team Members
                    </span>
                </div>
                <Link
                    href="/admin/team/new"
                    style={{ background: '#e879f9', color: '#fff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <i className="bi bi-plus-lg"></i> Add Team Member
                </Link>
            </nav>

            {/* ── Body ── */}
            <main style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>Team Members</h1>
                        <p style={{ color: '#9aa0b4', margin: '4px 0 0', fontSize: '14px' }}>{items.length} member{items.length !== 1 ? 's' : ''} — sorted by display order</p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#9aa0b4' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                        No team members yet. <Link href="/admin/team/new" style={{ color: '#e879f9' }}>Add the first one.</Link>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                        <table className="table table-dark mb-0" style={{ '--bs-table-bg': 'transparent', '--bs-table-border-color': 'rgba(255,255,255,0.07)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {['#', 'Member', 'Role', 'Social', 'Actions'].map((h) => (
                                        <th key={h} style={{ color: '#9aa0b4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '14px 16px', width: '50px' }}>
                                            <span style={{ background: 'rgba(232,121,249,0.15)', color: '#e879f9', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
                                                {item.order}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                                ) : (
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(232,121,249,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e879f9', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
                                                        {item.name.charAt(0)}
                                                    </div>
                                                )}
                                                <span style={{ color: '#e0e4f0', fontWeight: 600, fontSize: '14px' }}>{item.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ background: 'rgba(232,121,249,0.1)', color: '#e879f9', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>{item.role}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div className="d-flex gap-2">
                                                {item.facebook && <a href={item.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#4f6ef7', fontSize: '16px' }}><i className="bi bi-facebook"></i></a>}
                                                {item.twitter  && <a href={item.twitter}  target="_blank" rel="noopener noreferrer" style={{ color: '#9aa0b4', fontSize: '16px' }}><i className="bi bi-twitter-x"></i></a>}
                                                {item.linkedin && <a href={item.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', fontSize: '16px' }}><i className="bi bi-linkedin"></i></a>}
                                                {!item.facebook && !item.twitter && !item.linkedin && <span style={{ color: '#3a4055', fontSize: '13px' }}>—</span>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div className="d-flex align-items-center gap-2">
                                                <Link
                                                    href={`/admin/team/edit/${item._id}`}
                                                    style={{ background: 'rgba(232,121,249,0.12)', border: '1px solid rgba(232,121,249,0.25)', color: '#e879f9', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                                                >
                                                    <i className="bi bi-pencil me-1"></i>Edit
                                                </Link>
                                                <DeleteButton id={item._id} collectionName="teams" itemName={item.name} />
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
