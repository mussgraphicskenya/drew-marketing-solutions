'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/app/Components/Admin/ImageUpload';

export const dynamic = 'force-dynamic';

const DEFAULTS = {
    homepageAboutImage:    '',
    aboutPageImage:        '',
    homepageAboutSubTitle: 'ABOUT DREW',
    homepageAboutTitle:    'Strategy-led growth for brands ready to align.',
    aboutPageSubTitle:     'DREW MARKETING SOLUTIONS',
    aboutPageTitle:        "We didn't start Drew to do marketing. We started it to fix it.",
    phone:                 '+254 700 000 000',
    email:                 'hello@drewmarketingsolutions.com',
    address:               'Westlands, Nairobi - Kenya',
    hours:                 '8.00 am - 6.00 pm',
    socialFacebook:        '',
    socialTwitter:         '',
    socialLinkedin:        '',
    socialInstagram:       '',
};

/* ── Shared input style ─────────────────────────── */
const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
};

const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
};

const sectionCard = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const sectionTitle = {
    fontSize: '15px',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 18px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f3f4f6',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};

export default function SettingsPage() {
    const [form, setForm]       = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving]   = useState(false);
    const [status, setStatus]   = useState(null); // 'success' | 'error' | null
    const [errMsg, setErrMsg]   = useState('');

    /* ── Load current settings on mount ── */
    useEffect(() => {
        fetch('/api/settings')
            .then((r) => r.json())
            .then((data) => {
                if (data && !data.error) {
                    setForm((prev) => ({ ...prev, ...data }));
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setStatus(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setStatus(null);
        setErrMsg('');
        try {
            const res  = await fetch('/api/settings', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Save failed');
            setStatus('success');
        } catch (err) {
            setErrMsg(err.message);
            setStatus('error');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
                <i className="bi bi-hourglass-split me-2"></i>Loading settings…
            </div>
        );
    }

    return (
        <div style={{ fontFamily: 'var(--body-color-font, system-ui, sans-serif)', maxWidth: '800px' }}>

            {/* Page header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ color: '#111827', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
                    Site Settings
                </h2>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                    Manage images and content used across the website.
                </p>
            </div>

            {/* Status banners */}
            {status === 'success' && (
                <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="bi bi-check-circle-fill"></i>
                    Settings saved successfully! Changes will appear on the website on next page load.
                </div>
            )}
            {status === 'error' && (
                <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="bi bi-exclamation-circle-fill"></i>
                    {errMsg}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* ── ABOUT SECTION IMAGES ── */}
                <div style={sectionCard}>
                    <h3 style={sectionTitle}>
                        <i className="bi bi-image" style={{ color: '#1B3A8C' }}></i>
                        About Section Images
                    </h3>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Homepage About Image</label>
                        <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 10px' }}>
                            Displayed in the About section on the homepage. Recommended: 633×623px.
                        </p>
                        <ImageUpload
                            value={form.homepageAboutImage}
                            onChange={(url) => handleChange('homepageAboutImage', url)}
                            type="about"
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>About Page Hero Image</label>
                        <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 10px' }}>
                            Displayed in the About Us page section. Recommended: 635×520px.
                        </p>
                        <ImageUpload
                            value={form.aboutPageImage}
                            onChange={(url) => handleChange('aboutPageImage', url)}
                            type="about"
                        />
                    </div>
                </div>

                {/* ── ABOUT SECTION TEXT ── */}
                <div style={sectionCard}>
                    <h3 style={sectionTitle}>
                        <i className="bi bi-type" style={{ color: '#1B3A8C' }}></i>
                        About Section Text
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 18px' }}>
                        Leave blank to use the default text shown in the placeholders.
                    </p>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label style={labelStyle}>Homepage About SubTitle</label>
                            <input
                                type="text"
                                style={inputStyle}
                                value={form.homepageAboutSubTitle}
                                onChange={(e) => handleChange('homepageAboutSubTitle', e.target.value)}
                                placeholder="ABOUT DREW"
                            />
                        </div>
                        <div className="col-md-6">
                            <label style={labelStyle}>About Page SubTitle</label>
                            <input
                                type="text"
                                style={inputStyle}
                                value={form.aboutPageSubTitle}
                                onChange={(e) => handleChange('aboutPageSubTitle', e.target.value)}
                                placeholder="DREW MARKETING SOLUTIONS"
                            />
                        </div>
                        <div className="col-12">
                            <label style={labelStyle}>Homepage About Title</label>
                            <input
                                type="text"
                                style={inputStyle}
                                value={form.homepageAboutTitle}
                                onChange={(e) => handleChange('homepageAboutTitle', e.target.value)}
                                placeholder="Strategy-led growth for brands ready to align."
                            />
                        </div>
                        <div className="col-12">
                            <label style={labelStyle}>About Page Title</label>
                            <input
                                type="text"
                                style={inputStyle}
                                value={form.aboutPageTitle}
                                onChange={(e) => handleChange('aboutPageTitle', e.target.value)}
                                placeholder="We didn't start Drew to do marketing. We started it to fix it."
                            />
                        </div>
                    </div>
                </div>

                {/* ── CONTACT DETAILS ── */}
                <div style={sectionCard}>
                    <h3 style={sectionTitle}>
                        <i className="bi bi-telephone-fill" style={{ color: '#1B3A8C' }}></i>
                        Contact Details
                    </h3>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label style={labelStyle}>Phone</label>
                            <input
                                type="text"
                                style={inputStyle}
                                value={form.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="+254 700 000 000"
                            />
                        </div>
                        <div className="col-md-6">
                            <label style={labelStyle}>Email</label>
                            <input
                                type="email"
                                style={inputStyle}
                                value={form.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="hello@drewmarketingsolutions.com"
                            />
                        </div>
                        <div className="col-md-6">
                            <label style={labelStyle}>Address</label>
                            <input
                                type="text"
                                style={inputStyle}
                                value={form.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                placeholder="Westlands, Nairobi - Kenya"
                            />
                        </div>
                        <div className="col-md-6">
                            <label style={labelStyle}>Business Hours</label>
                            <input
                                type="text"
                                style={inputStyle}
                                value={form.hours}
                                onChange={(e) => handleChange('hours', e.target.value)}
                                placeholder="8.00 am - 6.00 pm"
                            />
                        </div>
                    </div>
                </div>

                {/* ── SOCIAL MEDIA LINKS ── */}
                <div style={sectionCard}>
                    <h3 style={sectionTitle}>
                        <i className="bi bi-share-fill" style={{ color: '#1B3A8C' }}></i>
                        Social Media Links
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 18px' }}>
                        These links appear in the site header and footer. Leave blank to hide an icon.
                    </p>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label style={labelStyle}>
                                <i className="bi bi-facebook me-2" style={{ color: '#1877f2' }}></i>Facebook URL
                            </label>
                            <input
                                type="url"
                                style={inputStyle}
                                value={form.socialFacebook}
                                onChange={(e) => handleChange('socialFacebook', e.target.value)}
                                placeholder="https://facebook.com/drewmarketingke"
                            />
                        </div>
                        <div className="col-md-6">
                            <label style={labelStyle}>
                                <i className="bi bi-twitter-x me-2" style={{ color: '#14171a' }}></i>X / Twitter URL
                            </label>
                            <input
                                type="url"
                                style={inputStyle}
                                value={form.socialTwitter}
                                onChange={(e) => handleChange('socialTwitter', e.target.value)}
                                placeholder="https://twitter.com/drewmarketingke"
                            />
                        </div>
                        <div className="col-md-6">
                            <label style={labelStyle}>
                                <i className="bi bi-linkedin me-2" style={{ color: '#0077b5' }}></i>LinkedIn URL
                            </label>
                            <input
                                type="url"
                                style={inputStyle}
                                value={form.socialLinkedin}
                                onChange={(e) => handleChange('socialLinkedin', e.target.value)}
                                placeholder="https://linkedin.com/company/drew-marketing"
                            />
                        </div>
                        <div className="col-md-6">
                            <label style={labelStyle}>
                                <i className="bi bi-instagram me-2" style={{ color: '#e1306c' }}></i>Instagram URL
                            </label>
                            <input
                                type="url"
                                style={inputStyle}
                                value={form.socialInstagram}
                                onChange={(e) => handleChange('socialInstagram', e.target.value)}
                                placeholder="https://instagram.com/drewmarketingke"
                            />
                        </div>
                    </div>

                    {/* Live preview */}
                    {(form.socialFacebook || form.socialTwitter || form.socialLinkedin || form.socialInstagram) && (
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                            <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '10px', fontWeight: 600 }}>PREVIEW</p>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {form.socialFacebook && (
                                    <a href={form.socialFacebook} target="_blank" rel="noopener noreferrer"
                                        style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e7f0fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1877f2', fontSize: '18px', textDecoration: 'none' }}>
                                        <i className="bi bi-facebook"></i>
                                    </a>
                                )}
                                {form.socialTwitter && (
                                    <a href={form.socialTwitter} target="_blank" rel="noopener noreferrer"
                                        style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14171a', fontSize: '18px', textDecoration: 'none' }}>
                                        <i className="bi bi-twitter-x"></i>
                                    </a>
                                )}
                                {form.socialLinkedin && (
                                    <a href={form.socialLinkedin} target="_blank" rel="noopener noreferrer"
                                        style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e8f3fb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0077b5', fontSize: '18px', textDecoration: 'none' }}>
                                        <i className="bi bi-linkedin"></i>
                                    </a>
                                )}
                                {form.socialInstagram && (
                                    <a href={form.socialInstagram} target="_blank" rel="noopener noreferrer"
                                        style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fce8f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e1306c', fontSize: '18px', textDecoration: 'none' }}>
                                        <i className="bi bi-instagram"></i>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Save button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            background:    saving ? '#6b7280' : '#1B3A8C',
                            color:         '#fff',
                            border:        'none',
                            borderRadius:  '8px',
                            padding:       '12px 32px',
                            fontSize:      '14px',
                            fontWeight:    700,
                            cursor:        saving ? 'not-allowed' : 'pointer',
                            display:       'inline-flex',
                            alignItems:    'center',
                            gap:           '8px',
                            transition:    '0.2s',
                        }}
                    >
                        <i className={saving ? 'bi bi-hourglass-split' : 'bi bi-floppy-fill'}></i>
                        {saving ? 'Saving…' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
