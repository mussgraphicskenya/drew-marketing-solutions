'use strict';
const https = require('https');

const url = 'https://res.cloudinary.com/drilzezb6/raw/upload/v1782034931/drew-marketing/pdfs/solution-overview-experiential-media-integration.pdf';

https.get(url, (res) => {
    console.log('Status:', res.statusCode, res.statusMessage);
    console.log('Content-Type:', res.headers['content-type']);
    res.destroy();
}).on('error', (err) => {
    console.error('Error:', err.message);
});
