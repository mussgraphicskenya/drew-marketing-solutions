'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/app/Components/Admin/ImageUpload';

const NARRATIVE_FIELDS = [
    { name: 'problem',   label: 'Problem *' },
    { name: 'insight',   label: 'Insight *' },
    { name: 'strategy',  label: 'Strategy *' },
    { name: 'execution', label: 'Execution *' },
    { name: 'results',   label: 'Results *' },
];

export default function EditCaseStudyPage({ params }) {
    const { id } = params;
    const router  = useRouter();
    const [form,     setForm]     = useState(null);
    const [loading,  setLoading]  = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error,    setError]    = useState('');

    // Category selector state
    const [categories,  setCategories]  = useState([]);
    const [catsLoading, setCatsLoading] = useState(true);
    const [showNewCat,  setShowNewCat]  = useState(false);
    const [newCatName,  setNewCatName]  = useState('');
    const [addingCat,   setAddingCat]   = useState(false);
    const [catError,    setCatError]    = useState('');

    // Load case study data
    useEffect(() => {
        fetch(`/api/admin/case-studies/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setForm({
                    title:      data.title      ?? '',
                    slug:       data.slug       ?? '',
                    client:     data.client     ?? '',
                    industry:   data.industry   ?? '',
                    problem:    data.problem    ?? '',
                    insight:    data.insight    ?? '',
                    strategy:   data.strategy   ?? '',
                    execution:  data.execution  ?? '',
                    results:    data.results    ?? '',
                    coverImage:     data.coverImage     ?? '',
                    secondaryImage: data.secondaryImage ?? '',
                    featured:       data.featured       ?? false,
                });
            })
            .catch(err => setError(err.message))
            .finally(() => setFetching(false));
    }, [id]);

    // Load categories — and ensure the existing value is in the list
    useEffect(() => {
        fetch('/api/categories?type=case-study')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data.map(c => c.name));
            })
            .catch(() => {})
            .finally(() => setCatsLoading(false));
    }, []);

    // When form loads: if existing industry not in category list, add it as a local option
    useEffect(() => {
        if (form?.industry && categories.length > 0 && !categories.includes(form.industry)) {
            setCategories(prev => [form.industry, ...prev].sort());
        }
    }, [form?.industry, categories.length]); // eslint-disable-line

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    function handleIndustryChange(e) {
        const val = e.target.value;
        if (val === '__add_new__') {
            setShowNewCat(true);
        } else {
            setShowNewCat(false);
            setForm(prev => ({ ...prev, industry: val }));
        }
    }

    async function handleAddCategory() {
        if (!newCatName.trim()) return;
        setAddingCat(true);
        setCatError('');
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCatName.trim(), type: 'case-study' }),
            });
            const data = await res.json();
            if (!res.ok && res.status !== 200) throw new Error(data.error || 'Failed to add category');
            const name = data.name;
            setCategories(prev => (prev.includes(name) ? prev : [...prev, name].sort()));
            setForm(prev => ({ ...prev, industry: name }));
            setNewCatName('');
            setShowNewCat(false);
        } catch (err) {
            setCatError(err.message);
        } finally {
            setAddingCat(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/admin/case-studies/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update case study');
            }
            router.push('/admin/case-studies');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    if (fetching) return <LoadingScreen />;

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e4f0', fontFamily: 'system-ui, sans-serif' }}>
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/admin/case-studies" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-arrow-left"></i> Case Studies
                </Link>
                <span style={{ color: '#3a4055' }}>|</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>
                    <i className="bi bi-pencil me-2" style={{ color: '#ff3c00' }}></i>Edit Case Study
                </span>
            </nav>

            <main style={{ padding: '32px', maxWidth: '780px', margin: '0 auto' }}>
                <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Edit Case Study</h1>

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
                                    <label style={labelStyle}>Client</label>
                                    <input name="client" value={form.client} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div className="col-lg-6">
                                    <label style={labelStyle}>Industry / Category *</label>

                                    <select
                                        name="industry"
                                        required
                                        value={showNewCat ? '__add_new__' : form.industry}
                                        onChange={handleIndustryChange}
                                        style={{ ...inputStyle, cursor: 'pointer' }}
                                    >
                                        <option value="" disabled>{catsLoading ? 'Loading…' : 'Select a category'}</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="__add_new__">＋ Add New Category…</option>
                                    </select>

                                    {showNewCat && (
                                        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input
                                                value={newCatName}
                                                onChange={e => { setNewCatName(e.target.value); setCatError(''); }}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                                placeholder="New category name"
                                                style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                                                autoFocus
                                            />
                                            <button type="button" onClick={handleAddCategory} disabled={addingCat || !newCatName.trim()} style={submitBtn('#ff3c00')}>
                                                {addingCat ? '…' : 'Add'}
                                            </button>
                                            <button type="button" onClick={() => { setShowNewCat(false); setNewCatName(''); setCatError(''); }} style={{ ...submitBtn('#3a4055'), background: 'transparent', border: '1px solid rgba(255,255,255,0.15)' }}>
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                    {catError && <p style={{ color: '#ff7c5c', fontSize: '12px', marginTop: '6px' }}>{catError}</p>}
                                </div>
                            </div>

                            {NARRATIVE_FIELDS.map(({ name, label }) => (
                                <div key={name}>
                                    <label style={labelStyle}>{label}</label>
                                    <textarea name={name} required rows={3} value={form[name]} onChange={handleChange} style={textareaStyle} />
                                </div>
                            ))}

                            <div>
                                <label style={labelStyle}>Cover Image</label>
                                <ImageUpload
                                    value={form.coverImage}
                                    onChange={(url) => setForm(p => ({ ...p, coverImage: url }))}
                                    type="case-study"
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Secondary Image <span style={{ color: '#5a6070', fontWeight: 400, textTransform: 'none' }}>(optional — shown in the detail page mid-section)</span></label>
                                <ImageUpload
                                    value={form.secondaryImage}
                                    onChange={(url) => setForm(p => ({ ...p, secondaryImage: url }))}
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
                                {loading ? <><i className="bi bi-hourglass-split me-2"></i>Saving…</> : <><i className="bi bi-check-lg me-2"></i>Save Changes</>}
                            </button>
                            <Link href="/admin/case-studies" style={cancelBtn}>Cancel</Link>
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

const labelStyle    = { color: '#9aa0b4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' };
const inputStyle    = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e0e4f0', fontSize: '14px', outline: 'none' };
const textareaStyle = { ...inputStyle, resize: 'vertical', lineHeight: 1.6 };
const cancelBtn     = { padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#9aa0b4', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' };
function submitBtn(color) {
    return { padding: '10px 24px', background: color, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' };
}
