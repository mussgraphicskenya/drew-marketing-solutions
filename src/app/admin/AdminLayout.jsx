'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

/* ── Design tokens ───────────────────────────────────── */
const NAVY      = '#1B3A8C';
const NAVY_DARK = '#0D2355';
const ORANGE    = '#F7941D';
const SIDEBAR_W = 260;

/* ── Navigation items ────────────────────────────────── */
const NAV = [
    { label: 'Dashboard',    href: '/admin',              icon: 'bi-grid-1x2-fill',     exact: true },
    { label: 'Insights',     href: '/admin/insights',     icon: 'bi-lightbulb-fill' },
    { label: 'Case Studies', href: '/admin/case-studies', icon: 'bi-folder-fill' },
    { label: 'Solutions',    href: '/admin/solutions',    icon: 'bi-gear-fill' },
    { label: 'Team',         href: '/admin/team',         icon: 'bi-people-fill' },
    { label: 'Testimonials', href: '/admin/testimonials', icon: 'bi-chat-quote-fill' },
    { label: 'Messages',     href: '/admin/messages',     icon: 'bi-envelope-fill',    badge: 'unread' },
    { label: 'Newsletter',   href: '/admin/newsletter',   icon: 'bi-newspaper' },
    { label: 'Comments',     href: '/admin/comments',     icon: 'bi-chat-dots-fill',   badge: 'pending' },
    { label: 'Settings',     href: '/admin/settings',     icon: 'bi-sliders' },
];

/* ── Logout helper (client-side fetch → redirect) ─────── */
function LogoutButton() {
    const router = useRouter();
    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
        router.push('/admin/login');
    };
    return (
        <button
            onClick={handleLogout}
            style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '10px 20px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.65)', fontSize: '14px', fontWeight: 500,
                textAlign: 'left', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
        >
            <i className="bi bi-box-arrow-right" style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}></i>
            Log Out
        </button>
    );
}

/* ── Sidebar ─────────────────────────────────────────── */
function Sidebar({ open, onClose, badges }) {
    const pathname = usePathname();

    const isActive = (item) =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href);

    const sidebarStyle = {
        position: 'fixed', top: 0, left: 0,
        width: `${SIDEBAR_W}px`, height: '100vh',
        background: NAVY,
        display: 'flex', flexDirection: 'column',
        zIndex: 1000,
        transform: open ? 'translateX(0)' : `translateX(-${SIDEBAR_W}px)`,
        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto',
        boxShadow: '4px 0 20px rgba(0,0,0,0.25)',
    };

    return (
        <aside style={sidebarStyle}>
            {/* Brand */}
            <div style={{
                padding: '20px', background: 'rgba(0,0,0,0.2)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: ORANGE, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                        <i className="bi bi-shield-lock-fill" style={{ color: '#fff', fontSize: '18px' }}></i>
                    </div>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: '16px', lineHeight: 1.1 }}>DREW</div>
                        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', letterSpacing: '0.5px' }}>Admin Portal</div>
                    </div>
                    {/* Mobile close */}
                    <button
                        onClick={onClose}
                        style={{
                            marginLeft: 'auto', background: 'none', border: 'none',
                            color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '20px',
                            padding: '4px', display: 'none',
                        }}
                        className="sidebar-close-btn"
                        aria-label="Close sidebar"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>

            {/* Nav section label */}
            <div style={{ padding: '20px 20px 8px', flexShrink: 0 }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    CONTENT
                </span>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, overflowY: 'auto' }}>
                {NAV.map((item) => {
                    const active = isActive(item);
                    const badgeCount = badges?.[item.badge] || 0;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 20px', textDecoration: 'none',
                                color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                                borderLeft: active ? `3px solid ${ORANGE}` : '3px solid transparent',
                                fontSize: '14px', fontWeight: active ? 600 : 500,
                                transition: 'all 0.18s',
                            }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; } }}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; } }}
                        >
                            <i className={`bi ${item.icon}`} style={{ fontSize: '16px', width: '20px', textAlign: 'center', flexShrink: 0 }}></i>
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {badgeCount > 0 && (
                                <span style={{
                                    background: ORANGE, color: '#fff',
                                    fontSize: '10px', fontWeight: 700,
                                    padding: '2px 7px', borderRadius: '20px', minWidth: '20px', textAlign: 'center',
                                }}>
                                    {badgeCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom links */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, paddingBottom: '8px' }}>
                <Link
                    href="/"
                    target="_blank"
                    style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 20px', textDecoration: 'none',
                        color: 'rgba(255,255,255,0.65)', fontSize: '14px', fontWeight: 500,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
                >
                    <i className="bi bi-globe" style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}></i>
                    View Website
                </Link>
                <LogoutButton />
            </div>
        </aside>
    );
}

/* ── Top Bar ─────────────────────────────────────────── */
function TopBar({ onMenuClick }) {
    const pathname = usePathname();

    // Derive page title from path
    const segment = pathname.split('/').filter(Boolean)[1];
    const titleMap = {
        undefined:      'Dashboard',
        insights:       'Insights',
        'case-studies': 'Case Studies',
        solutions:      'Solutions',
        team:           'Team',
        testimonials:   'Testimonials',
        messages:       'Messages',
        newsletter:     'Newsletter',
        comments:       'Comments',
    };
    const pageTitle = titleMap[segment] ?? 'Admin';

    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
            height: '60px',
            display: 'flex', alignItems: 'center',
            padding: '0 24px', gap: '16px',
        }}>
            {/* Hamburger */}
            <button
                onClick={onMenuClick}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#1B3A8C', fontSize: '22px', padding: '4px',
                    display: 'flex', alignItems: 'center',
                    flexShrink: 0,
                }}
                aria-label="Toggle sidebar"
            >
                <i className="bi bi-list"></i>
            </button>

            {/* Page title */}
            <h1 style={{
                margin: 0, fontSize: '17px', fontWeight: 700,
                color: '#111827', flex: 1,
            }}>
                {pageTitle}
            </h1>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: NAVY, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <i className="bi bi-person-fill" style={{ color: '#fff', fontSize: '16px' }}></i>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Admin</span>
            </div>
        </header>
    );
}

/* ── Root AdminLayout ─────────────────────────────────── */
export default function AdminLayout({ children, badges }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)');
        const update = (e) => setIsDesktop(e.matches);
        setIsDesktop(mq.matches);
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    // On desktop: sidebar always open; on mobile: toggle
    const sidebarVisible = isDesktop || sidebarOpen;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f9' }}>
            {/* Sidebar */}
            <Sidebar
                open={sidebarVisible}
                onClose={() => setSidebarOpen(false)}
                badges={badges}
            />

            {/* Mobile overlay */}
            {sidebarOpen && !isDesktop && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.45)',
                        zIndex: 999,
                    }}
                />
            )}

            {/* Main area */}
            <div style={{
                flex: 1,
                marginLeft: isDesktop ? `${SIDEBAR_W}px` : 0,
                transition: 'margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', flexDirection: 'column',
                minWidth: 0,
            }}>
                <TopBar onMenuClick={() => setSidebarOpen(prev => !prev)} />
                <main style={{ flex: 1, padding: '24px', overflowX: 'hidden' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
