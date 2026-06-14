'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/app/Components/Admin/ImageUpload';

const CATEGORIES = ['Marketing Strategy', 'Brand Positioning', 'Business Growth', 'Digital Marketing', 'Thought Leadership'];

export default function EditInsightPage({ params }) {
    const { id } = params;
    const router = useRouter();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`/api/admin/insights/${id}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) throw new Error(data.error);
                setForm({
                    title:             data.title             ?? '',
                    slug:              data.slug              ?? '',
                    excerpt:           data.excerpt           ?? '',
                    content:           data.content           ?? '',
                    category:          data.category          ?? CATEGORIES[0],
                    author:            data.author            ?? '',
                    coverImage:        data.coverImage        ?? '',
                    featured:          data.featured          ?? false,
                    keyTakeaways:      Array.isArray(data.keyTakeaways) ? data.keyTakeaways.join('\n') : (data.keyTakeaways ?? ''),
                    tags:              Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags ?? ''),
                    articleImage1:     (data.articleImages && data.articleImages[0]) ? data.articleImages[0] : '',
                    articleImage2:     (data.articleImages && data.articleImages[1]) ? data.articleImages[1] : '',
                    conclusionTitle:   data.conclusionTitle   ?? '',
                    conclusionContent: data.conclusionContent ?? '',
                    quote:             data.quote             ?? '',
                    quoteAuthor:       data.quoteAuthor       ?? '',
                });
            })
            .catch((err) => setError(err.message))
            .finally(() => setFetching(false));
    }, [id]);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                ...form,
                keyTakeaways: form.keyTakeaways.split('\n').map((s) => s.trim()).filter(Boolean),
                tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
                articleImages: [form.articleImage1, form.articleImage2].filter(Boolean),
            };
            delete payload.articleImage1;
            delete payload.articleImage2;
            const res = await fetch(`/api/admin/insights/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update insight');
            }
            router.push('/admin/insights');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    if (fetching) return <LoadingScreen />;

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e4f0', fontFamily: 'system-ui, sans-serif' }}>
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/admin/insights" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-arrow-left"></i> Insights
                </Link>
                <span style={{ color: '#3a4055' }}>|</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>
                    <i className="bi bi-pencil me-2" style={{ color: '#4f6ef7' }}></i>Edit Insight
                </span>
            </nav>

            <main style={{ padding: '32px', maxWidth: '780px', margin: '0 auto' }}>
                <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Edit Insight</h1>

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
                                <div className="col-lg-4">
                                    <label style={labelStyle}>Slug *</label>
                                    <input name="slug" required value={form.slug} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-lg-6">
                                    <label style={labelStyle}>Category *</label>
                                    <select name="category" required value={form.category} onChange={handleChange} style={inputStyle}>
                                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="col-lg-6">
                                    <label style={labelStyle}>Author *</label>
                                    <input name="author" required value={form.author} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Excerpt *</label>
                                <textarea name="excerpt" required rows={2} value={form.excerpt} onChange={handleChange} style={textareaStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Pull Quote <span style={{ color: '#5a6070', fontWeight: 400 }}>(optional)</span></label>
                                <textarea name="quote" rows={3} value={form.quote} onChange={handleChange} style={textareaStyle} placeholder="Pull quote (optional) - a highlighted quote from the article" />
                            </div>

                            <div>
                                <label style={labelStyle}>Quote Author <span style={{ color: '#5a6070', fontWeight: 400 }}>(optional, defaults to article author)</span></label>
                                <input name="quoteAuthor" value={form.quoteAuthor} onChange={handleChange} style={inputStyle} placeholder="Quote author (optional, defaults to article author)" />
                            </div>

                            <div>
                                <label style={labelStyle}>Content *</label>
                                <textarea name="content" required rows={8} value={form.content} onChange={handleChange} style={textareaStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Conclusion Title <span style={{ color: '#5a6070', fontWeight: 400 }}>(optional)</span></label>
                                <input name="conclusionTitle" value={form.conclusionTitle} onChange={handleChange} style={inputStyle} placeholder="Conclusion Title (optional)" />
                            </div>

                            <div>
                                <label style={labelStyle}>Conclusion Content <span style={{ color: '#5a6070', fontWeight: 400 }}>(optional)</span></label>
                                <textarea name="conclusionContent" rows={4} value={form.conclusionContent} onChange={handleChange} style={textareaStyle} placeholder="Conclusion paragraph (optional)" />
                            </div>

                            <div>
                                <label style={labelStyle}>Cover Image</label>
                                <ImageUpload
                                    value={form.coverImage}
                                    onChange={(url) => setForm((p) => ({ ...p, coverImage: url }))}
                                    type="insight"
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Article Image 1 <span style={{ color: '#5a6070', fontWeight: 400 }}>(optional)</span></label>
                                <ImageUpload
                                    value={form.articleImage1}
                                    onChange={(url) => setForm((p) => ({ ...p, articleImage1: url }))}
                                    type="insight"
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Article Image 2 <span style={{ color: '#5a6070', fontWeight: 400 }}>(optional)</span></label>
                                <ImageUpload
                                    value={form.articleImage2}
                                    onChange={(url) => setForm((p) => ({ ...p, articleImage2: url }))}
                                    type="insight"
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Key Takeaways <span style={{ color: '#5a6070', fontWeight: 400 }}>(one per line)</span></label>
                                <textarea name="keyTakeaways" rows={4} value={form.keyTakeaways} onChange={handleChange} style={textareaStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Tags <span style={{ color: '#5a6070', fontWeight: 400 }}>(comma separated)</span></label>
                                <input name="tags" value={form.tags} onChange={handleChange} style={inputStyle} placeholder="Strategy, Branding, Growth" />
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: '#4f6ef7', cursor: 'pointer' }} />
                                <label htmlFor="featured" style={{ color: '#c8cdd8', fontSize: '14px', cursor: 'pointer', margin: 0 }}>Mark as Featured</label>
                            </div>
                        </div>

                        <div className="d-flex gap-3 mt-4">
                            <button type="submit" disabled={loading} style={submitBtn('#4f6ef7')}>
                                {loading ? <><i className="bi bi-hourglass-split me-2"></i>Saving…</> : <><i className="bi bi-check-lg me-2"></i>Save Changes</>}
                            </button>
                            <Link href="/admin/insights" style={cancelBtn}>Cancel</Link>
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
