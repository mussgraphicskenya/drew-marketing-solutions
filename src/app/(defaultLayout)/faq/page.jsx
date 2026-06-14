import BreadCumb from '@/app/Components/Common/BreadCumb';
import Faq from '@/app/Components/Faq/Faq';
import React from 'react';

const page = () => {
    return (
        <div className='faq-page'>
            <BreadCumb Title="Faq"></BreadCumb>
            <Faq></Faq>
        </div>
    );
};

export default page;