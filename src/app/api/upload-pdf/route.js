import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file     = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate MIME type — accept PDF only
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: `Invalid file type "${file.type}". Only PDF files are accepted.` },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_SIZE_BYTES) {
            return NextResponse.json(
                { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 10 MB.` },
                { status: 400 }
            );
        }

        const originalName = file.name || 'document.pdf';

        // Convert Web File → Node Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log(`[upload-pdf] Uploading "${originalName}" (${(file.size / 1024).toFixed(0)} KB) to Cloudinary…`);

        // Upload to Cloudinary — resource_type:'auto' is required for non-image files
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder:        'drew-marketing/pdfs',
                        resource_type: 'raw',          // 'raw' for PDFs gives a stable, direct download URL
                        use_filename:  true,
                        unique_filename: true,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        console.log(`[upload-pdf] Uploaded OK → ${result.secure_url}`);

        return NextResponse.json({
            url:      result.secure_url,
            filename: originalName,
            size:     file.size,
            publicId: result.public_id,
        });

    } catch (err) {
        console.error('[/api/upload-pdf]', err.message);
        return NextResponse.json({ error: 'PDF upload failed: ' + err.message }, { status: 500 });
    }
}
