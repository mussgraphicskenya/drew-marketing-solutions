'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/app/Components/Admin/ImageUpload';

const CATEGORIES = ['Marketing Strategy', 'Brand Positioning', 'Business Growth', 'Digital Marketing', 'Thought Leadership'];

export default function NewCaseStudyPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: '', slug: '', client: '', industry: '', problem: '',
        insight: '', strategy: '', execution: '', results: '',
        coverImage: '', featured: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    function autoSlug(title) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/case-studies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create case study');
            }
            router.push('/admin/case-studies');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e4f0', fontFamily: 'system-ui, sans-serif' }}>
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/admin/case-studies" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-arrow-left"></i> Case Studies
                </Link>
                <span style={{ color: '#3a4055' }}>|</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>
                    <i className="bi bi-plus-circle me-2" style={{ color: '#ff3c00' }}></i>New Case Study
                </span>
            </nav>

            <main style={{ padding: '32px', maxWidth: '780px', margin: '0 auto' }}>
                <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Add New Case Study</h1>

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
                                <input name="title" required value={form.title} onChange={(e) => { handleChange(e); setForm((p) => ({ ...p, slug: autoSlug(e.target.value) })); }} style={inputStyle} placeholder="Brand Repositioning for a Retail Brand" />
                            </div>
                            <div className="col-lg-4">
                                <label style={labelStyle}>Slug *</label>
                                <input name="slug" required value={form.slug} onChange={handleChange} style={inputStyle} placeholder="brand-repositioning-retail" />
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-lg-6">
                                <label style={labelStyle}>Client</label>
                                <input name="client" value={form.client} onChange={handleChange} style={inputStyle} placeholder="Confidential" />
                            </div>
                            <div className="col-lg-6">
                                <label style={labelStyle}>Industry *</label>
                                <input name="industry" required value={form.industry} onChange={handleChange} style={inputStyle} placeholder="Retail, Technology, Financial Services…" />
                            </div>
                        </div>

                        {[
                            { name: 'problem',   label: 'Problem *',   ph: 'What challenge did the client face?' },
                            { name: 'insight',   label: 'Insight *',   ph: 'What did you discover about the root cause?' },
                            { name: 'strategy',  label: 'Strategy *',  ph: 'How did you approach solving it?' },
                            { name: 'execution', label: 'Execution *', ph: 'What was actually done and over what timeline?' },
                            { name: 'results',   label: 'Results *',   ph: 'What measurable outcomes were achieved?' },
                        ].map(({ name, label, ph }) => (
                            <div key={name}>
                                <label style={labelStyle}>{label}</label>
                                <textarea name={name} required rows={3} value={form[name]} onChange={handleChange} style={textareaStyle} placeholder={ph} />
                            </div>
                        ))}

                        <div>
                            <label style={labelStyle}>Cover Image</label>
                            <ImageUpload
                                value={form.coverImage}
                                onChange={(url) => setForm((p) => ({ ...p, coverImage: url }))}
                                type="case-study"
                            />
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: '#ff3c00', cursor: 'pointer' }} />
                            <label htmlFor="featured" style={{ color: '#c8cdd8', fontSize: '14px', cursor: 'pointer', margin: 0 }}>Mark as Featured</label>
                        </div>
                    </div>

                    <div className="d-flex gap-3 mt-4">
                        <button type="submit" disabled={loading} style={submitBtn('#ff3c00')}>
                            {loading ? <><i className="bi bi-hourglass-split me-2"></i>Saving…</> : <><i className="bi bi-check-lg me-2"></i>Create Case Study</>}
                        </button>
                        <Link href="/admin/case-studies" style={cancelBtn}>Cancel</Link>
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
