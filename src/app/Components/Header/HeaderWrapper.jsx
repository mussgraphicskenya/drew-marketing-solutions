// Server component — fetches settings from MongoDB and passes to HeaderStyle3
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import HeaderStyle3 from './HeaderStyle3';

export default async function HeaderWrapper(props) {
    let settings = {};
    try {
        await connectDB();
        settings = (await mongoose.connection.collection('settings').findOne({})) ?? {};
    } catch (_) {}

    return (
        <HeaderStyle3
            {...props}
            contactAddress={settings.address        || 'Westlands, Nairobi - Kenya'}
            contactEmail={settings.email             || 'hello@drewmarketingsolutions.com'}
            contactHours={settings.hours             || '8.00 am - 6.00 pm'}
            socialFacebook={settings.socialFacebook  || ''}
            socialTwitter={settings.socialTwitter    || ''}
            socialLinkedin={settings.socialLinkedin  || ''}
            socialInstagram={settings.socialInstagram || ''}
        />
    );
}
