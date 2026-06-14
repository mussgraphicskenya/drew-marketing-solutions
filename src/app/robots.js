export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow:     '/',
                disallow:  ['/admin/', '/api/'],
            },
        ],
        sitemap: 'https://www.drewmarketingsolutions.com/sitemap.xml',
    };
}
