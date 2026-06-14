import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export const metadata = {
    title: 'Admin Dashboard | Drew Marketing Solutions',
};

async function handleLogout() {
    'use server';
    const cookieStore = cookies();
    cookieStore.set('admin_session', '', { maxAge: 0, path: '/' });
    redirect('/admin/login');
}

const COLLECTIONS = [
    {
        key:         'insights',
        label:       'Insights',
        description: 'Blog posts & thought leadership articles',
        icon:        'bi-pencil-square',
        color:       '#4f6ef7',
        bg:          'rgba(79,110,247,0.12)',
        href:        '/admin/insights',
    },
    {
        key:         'casestudies',
        label:       'Case Studies',
        description: 'Client project case study documents',
        icon:        'bi-briefcase-fill',
        color:       '#ff3c00',
        bg:          'rgba(255,60,0,0.12)',
        href:        '/admin/case-studies',
    },
    {
        key:         'solutions',
        label:       'Solutions',
        description: 'Services & solutions offered',
        icon:        'bi-gear-fill',
        color:       '#00c48c',
        bg:          'rgba(0,196,140,0.12)',
        href:        '/admin/solutions',
    },
    {
        key:         'testimonials',
        label:       'Testimonials',
        description: 'Client reviews & testimonials',
        icon:        'bi-chat-quote-fill',
        color:       '#f7c137',
        bg:          'rgba(247,193,55,0.12)',
        href:        '/admin/testimonials',
    },
    {
        key:         'messages',
        label:       'Messages',
        description: 'Contact form submissions',
        icon:        'bi-envelope-fill',
        color:       '#a78bfa',
        bg:          'rgba(167,139,250,0.12)',
        href:        '/admin/messages',
    },
    {
        key:         'newsletter',
        label:       'Newsletter',
        description: 'Email subscribers',
        icon:        'bi-mailbox2-flag',
        color:       '#34d399',
        bg:          'rgba(52,211,153,0.12)',
        href:        '/admin/newsletter',
    },
    {
        key:         'teams',
        label:       'Team',
        description: 'Team member profiles & photos',
        icon:        'bi-people-fill',
        color:       '#e879f9',
        bg:          'rgba(232,121,249,0.12)',
        href:        '/admin/team',
    },
    {
        key:         'comments',
        label:       'Comments',
        description: 'Blog comment moderation queue',
        icon:        'bi-chat-dots-fill',
        color:       '#a78bfa',
        bg:          'rgba(167,139,250,0.12)',
        href:        '/admin/comments',
    },
];

export default async function AdminDashboard() {
    await connectDB();

    // Fetch all collection counts in parallel
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

    return (
        <div
            style={{
                minHeight:   '100vh',
                background:  'linear-gradient(160deg, #050a1e 0%, #0d1228 50%, #161a2b 100%)',
                fontFamily:  'var(--body-color-font, system-ui, sans-serif)',
            }}
        >
            {/* ── Top Nav ──────────────────────────────────────── */}
            <nav
                style={{
                    background:     'rgba(255,255,255,0.03)',
                    borderBottom:   '1px solid rgba(255,255,255,0.07)',
                    padding:        '0 16px',
                    height:         '64px',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                    position:       'sticky',
                    top:             0,
                    zIndex:          100,
                    backdropFilter: 'blur(12px)',
                    gap:            '12px',
                }}
            >
                <div className="d-flex align-items-center gap-3">
                    <div
                        style={{
                            width:          '36px',
                            height:         '36px',
                            borderRadius:   '8px',
                            background:     '#ff3c00',
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            flexShrink:     0,
                        }}
                    >
                        <i className="bi bi-shield-lock-fill" style={{ color: '#fff', fontSize: '17px' }}></i>
                    </div>
                    <div>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>Drew Admin</span>
                        <span
                            style={{
                                marginLeft:   '10px',
                                background:   'rgba(255,60,0,0.18)',
                                color:        '#ff7c5c',
                                fontSize:     '11px',
                                fontWeight:   600,
                                padding:      '2px 8px',
                                borderRadius: '20px',
                                letterSpacing:'0.4px',
                            }}
                        >
                            DASHBOARD
                        </span>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <Link
                        href="/"
                        target="_blank"
                        style={{
                            color:      '#9aa0b4',
                            fontSize:   '13px',
                            textDecoration: 'none',
                            display:    'flex',
                            alignItems: 'center',
                            gap:        '5px',
                        }}
                    >
                        <i className="bi bi-box-arrow-up-right"></i> View Site
                    </Link>
                    <form action={handleLogout}>
                        <button
                            type="submit"
                            style={{
                                background:   'rgba(255,60,0,0.15)',
                                border:       '1px solid rgba(255,60,0,0.25)',
                                borderRadius: '7px',
                                color:        '#ff7c5c',
                                fontSize:     '13px',
                                fontWeight:   600,
                                padding:      '6px 16px',
                                cursor:       'pointer',
                                display:      'flex',
                                alignItems:   'center',
                                gap:          '6px',
                            }}
                        >
                            <i className="bi bi-box-arrow-right"></i> Sign Out
                        </button>
                    </form>
                </div>
            </nav>

            {/* ── Page Body ────────────────────────────────────── */}
            <main style={{ padding: '24px 16px', maxWidth: '1100px', margin: '0 auto' }}>

                {/* Header */}
                <div className="mb-5">
                    <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, margin: '0 0 6px' }}>
                        Content Dashboard
                    </h1>
                    <p style={{ color: '#9aa0b4', margin: 0, fontSize: '15px' }}>
                        Manage your site content. {total} total documents across {COLLECTIONS.length} collections.
                    </p>
                </div>

                {/* Summary strip */}
                <div
                    style={{
                        background:   'rgba(255,255,255,0.04)',
                        border:       '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding:      '20px',
                        marginBottom: '32px',
                    }}
                >
                    {/* Total count row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <i className="bi bi-database-fill-check" style={{ color: '#ff3c00', fontSize: '26px', flexShrink: 0 }}></i>
                        <div>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: '20px' }}>{total} Documents</div>
                            <div style={{ color: '#9aa0b4', fontSize: '13px' }}>Total records in MongoDB</div>
                        </div>
                    </div>
                    {/* Per-collection mini stats — wraps on mobile */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '16px' }}>
                        {collections.map((col) => (
                            <div key={col.key} style={{ textAlign: 'center', minWidth: '52px' }}>
                                <div style={{ color: col.color, fontWeight: 700, fontSize: '18px' }}>{col.count}</div>
                                <div style={{ color: '#9aa0b4', fontSize: '11px' }}>{col.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Collection Cards */}
                <div className="row g-4">
                    {collections.map((col) => (
                        <div key={col.key} className="col-lg-6 col-md-6">
                            <div
                                style={{
                                    background:    'rgba(255,255,255,0.04)',
                                    border:        '1px solid rgba(255,255,255,0.08)',
                                    borderRadius:  '16px',
                                    padding:       '28px',
                                    transition:    '0.3s',
                                    height:        '100%',
                                    display:       'flex',
                                    flexDirection: 'column',
                                }}
                                onMouseOver={undefined}
                            >
                                {/* Icon + Count row */}
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div
                                        style={{
                                            width:          '54px',
                                            height:         '54px',
                                            borderRadius:   '14px',
                                            background:     col.bg,
                                            display:        'flex',
                                            alignItems:     'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <i className={`bi ${col.icon}`} style={{ color: col.color, fontSize: '24px' }}></i>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#fff', fontSize: '36px', fontWeight: 800, lineHeight: 1 }}>
                                            {col.count}
                                        </div>
                                        <div style={{ color: '#9aa0b4', fontSize: '12px', marginTop: '2px' }}>
                                            documents
                                        </div>
                                    </div>
                                </div>

                                {/* Label + Description */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '0 0 6px' }}>
                                        {col.label}
                                    </h3>
                                    <p style={{ color: '#9aa0b4', fontSize: '13px', margin: 0 }}>
                                        {col.description}
                                    </p>
                                    {col.unreadCount > 0 && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '8px', background: 'rgba(255,60,0,0.15)', color: '#ff7c5c', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                                            <i className="bi bi-envelope-exclamation-fill"></i>
                                            {col.unreadCount} {col.badgeLabel || 'unread'}
                                        </span>
                                    )}
                                </div>

                                {/* Divider */}
                                <div
                                    style={{
                                        height:     '1px',
                                        background: 'rgba(255,255,255,0.07)',
                                        margin:     '20px 0',
                                    }}
                                />

                                {/* Manage Button */}
                                <Link
                                    href={col.href}
                                    style={{
                                        display:        'flex',
                                        alignItems:     'center',
                                        justifyContent: 'center',
                                        gap:            '8px',
                                        padding:        '11px',
                                        background:     col.bg,
                                        border:         `1px solid ${col.color}30`,
                                        borderRadius:   '9px',
                                        color:          col.color,
                                        fontSize:       '14px',
                                        fontWeight:     700,
                                        textDecoration: 'none',
                                        transition:     '0.3s',
                                        letterSpacing:  '0.3px',
                                    }}
                                >
                                    <i className="bi bi-pencil-fill"></i>
                                    Manage {col.label}
                                    <i className="bi bi-arrow-right ms-auto"></i>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <div className="text-center mt-5">
                    <p style={{ color: '#3a4055', fontSize: '12px' }}>
                        Drew Marketing Solutions Admin &mdash; For internal use only
                    </p>
                </div>
            </main>
        </div>
    );
}
