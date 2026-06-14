import Blog1 from '@/app/Components/Blog/Blog1';
import BreadCumb from '@/app/Components/Common/BreadCumb';
import Pricing from '@/app/Components/Pricing/Pricing';
import React from 'react';

const page = () => {
    return (
        <div className='pricing-page'>
            <BreadCumb Title="Pricing"></BreadCumb>
            <Pricing></Pricing>
            <Blog1></Blog1>
        </div>
    );
};

export default page;