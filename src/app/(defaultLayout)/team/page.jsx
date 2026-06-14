import Blog1 from '@/app/Components/Blog/Blog1';
import BreadCumb from '@/app/Components/Common/BreadCumb';
import Team2 from '@/app/Components/Team/Team2';
import Testimonial2 from '@/app/Components/Testimonial/Testimonial2';
import React from 'react';

const page = () => {
    return (
        <div className='team-page'>
            <BreadCumb Title="Team"></BreadCumb>
            <Team2></Team2>
            <Testimonial2></Testimonial2>
            <Blog1></Blog1>
        </div>
    );
};

export default page;