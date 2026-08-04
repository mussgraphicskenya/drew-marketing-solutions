import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
    {
        // Images
        homepageAboutImage: { type: String, default: '' },
        aboutPageImage:     { type: String, default: '' },

        // Homepage About section text
        homepageAboutSubTitle: { type: String, default: 'ABOUT DREW' },
        homepageAboutTitle:    {
            type:    String,
            default: 'Strategy-led growth for brands ready to align.',
        },

        // About page text
        aboutPageSubTitle: { type: String, default: 'DREW MARKETING SOLUTIONS' },
        aboutPageTitle:    {
            type:    String,
            default: "We didn't start Drew to do marketing. We started it to fix it.",
        },

        // Contact details
        phone:   { type: String, default: '+254 700 000 000' },
        email:   { type: String, default: 'hello@drewmarketingsolutions.com' },
        address: { type: String, default: 'Westlands, Nairobi - Kenya' },
        hours:   { type: String, default: '8.00 am - 6.00 pm' },

        // Social media links
        socialFacebook:  { type: String, default: '' },
        socialTwitter:   { type: String, default: '' },
        socialLinkedin:  { type: String, default: '' },
        socialInstagram: { type: String, default: '' },

    },
    { timestamps: true }
);

// Prevent model re-compilation in Next.js dev hot-reload
const Settings =
    mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
