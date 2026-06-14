import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// Transformation presets keyed by upload type
const TRANSFORMS = {
    'case-study':    [{ width: 606,  height: 447, crop: 'fill', gravity: 'auto' }],
    'insight':       [{ width: 364,  height: 248, crop: 'fill', gravity: 'auto' }],
    'testimonial':   [{ width: 330,  height: 370, crop: 'fill', gravity: 'auto' }],
    'solution-icon': [{ width: 35,   height: 35,  crop: 'fill', gravity: 'auto' }],
    'team':          [{ width: 306,  height: 388, crop: 'fill', gravity: 'auto' }],
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
