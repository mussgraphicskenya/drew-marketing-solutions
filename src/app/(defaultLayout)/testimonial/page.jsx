import Blog1 from '@/app/Components/Blog/Blog1';
import BreadCumb from '@/app/Components/Common/BreadCumb';
import Testimonial4 from '@/app/Components/Testimonial/Testimonial4';
import React from 'react';

const page = () => {
    return (
        <div className='testimonial-page'>
            <BreadCumb Title="Testimonial"></BreadCumb>
            <Testimonial4></Testimonial4>
            <Blog1></Blog1>
        </div>
    );
};

export default page;