import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export const metadata = {
    title: 'Dashboard',
};

const COLLECTIONS = [
    {
        key:         'insights',
        label:       'Insights',
        description: 'Blog posts & thought leadership articles',
        icon:        'bi-lightbulb-fill',
        color:       '#4f6ef7',
        bg:          'rgba(79,110,247,0.10)',
        href:        '/admin/insights',
        addHref:     '/admin/insights/new',
    },
    {
        key:         'casestudies',
        label:       'Case Studies',
        description: 'Client project case study documents',
        icon:        'bi-folder-fill',
        color:       '#F7941D',
        bg:          'rgba(247,148,29,0.10)',
        href:        '/admin/case-studies',
        addHref:     '/admin/case-studies/new',
    },
    {
        key:         'solutions',
        label:       'Solutions',
        description: 'Services & solutions offered',
        icon:        'bi-gear-fill',
        color:       '#00c48c',
        bg:          'rgba(0,196,140,0.10)',
        href:        '/admin/solutions',
        addHref:     '/admin/solutions/new',
    },
    {
        key:         'testimonials',
        label:       'Testimonials',
        description: 'Client reviews & testimonials',
        icon:        'bi-chat-quote-fill',
        color:       '#f7c137',
        bg:          'rgba(247,193,55,0.10)',
        href:        '/admin/testimonials',
        addHref:     '/admin/testimonials/new',
    },
    {
        key:         'messages',
        label:       'Messages',
        description: 'Contact form submissions',
        icon:        'bi-envelope-fill',
        color:       '#a78bfa',
        bg:          'rgba(167,139,250,0.10)',
        href:        '/admin/messages',
    },
    {
        key:         'newsletter',
        label:       'Newsletter',
        description: 'Email subscribers',
        icon:        'bi-newspaper',
        color:       '#34d399',
        bg:          'rgba(52,211,153,0.10)',
        href:        '/admin/newsletter',
    },
    {
        key:         'teams',
        label:       'Team',
        description: 'Team member profiles & photos',
        icon:        'bi-people-fill',
        color:       '#e879f9',
        bg:          'rgba(232,121,249,0.10)',
        href:        '/admin/team',
        addHref:     '/admin/team/new',
    },
    {
        key:         'comments',
        label:       'Comments',
        description: 'Blog comment moderation queue',
        icon:        'bi-chat-dots-fill',
        color:       '#a78bfa',
        bg:          'rgba(167,139,250,0.10)',
        href:        '/admin/comments',
    },
];

export default async function AdminDashboard() {
    noStore();
    await connectDB();

    const [counts, unreadCount, pendingComments] = await Promise.all([
        Promise.all(
            COLLECTIONS.map((col) =>
                col.key === 'comments'
                    ? mongoose.connection.collection('comments').countDocuments({ approved: false })
                    : mongoose.connection.collection(col.key).countDocuments()
            )
        ),
        mongoose.connection.collection('messages').countDocuments({ read: { $ne: true } }),
        mongoose.connection.collection('comments').countDocuments({ approved: false }),
    ]);

    const collections = COLLECTIONS.map((col, i) => ({
        ...col,
        count:       counts[i],
        unreadCount: col.key === 'messages' ? unreadCount : col.key === 'comments' ? pendingComments : 0,
        badgeLabel:  col.key === 'comments' ? 'pending' : 'unread',
    }));
    const total = counts.reduce((a, b) => a + b, 0);

    /* ── Styles (scoped to this page) ── */
    const card = {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    };

    return (
        <div style={{ fontFamily: 'var(--body-color-font, system-ui, sans-serif)', maxWidth: '1100px' }}>

            {/* Page header */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: '#111827' }}>
                    Dashboard Overview
                </h2>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    Welcome back! Here&apos;s a summary of your content — {total} documents across {COLLECTIONS.length} collections.
                </p>
            </div>

            {/* Summary strip */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '12px',
                marginBottom: '28px',
            }}>
                {collections.map((col) => (
                    <Link key={col.key} href={col.href} style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: '#fff', border: '1px solid #e5e7eb',
                            borderRadius: '10px', padding: '14px 20px',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            minWidth: '130px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            transition: 'box-shadow 0.2s',
                        }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '8px',
                                background: col.bg, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <i className={`bi ${col.icon}`} style={{ color: col.color, fontSize: '16px' }}></i>
                            </div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{col.count}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{col.label}</div>
                            </div>
                            {col.unreadCount > 0 && (
                                <span style={{
                                    background: '#F7941D', color: '#fff',
                                    fontSize: '10px', fontWeight: 700,
                                    padding: '2px 7px', borderRadius: '20px',
                                }}>
                                    {col.unreadCount}
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Collection cards */}
            <div className="row g-3">
                {collections.map((col) => (
                    <div key={col.key} className="col-lg-6 col-md-6">
                        <div style={card}>
                            {/* Icon + count */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: col.bg, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className={`bi ${col.icon}`} style={{ color: col.color, fontSize: '22px' }}></i>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{col.count}</div>
                                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>documents</div>
                                </div>
                            </div>

                            {/* Label */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{col.label}</h3>
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{col.description}</p>
                                {col.unreadCount > 0 && (
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                        marginTop: '8px', background: 'rgba(247,148,29,0.12)',
                                        color: '#d97706', fontSize: '12px', fontWeight: 700,
                                        padding: '3px 10px', borderRadius: '20px',
                                    }}>
                                        <i className="bi bi-exclamation-circle-fill"></i>
                                        {col.unreadCount} {col.badgeLabel}
                                    </span>
                                )}
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', background: '#f3f4f6', margin: '16px 0' }} />

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link href={col.href} style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    padding: '9px', background: col.bg,
                                    border: `1px solid ${col.color}30`,
                                    borderRadius: '8px', color: col.color,
                                    fontSize: '13px', fontWeight: 700,
                                    textDecoration: 'none', transition: '0.2s',
                                }}>
                                    <i className="bi bi-list-ul"></i> Manage
                                </Link>
                                {col.addHref && (
                                    <Link href={col.addHref} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        padding: '9px 14px',
                                        background: '#1B3A8C', borderRadius: '8px',
                                        color: '#fff', fontSize: '13px', fontWeight: 700,
                                        textDecoration: 'none', border: 'none',
                                        transition: '0.2s', whiteSpace: 'nowrap',
                                    }}>
                                        <i className="bi bi-plus-lg"></i> Add
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Settings quick action */}
            <div style={{ marginTop: '32px' }}>
                <Link href="/admin/settings" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    background: '#fff', border: '1px solid #e5e7eb',
                    borderRadius: '10px', padding: '14px 20px',
                    textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: '0.2s',
                }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(27,58,140,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-sliders" style={{ color: '#1B3A8C', fontSize: '16px' }}></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Site Settings</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Manage images, text &amp; contact info</div>
                    </div>
                    <i className="bi bi-arrow-right" style={{ color: '#9ca3af', marginLeft: '8px' }}></i>
                </Link>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <p style={{ color: '#d1d5db', fontSize: '12px' }}>
                    Drew Marketing Solutions Admin &mdash; For internal use only
                </p>
            </div>
        </div>
    );
}
