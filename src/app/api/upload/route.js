import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// Transformation presets keyed by upload type
const TRANSFORMS = {
    'case-study':     [{ width: 1200, height: 900,  crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
    'insight':        [{ width: 1200, height: 800,  crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
    'testimonial':    [{ width: 800,  height: 900,  crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
    'solution-image': [{ width: 1200, height: 800,  crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
    'solution-icon':  [{ width: 200,  height: 200,  crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
    'team':           [{ width: 800,  height: 1000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
    'general':        [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
};

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file     = formData.get('file');
        const type     = formData.get('type') || 'general';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate MIME type
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: jpg, jpeg, png, webp' },
                { status: 400 }
            );
        }

        // Build upload options — apply transformation only when type is known
        const uploadOptions = {
            folder: 'drew-marketing',
            ...(TRANSFORMS[type] && { transformation: TRANSFORMS[type] }),
        };

        console.log(`[upload] type="${type}" cloud="${process.env.CLOUDINARY_CLOUD_NAME}" transform=${JSON.stringify(uploadOptions.transformation ?? null)}`);

        // Convert Web File → Node Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload via upload_stream
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(uploadOptions, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                })
                .end(buffer);
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (err) {
        console.error('[/api/upload]', err.message);
        return NextResponse.json({ error: 'Upload failed: ' + err.message }, { status: 500 });
    }
}
