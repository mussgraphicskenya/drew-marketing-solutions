'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/app/Components/Admin/ImageUpload';

export default function EditSolutionPage({ params }) {
    const { id } = params;
    const router = useRouter();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`/api/admin/solutions/${id}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) throw new Error(data.error);
                setForm({
                    title:          data.title          ?? '',
                    slug:           data.slug           ?? '',
                    headline:       data.headline       ?? '',
                    body:           data.body           ?? '',
                    includes:       Array.isArray(data.includes) ? data.includes.join(', ') : '',
                    whyDrewTitle:   data.whyDrewTitle   ?? '',
                    whyDrewContent: data.whyDrewContent ?? '',
                    secondBoxIcon:  data.secondBoxIcon  ?? '',
                    icon:           data.icon           ?? '',
                    image:          data.image          ?? '',
                    order:          data.order          ?? 1,
                    featured:       data.featured       ?? false,
                });
            })
            .catch((err) => setError(err.message))
            .finally(() => setFetching(false));
    }, [id]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name === 'order' ? Number(value) : value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                ...form,
                includes: form.includes.split(',').map((s) => s.trim()).filter(Boolean),
                order:    Number(form.order),
                featured: Boolean(form.featured),
            };
            const res = await fetch(`/api/admin/solutions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update solution');
            }
            router.push('/admin/solutions');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    if (fetching) return <LoadingScreen />;

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e4f0', fontFamily: 'system-ui, sans-serif' }}>
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/admin/solutions" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-arrow-left"></i> Solutions
                </Link>
                <span style={{ color: '#3a4055' }}>|</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>
                    <i className="bi bi-pencil me-2" style={{ color: '#00c48c' }}></i>Edit Solution
                </span>
            </nav>

            <main style={{ padding: '32px', maxWidth: '780px', margin: '0 auto' }}>
                <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Edit Solution</h1>

                {error && (
                    <div style={{ background: 'rgba(255,60,0,0.12)', border: '1px solid rgba(255,60,0,0.3)', color: '#ff7c5c', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px' }}>
                        <i className="bi bi-exclamation-circle me-2"></i>{error}
                    </div>
                )}

                {form && (
                    <form onSubmit={handleSubmit}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            <div className="row g-3">
                                <div className="col-lg-8">
                                    <label style={labelStyle}>Title *</label>
                                    <input name="title" required value={form.title} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div className="col-lg-2">
                                    <label style={labelStyle}>Slug *</label>
                                    <input name="slug" required value={form.slug} onChange={handleChange} style={inputStyle} placeholder="market-intelligence-strategy" />
                                </div>
                                <div className="col-lg-2">
                                    <label style={labelStyle}>Order *</label>
                                    <input name="order" required type="number" min="1" value={form.order} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Headline *</label>
                                <input name="headline" required value={form.headline} onChange={handleChange} style={inputStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Body *</label>
                                <textarea name="body" required rows={4} value={form.body} onChange={handleChange} style={textareaStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Includes <span style={{ color: '#5a6070', fontWeight: 400 }}>(comma-separated)</span></label>
                                <input name="includes" value={form.includes} onChange={handleChange} style={inputStyle} />
                            </div>

                            {/* ── Why Drew? section ── */}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                                <p style={{ color: '#9aa0b4', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>"Why Drew?" Box (optional)</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <label style={labelStyle}>Box Title</label>
                                        <input name="whyDrewTitle" value={form.whyDrewTitle} onChange={handleChange} style={inputStyle} placeholder="Why Drew?" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Box Content</label>
                                        <textarea name="whyDrewContent" rows={3} value={form.whyDrewContent} onChange={handleChange} style={textareaStyle} placeholder="We combine sharp strategic thinking..." />
                                    </div>
                                </div>
                            </div>

                            {/* ── Second box icon ── */}
                            <div>
                                <label style={labelStyle}>Second Box Icon <span style={{ color: '#5a6070', fontWeight: 400 }}>(optional — shown beside the &quot;Why Drew?&quot; text)</span></label>
                                <ImageUpload
                                    value={form.secondBoxIcon}
                                    onChange={(url) => setForm((p) => ({ ...p, secondBoxIcon: url }))}
                                    type="solution-icon"
                                />
                                {form.secondBoxIcon && (
                                    <button type="button" onClick={() => setForm(p => ({ ...p, secondBoxIcon: '' }))} style={{ marginTop: '8px', background: 'none', border: '1px solid rgba(255,60,0,0.4)', color: '#ff7c5c', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                                        ✕ Remove Icon
                                    </button>
                                )}
                            </div>

                            <div>
                                <label style={labelStyle}>Card / Detail Image <span style={{ color: '#5a6070', fontWeight: 400 }}>(optional, 306×204)</span></label>
                                <ImageUpload
                                    value={form.image}
                                    onChange={(url) => setForm((p) => ({ ...p, image: url }))}
                                    type="solution-image"
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Icon <span style={{ color: '#5a6070', fontWeight: 400 }}>(optional, 35×35)</span></label>
                                <ImageUpload
                                    value={form.icon}
                                    onChange={(url) => setForm((p) => ({ ...p, icon: url }))}
                                    type="solution-icon"
                                />
                            </div>

                            {/* Featured toggle */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'rgba(0,196,140,0.05)', border: '1px solid rgba(0,196,140,0.18)', borderRadius: '8px' }}>
                                <input
                                    type="checkbox"
                                    id="featured-edit"
                                    checked={form.featured || false}
                                    onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                                    style={{ width: '18px', height: '18px', accentColor: '#00c48c', cursor: 'pointer' }}
                                />
                                <label htmlFor="featured-edit" style={{ color: '#e0e4f0', fontSize: '14px', fontWeight: 600, cursor: 'pointer', margin: 0 }}>
                                    <i className="bi bi-star-fill me-2" style={{ color: '#00c48c' }}></i>
                                    Show on Homepage
                                    <span style={{ color: '#5a6070', fontWeight: 400, fontSize: '12px', marginLeft: '8px' }}>max 3 recommended</span>
                                </label>
                            </div>
                        </div>

                        <div className="d-flex gap-3 mt-4">
                            <button type="submit" disabled={loading} style={submitBtn('#00c48c')}>
                                {loading ? <><i className="bi bi-hourglass-split me-2"></i>Saving…</> : <><i className="bi bi-check-lg me-2"></i>Save Changes</>}
                            </button>
                            <Link href="/admin/solutions" style={cancelBtn}>Cancel</Link>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}

function LoadingScreen() {
    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa0b4' }}>
            <i className="bi bi-hourglass-split me-2"></i> Loading…
        </div>
    );
}

const labelStyle = { color: '#9aa0b4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e0e4f0', fontSize: '14px', outline: 'none' };
const textareaStyle = { ...inputStyle, resize: 'vertical', lineHeight: 1.6 };
const cancelBtn = { padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#9aa0b4', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' };
function submitBtn(color) {
    return { padding: '10px 24px', background: color, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' };
}
