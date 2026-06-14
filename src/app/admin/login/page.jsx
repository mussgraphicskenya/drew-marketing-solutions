import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Admin Login | Drew Marketing Solutions',
};

async function handleLogin(formData) {
    'use server';

    const email    = formData.get('email');
    const password = formData.get('password');

    const ADMIN_EMAIL    = 'admin@drewmarketingsolutions.com';
    const ADMIN_PASSWORD = 'Drew2025Admin';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const cookieStore = cookies();
        cookieStore.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure:   process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge:   60 * 60 * 8, // 8 hours
            path:     '/',
        });
        redirect('/admin');
    }

    // Re-render login with error param
    redirect('/admin/login?error=1');
}

export default function LoginPage({ searchParams }) {
    const hasError = searchParams?.error === '1';

    return (
        <div
            style={{
                minHeight:       '100vh',
                background:      'linear-gradient(135deg, #050a1e 0%, #161a2b 60%, #1a1f35 100%)',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                fontFamily:      'var(--body-color-font, system-ui, sans-serif)',
            }}
        >
            <div style={{ width: '100%', maxWidth: '420px', padding: '0 16px' }}>

                {/* Logo / Brand */}
                <div className="text-center mb-4">
                    <div
                        style={{
                            display:        'inline-flex',
                            alignItems:     'center',
                            gap:            '10px',
                            marginBottom:   '8px',
                        }}
                    >
                        <div
                            style={{
                                width:           '42px',
                                height:          '42px',
                                borderRadius:    '10px',
                                background:      '#ff3c00',
                                display:         'flex',
                                alignItems:      'center',
                                justifyContent:  'center',
                            }}
                        >
                            <i className="bi bi-shield-lock-fill" style={{ color: '#fff', fontSize: '20px' }}></i>
                        </div>
                        <span style={{ color: '#fff', fontSize: '20px', fontWeight: 700, letterSpacing: '0.3px' }}>
                            Drew Admin
                        </span>
                    </div>
                    <p style={{ color: '#9aa0b4', fontSize: '14px', margin: 0 }}>
                        Sign in to access the dashboard
                    </p>
                </div>

                {/* Card */}
                <div
                    style={{
                        background:   'rgba(255,255,255,0.05)',
                        border:       '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        padding:      '36px 32px',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    {hasError && (
                        <div
                            className="d-flex align-items-center gap-2 mb-4 p-3"
                            style={{
                                background:   'rgba(255,60,0,0.15)',
                                border:       '1px solid rgba(255,60,0,0.3)',
                                borderRadius: '8px',
                                color:        '#ff7c5c',
                                fontSize:     '14px',
                            }}
                        >
                            <i className="bi bi-exclamation-circle-fill"></i>
                            Invalid email or password. Please try again.
                        </div>
                    )}

                    <form action={handleLogin}>
                        {/* Email */}
                        <div className="mb-3">
                            <label
                                htmlFor="admin-email"
                                style={{ color: '#c8cdd8', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}
                            >
                                EMAIL ADDRESS
                            </label>
                            <div style={{ position: 'relative' }}>
                                <i
                                    className="bi bi-envelope"
                                    style={{
                                        position:  'absolute',
                                        left:      '14px',
                                        top:       '50%',
                                        transform: 'translateY(-50%)',
                                        color:     '#9aa0b4',
                                        fontSize:  '15px',
                                    }}
                                ></i>
                                <input
                                    id="admin-email"
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="admin@drewmarketingsolutions.com"
                                    style={{
                                        width:        '100%',
                                        padding:      '11px 14px 11px 40px',
                                        background:   'rgba(255,255,255,0.07)',
                                        border:       '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '8px',
                                        color:        '#fff',
                                        fontSize:     '14px',
                                        outline:      'none',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label
                                htmlFor="admin-password"
                                style={{ color: '#c8cdd8', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}
                            >
                                PASSWORD
                            </label>
                            <div style={{ position: 'relative' }}>
                                <i
                                    className="bi bi-lock"
                                    style={{
                                        position:  'absolute',
                                        left:      '14px',
                                        top:       '50%',
                                        transform: 'translateY(-50%)',
                                        color:     '#9aa0b4',
                                        fontSize:  '15px',
                                    }}
                                ></i>
                                <input
                                    id="admin-password"
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="••••••••••••"
                                    style={{
                                        width:        '100%',
                                        padding:      '11px 14px 11px 40px',
                                        background:   'rgba(255,255,255,0.07)',
                                        border:       '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '8px',
                                        color:        '#fff',
                                        fontSize:     '14px',
                                        outline:      'none',
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                width:        '100%',
                                padding:      '13px',
                                background:   '#ff3c00',
                                border:       'none',
                                borderRadius: '8px',
                                color:        '#fff',
                                fontSize:     '15px',
                                fontWeight:   700,
                                cursor:       'pointer',
                                letterSpacing:'0.5px',
                                transition:   '0.3s',
                            }}
                        >
                            Sign In <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                    </form>
                </div>

                <p className="text-center mt-3" style={{ color: '#5a6070', fontSize: '12px' }}>
                    Drew Marketing Solutions &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
