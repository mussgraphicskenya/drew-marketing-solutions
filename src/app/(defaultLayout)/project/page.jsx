import BreadCumb from '@/app/Components/Common/BreadCumb';
import Projecr3 from '@/app/Components/Project/Projecr3';
import React from 'react';

export const metadata = {
    title:       'Case Studies',
    description: 'Explore how Drew Marketing Solutions has helped brands across Nairobi and Kenya achieve measurable growth through strategic marketing.',
    openGraph: {
        title:       'Case Studies | Drew Marketing Solutions',
        description: 'Real results from real brands — see how strategic marketing creates measurable business growth.',
        url:         'https://www.drewmarketingsolutions.com/project',
    },
};

const page = () => {
    return (
        <div className='project-page'>
            <BreadCumb Title="Case Studies"></BreadCumb>
            <Projecr3></Projecr3>
        </div>
    );
};

export default page;