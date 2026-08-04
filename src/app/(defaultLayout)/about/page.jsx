import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import About4 from '@/app/Components/About/About4';
import Blog1 from '@/app/Components/Blog/Blog1';
import Brand from '@/app/Components/Brand/Brand';
import BreadCumb from '@/app/Components/Common/BreadCumb';
import Project1 from '@/app/Components/Project/Project1';
import Testimonial3 from '@/app/Components/Testimonial/Testimonial3';
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

export default async function AboutPage() {
    noStore();

    let settings = {};
    try {
        await connectDB();
        const db  = mongoose.connection;
        settings  = (await db.collection('settings').findOne({})) ?? {};
    } catch (_) {
        // Silently fall back to defaults if DB is unavailable
    }

    return (
        <div className='about-page'>
            <BreadCumb Title="About Drew"></BreadCumb>
            <About4
                MainImg={settings.aboutPageImage || 'https://picsum.photos/seed/about-us/635/520'}
                SubTitle={settings.aboutPageSubTitle || 'DREW MARKETING SOLUTIONS'}
                Title={settings.aboutPageTitle || "We didn't start Drew to do marketing.<br> We started it to <span>fix it.</span>"}
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
            <Testimonial3></Testimonial3>
            <Brand></Brand>
            <Blog1></Blog1>
        </div>
    );
}