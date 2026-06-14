import Blog1 from '@/app/Components/Blog/Blog1';
import BreadCumb from '@/app/Components/Common/BreadCumb';
import Services4 from '@/app/Components/Services/Services4';
import Team1 from '@/app/Components/Team/Team1';
import React from 'react';

export const metadata = {
    title:       'Our Solutions',
    description: 'From market intelligence to demand generation, explore the strategic marketing solutions Drew offers to grow your brand in Kenya and beyond.',
    openGraph: {
        title:       'Marketing Solutions | Drew Marketing Solutions',
        description: 'Strategic marketing services: brand positioning, demand generation, media integration & growth optimisation.',
        url:         'https://www.drewmarketingsolutions.com/service',
    },
};

const page = () => {
    return (
        <div className='service-page'>
            <BreadCumb Title="Our Solutions"></BreadCumb>
            <Services4></Services4>
            <Team1></Team1>
            <Blog1></Blog1>
        </div>
    );
};

export default page;