import About4 from '@/app/Components/About/About4';
import Blog1 from '@/app/Components/Blog/Blog1';
import Brand from '@/app/Components/Brand/Brand';
import BreadCumb from '@/app/Components/Common/BreadCumb';
import Project1 from '@/app/Components/Project/Project1';
import React from 'react';

export const metadata = {
    title:       'About Us',
    description: 'Learn how Drew Marketing Solutions helps ambitious Nairobi brands align marketing with business goals. Strategy before spend.',
    openGraph: {
        title:       'About Drew Marketing Solutions',
        description: 'A Nairobi-based strategic growth partner helping ambitious brands align their marketing to their business goals.',
        url:         'https://www.drewmarketingsolutions.com/about',
    },
};

const page = () => {
    return (
        <div className='about-page'>
            <BreadCumb Title="About Drew"></BreadCumb>
            <About4
                MainImg="/assets/images/inner/about-us-thu.png"
                SubTitle="DREW MARKETING SOLUTIONS"
                Title="We didn't start Drew to do marketing.<br> We started it to <span>fix it.</span>"
                Content="We are a Nairobi-based strategic growth partner helping ambitious brands align their marketing to their business goals."
                listTitle1="Strategy Before Spend"
                listTitle2="Data-Driven Growth Systems"
                BoxTitle1="50+"
                BoxTitle2="Brands Grown"
            ></About4>
            <Project1
                bgImage="/assets/images/inner/project-bg-3.png"
                ClassAdd="project-area style-two"
            ></Project1>
            <Brand></Brand>
            <Blog1></Blog1>
        </div>
    );
};

export default page;