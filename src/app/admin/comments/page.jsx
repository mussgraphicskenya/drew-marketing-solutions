'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function AdminCommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    const [error, setError] = useState('');

    const fetchComments = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/comments', { cache: 'no-store' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load comments');
            setComments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchComments(); }, [fetchComments]);

    async function handleApprove(id) {
        setActionId(id);
        try {
            const res = await fetch(`/api/admin/comments/${id}`, { method: 'PATCH' });
            if (!res.ok) throw new Error('Failed to approve');
            setComments((prev) => prev.filter((c) => String(c._id) !== id));
        } catch (err) {
            alert(err.message);
        } finally {
            setActionId(null);
        }
    }

    async function handleReject(id) {
        if (!confirm('Permanently delete this comment?')) return;
        setActionId(id);
        try {
            const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setComments((prev) => prev.filter((c) => String(c._id) !== id));
        } catch (err) {
            alert(err.message);
        } finally {
            setActionId(null);
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e4f0', fontFamily: 'system-ui, sans-serif' }}>
            {/* Nav */}
            <nav style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/admin" style={{ color: '#9aa0b4', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-arrow-left"></i> Dashboard
                </Link>
                <span style={{ color: '#3a4055' }}>|</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>
                    <i className="bi bi-chat-dots-fill me-2" style={{ color: '#a78bfa' }}></i>
                    Pending Comments
                </span>
            </nav>

            <main style={{ padding: '32px 20px', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>Comment Moderation</h1>
                        <p style={{ color: '#9aa0b4', fontSize: '14px', margin: '4px 0 0' }}>
                            {loading ? 'Loading…' : `${comments.length} pending comment${comments.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                    <button
                        onClick={fetchComments}
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#9aa0b4', fontSize: '13px', padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <i className="bi bi-arrow-clockwise"></i> Refresh
                    </button>
                </div>

                {error && (
                    <div style={{ background: 'rgba(255,60,0,0.12)', border: '1px solid rgba(255,60,0,0.3)', color: '#ff7c5c', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px' }}>
                        <i className="bi bi-exclamation-circle me-2"></i>{error}
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#9aa0b4' }}>
                        <i className="bi bi-hourglass-split me-2"></i>Loading comments…
                    </div>
                ) : comments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#9aa0b4' }}>
                        <i className="bi bi-chat-square-text" style={{ fontSize: '48px', display: 'block', marginBottom: '16px', opacity: 0.4 }}></i>
                        <p style={{ fontSize: '16px', margin: 0 }}>No pending comments — all clear!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {comments.map((c) => {
                            const id = String(c._id);
                            const isActing = actionId === id;
                            return (
                                <div
                                    key={id}
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '22px', opacity: isActing ? 0.5 : 1, transition: '0.2s' }}
                                >
                                    {/* Header row */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'flex-start', marginBottom: '14px' }}>
                                        <div style={{ flex: 1, minWidth: '220px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <i className="bi bi-person-fill" style={{ color: '#a78bfa', fontSize: '16px' }}></i>
                                                </div>
                                                <div>
                                                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{c.name}</div>
                                                    <div style={{ color: '#9aa0b4', fontSize: '12px' }}>{c.email}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <span style={{ background: 'rgba(79,110,247,0.15)', color: '#7c9fff', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>
                                                <i className="bi bi-link-45deg me-1"></i>{c.insightSlug}
                                            </span>
                                            <div style={{ color: '#5a6070', fontSize: '11px', marginTop: '4px' }}>
                                                {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comment text */}
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px', color: '#c8cdd8', fontSize: '14px', lineHeight: 1.7, borderLeft: '3px solid rgba(167,139,250,0.4)' }}>
                                        {c.comment}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => handleApprove(id)}
                                            disabled={isActing}
                                            style={{ padding: '8px 20px', background: 'rgba(0,196,140,0.15)', border: '1px solid rgba(0,196,140,0.3)', borderRadius: '8px', color: '#00c48c', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <i className="bi bi-check-lg"></i>
                                            {isActing ? 'Approving…' : 'Approve'}
                                        </button>
                                        <button
                                            onClick={() => handleReject(id)}
                                            disabled={isActing}
                                            style={{ padding: '8px 20px', background: 'rgba(255,60,0,0.12)', border: '1px solid rgba(255,60,0,0.25)', borderRadius: '8px', color: '#ff7c5c', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <i className="bi bi-trash3"></i>
                                            {isActing ? 'Deleting…' : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
