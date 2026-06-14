'use client';

import { useRef, useState } from 'react';

/**
 * ImageUpload
 * @param {string}   value    - Current image URL (from formData)
 * @param {function} onChange - Called with the Cloudinary secure_url after upload
 * @param {string}   type     - Upload type: 'insight' | 'case-study' | 'testimonial' | 'solution-icon' | 'general'
 */
export default function ImageUpload({ value, onChange, type = 'general' }) {
    const inputRef = useRef(null);
    const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'error'
    const [errMsg, setErrMsg] = useState('');

    async function handleFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus('uploading');
        setErrMsg('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type); // ← pass type to the API

        try {
            const res  = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            onChange(data.url);
            setStatus('idle');
        } catch (err) {
            setErrMsg(err.message);
            setStatus('error');
        }

        // Reset so the same file can be re-selected
        e.target.value = '';
    }

    return (
        <div>
            {/* Hidden real file input */}
            <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                style={{ display: 'none' }}
                onChange={handleFile}
            />

            {/* Preview */}
            {value && (
                <div style={{ marginBottom: '12px', position: 'relative', display: 'inline-block' }}>
                    <img
                        src={value}
                        alt="Preview"
                        style={{
                            width:        '100%',
                            maxWidth:     '340px',
                            maxHeight:    '200px',
                            objectFit:    'cover',
                            borderRadius: '8px',
                            border:       '1px solid rgba(255,255,255,0.12)',
                            display:      'block',
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        title="Remove image"
                        style={{
                            position:       'absolute',
                            top:            '6px',
                            right:          '6px',
                            background:     'rgba(0,0,0,0.6)',
                            border:         'none',
                            borderRadius:   '50%',
                            color:          '#fff',
                            width:          '26px',
                            height:         '26px',
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            cursor:         'pointer',
                            fontSize:       '14px',
                        }}
                    >
                        <i className="bi bi-x"></i>
                    </button>
                </div>
            )}

            {/* Upload button */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                    type="button"
                    disabled={status === 'uploading'}
                    onClick={() => inputRef.current?.click()}
                    style={{
                        padding:      '9px 18px',
                        background:   status === 'uploading' ? 'rgba(255,255,255,0.06)' : 'rgba(79,110,247,0.15)',
                        border:       '1px solid rgba(79,110,247,0.35)',
                        borderRadius: '8px',
                        color:        status === 'uploading' ? '#9aa0b4' : '#7c9cff',
                        fontSize:     '13px',
                        fontWeight:   600,
                        cursor:       status === 'uploading' ? 'not-allowed' : 'pointer',
                        display:      'inline-flex',
                        alignItems:   'center',
                        gap:          '7px',
                        transition:   '0.2s',
                    }}
                >
                    {status === 'uploading' ? (
                        <><i className="bi bi-hourglass-split"></i> Uploading…</>
                    ) : (
                        <><i className="bi bi-cloud-upload"></i> {value ? 'Replace Image' : 'Choose Image'}</>
                    )}
                </button>

                {value && status !== 'uploading' && (
                    <span style={{ color: '#34d399', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="bi bi-check-circle-fill"></i> Uploaded
                    </span>
                )}
            </div>

            {/* Error */}
            {status === 'error' && (
                <p style={{ color: '#ff7c5c', fontSize: '13px', marginTop: '8px', marginBottom: 0 }}>
                    <i className="bi bi-exclamation-circle-fill me-1"></i>{errMsg}
                </p>
            )}

            {/* Accepted types hint */}
            <p style={{ color: '#5a6070', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
                Accepted: JPG, PNG, WebP
            </p>
        </div>
    );
}
