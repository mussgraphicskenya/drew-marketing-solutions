'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/app/Components/Admin/ImageUpload';

export default function NewTeamMemberPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '', role: '', order: 1,
        image: '', facebook: '', twitter: '', linkedin: '',
    });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: name === 'order' ? Number(value) : value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.name.trim() || !form.role.trim()) {
            setError('Name and Role are required.');
            return;
        }
        setStatus('saving');
        setError('');
        try {
            const res = await fetch('/api/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
            router.push('/admin/team');
        } catch (err) {
            setError(err.message);
            setStatus('idle');
        }
    }

    const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#e0e4f0', fontSize: '14px', outline: 'none' };
    const labelStyle = { color: '#9aa0b4', fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' };

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e4f0', fontFamily: 'system-ui, sans-serif' }}>
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="d-flex align-items-center gap-3">
                    <Link href="/admin/team" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="bi bi-arrow-left"></i> Team Members
                    </Link>
                    <span style={{ color: '#3a4055' }}>|</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>
                        <i className="bi bi-person-plus-fill me-2" style={{ color: '#e879f9' }}></i>Add Team Member
                    </span>
                </div>
            </nav>

            <main style={{ padding: '32px', maxWidth: '680px', margin: '0 auto' }}>
                <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '28px' }}>New Team Member</h1>

                {error && (
                    <div style={{ background: 'rgba(255,60,0,0.12)', border: '1px solid rgba(255,60,0,0.25)', borderRadius: '8px', padding: '12px 16px', color: '#ff7c5c', marginBottom: '20px', fontSize: '14px' }}>
                        <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div className="row g-3">
                            <div className="col-md-8">
                                <label style={labelStyle}>Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Daniel Mwangi" required />
                            </div>
                            <div className="col-md-4">
                                <label style={labelStyle}>Display Order</label>
                                <input name="order" type="number" min="0" value={form.order} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Role / Title *</label>
                            <input name="role" value={form.role} onChange={handleChange} style={inputStyle} placeholder="Strategy Director" required />
                        </div>

                        <div>
                            <label style={labelStyle}>Photo</label>
                            <ImageUpload
                                value={form.image}
                                onChange={(url) => setForm((p) => ({ ...p, image: url }))}
                                type="team"
                            />
                        </div>

                        <hr style={{ borderColor: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />
                        <p style={{ color: '#9aa0b4', fontSize: '12px', margin: 0 }}>Social links — leave blank to hide</p>

                        <div>
                            <label style={labelStyle}>Facebook URL</label>
                            <input name="facebook" value={form.facebook} onChange={handleChange} style={inputStyle} placeholder="https://facebook.com/..." />
                        </div>
                        <div>
                            <label style={labelStyle}>Twitter / X URL</label>
                            <input name="twitter" value={form.twitter} onChange={handleChange} style={inputStyle} placeholder="https://x.com/..." />
                        </div>
                        <div>
                            <label style={labelStyle}>LinkedIn URL</label>
                            <input name="linkedin" value={form.linkedin} onChange={handleChange} style={inputStyle} placeholder="https://linkedin.com/in/..." />
                        </div>

                        <div className="d-flex align-items-center gap-2 mt-2">
                            <button
                                type="submit"
                                disabled={status === 'saving'}
                                style={{ padding: '11px 28px', background: status === 'saving' ? 'rgba(232,121,249,0.1)' : '#e879f9', border: 'none', borderRadius: '8px', color: status === 'saving' ? '#9aa0b4' : '#fff', fontSize: '14px', fontWeight: 700, cursor: status === 'saving' ? 'not-allowed' : 'pointer' }}
                            >
                                {status === 'saving' ? <><i className="bi bi-hourglass-split me-2"></i>Saving…</> : <><i className="bi bi-check-lg me-2"></i>Save Member</>}
                            </button>
                            <Link href="/admin/team" style={{ color: '#9aa0b4', fontSize: '14px', textDecoration: 'none' }}>Cancel</Link>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
