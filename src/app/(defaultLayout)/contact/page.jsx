import BreadCumb from '@/app/Components/Common/BreadCumb';
import Contact1 from '@/app/Components/Contact/Contact1';
import MapForm from '@/app/Components/Map/Mapform';
import React from 'react';

export const metadata = {
    title:       'Contact Us',
    description: 'Get in touch with Drew Marketing Solutions. Talk to our team about your brand\'s growth strategy, marketing systems, or partnership opportunities.',
    openGraph: {
        title:       'Contact Drew Marketing Solutions',
        description: 'Start a conversation about your brand\'s growth. Based in Nairobi, working with brands across Kenya.',
        url:         'https://www.drewmarketingsolutions.com/contact',
    },
};

const page = () => {
    return (
        <div className='contact-page'>
            <BreadCumb Title="Contact Us"></BreadCumb>
            <Contact1></Contact1>
            <MapForm></MapForm>
        </div>
    );
};

export default page;