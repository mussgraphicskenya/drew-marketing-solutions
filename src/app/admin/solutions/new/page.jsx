'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/app/Components/Admin/ImageUpload';
import PdfUpload from '@/app/Components/Admin/PdfUpload';

export default function NewSolutionPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: '', slug: '', headline: '', body: '', includes: '',
        whyDrewTitle: '', whyDrewContent: '', secondBoxIcon: '',
        icon: '', image: '', order: 1, featured: false, downloads: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name === 'order' ? Number(value) : value }));
    }

    function autoSlug(title) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                ...form,
                includes:  form.includes.split(',').map((s) => s.trim()).filter(Boolean),
                order:     Number(form.order),
                featured:  Boolean(form.featured),
                downloads: form.downloads.filter(d => d.title || d.fileUrl),
            };
            const res = await fetch('/api/admin/solutions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create solution');
            }
            router.push('/admin/solutions');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e4f0', fontFamily: 'system-ui, sans-serif' }}>
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/admin/solutions" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-arrow-left"></i> Solutions
                </Link>
                <span style={{ color: '#3a4055' }}>|</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>
                    <i className="bi bi-plus-circle me-2" style={{ color: '#00c48c' }}></i>New Solution
                </span>
            </nav>

            <main style={{ padding: '32px', maxWidth: '780px', margin: '0 auto' }}>
                <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Add New Solution</h1>

                {error && (
                    <div style={{ background: 'rgba(255,60,0,0.12)', border: '1px solid rgba(255,60,0,0.3)', color: '#ff7c5c', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px' }}>
                        <i className="bi bi-exclamation-circle me-2"></i>{error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div className="row g-3">
                            <div className="col-lg-8">
                                <label style={labelStyle}>Title *</label>
                                <input
                                    name="title"
                                    required
                                    value={form.title}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setForm((p) => ({ ...p, slug: autoSlug(e.target.value) }));
                                    }}
                                    style={inputStyle}
                                    placeholder="Market Intelligence & Strategy"
                                />
                            </div>
                            <div className="col-lg-2">
                                <label style={labelStyle}>Slug *</label>
                                <input
                                    name="slug"
                                    required
                                    value={form.slug}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="market-intelligence-strategy"
                                />
                            </div>
                            <div className="col-lg-2">
                                <label style={labelStyle}>Order *</label>
                                <input name="order" required type="number" min="1" value={form.order} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Headline *</label>
                            <input name="headline" required value={form.headline} onChange={handleChange} style={inputStyle} placeholder="We use research and data to identify your clearest growth path." />
                        </div>

                        <div>
                            <label style={labelStyle}>Body *</label>
                            <textarea name="body" required rows={4} value={form.body} onChange={handleChange} style={textareaStyle} placeholder="Detailed description of what this solution involves..." />
                        </div>

                        <div>
                            <label style={labelStyle}>Includes <span style={{ color: '#5a6070', fontWeight: 400 }}>(comma-separated)</span></label>
                            <input name="includes" value={form.includes} onChange={handleChange} style={inputStyle} placeholder="Market Research, Competitor Analysis, Audience Profiling" />
                            <p style={{ color: '#5a6070', fontSize: '12px', marginTop: '6px' }}>e.g. Market Research, Competitor Analysis, Audience Profiling</p>
                        </div>

                        {/* ── Why Drew? section ── */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                            <p style={{ color: '#9aa0b4', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>&quot;Why Drew?&quot; Box (optional)</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label style={labelStyle}>Box Title</label>
                                    <input name="whyDrewTitle" value={form.whyDrewTitle} onChange={handleChange} style={inputStyle} placeholder="Why Drew?" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Box Content</label>
                                    <textarea name="whyDrewContent" rows={3} value={form.whyDrewContent} onChange={handleChange} style={textareaStyle} placeholder="We combine sharp strategic thinking with deep local market knowledge..." />
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

                        {/* ── Downloads section ── */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                <p style={{ color: '#9aa0b4', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Downloads (optional)</p>
                                <button
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, downloads: [...p.downloads, { title: '', fileUrl: '' }] }))}
                                    style={{ background: 'rgba(0,196,140,0.12)', border: '1px solid rgba(0,196,140,0.3)', color: '#00c48c', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    <i className="bi bi-plus-lg me-1"></i> Add Download
                                </button>
                            </div>
                            {form.downloads.map((doc, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <span style={{ color: '#9aa0b4', fontSize: '12px', fontWeight: 600 }}>Download #{i + 1}</span>
                                        <button type="button" onClick={() => setForm(p => ({ ...p, downloads: p.downloads.filter((_, idx) => idx !== i) }))} style={{ background: 'none', border: '1px solid rgba(255,60,0,0.4)', color: '#ff7c5c', padding: '2px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Remove</button>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={labelStyle}>Label</label>
                                        <input
                                            value={doc.title}
                                            onChange={(e) => setForm(p => { const d = [...p.downloads]; d[i] = { ...d[i], title: e.target.value }; return { ...p, downloads: d }; })}
                                            style={inputStyle}
                                            placeholder="e.g. Solution Overview"
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>PDF File</label>
                                        <PdfUpload
                                            value={doc.fileUrl}
                                            onChange={(url) => setForm(p => { const d = [...p.downloads]; d[i] = { ...d[i], fileUrl: url }; return { ...p, downloads: d }; })}
                                            label={`download-${i}`}
                                        />
                                    </div>
                                </div>
                            ))}
                            {form.downloads.length === 0 && (
                                <p style={{ color: '#3a4055', fontSize: '13px', fontStyle: 'italic' }}>No downloads added yet. Click &quot;Add Download&quot; to attach a PDF.</p>
                            )}
                        </div>

                        {/* Featured toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'rgba(0,196,140,0.05)', border: '1px solid rgba(0,196,140,0.18)', borderRadius: '8px' }}>
                            <input
                                type="checkbox"
                                id="featured-new"
                                checked={form.featured || false}
                                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                                style={{ width: '18px', height: '18px', accentColor: '#00c48c', cursor: 'pointer' }}
                            />
                            <label htmlFor="featured-new" style={{ color: '#e0e4f0', fontSize: '14px', fontWeight: 600, cursor: 'pointer', margin: 0 }}>
                                <i className="bi bi-star-fill me-2" style={{ color: '#00c48c' }}></i>
                                Show on Homepage
                                <span style={{ color: '#5a6070', fontWeight: 400, fontSize: '12px', marginLeft: '8px' }}>max 3 recommended</span>
                            </label>
                        </div>
                    </div>

                    <div className="d-flex gap-3 mt-4">
                        <button type="submit" disabled={loading} style={submitBtn('#00c48c')}>
                            {loading ? <><i className="bi bi-hourglass-split me-2"></i>Saving…</> : <><i className="bi bi-check-lg me-2"></i>Create Solution</>}
                        </button>
                        <Link href="/admin/solutions" style={cancelBtn}>Cancel</Link>
                    </div>
                </form>
            </main>
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
