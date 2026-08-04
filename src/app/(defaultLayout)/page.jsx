import React from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Hero3 from '../Components/Banner/Hero3';
import Services3 from '../Components/Services/Services3';
import About3 from '../Components/About/About3';
import Counter from '../Components/Counter/Counter';
import CaseStudy from '../Components/CaseStudy/CaseStudy';
import Process2 from '../Components/Process/Process2';
import Faq2 from '../Components/Faq/Faq2';
import Blog2 from '../Components/Blog/Blog2';

export const metadata = {
    title:       'Home',
    description: 'Drew Marketing Solutions — Nairobi\'s strategic growth partner. We build data-driven marketing systems that connect your brand to the right audience.',
    openGraph: {
        title:       'Drew Marketing Solutions | Strategic Growth Partner',
        description: 'Nairobi\'s strategic growth partner. Data-driven marketing, brand strategy & demand generation.',
        url:         'https://www.drewmarketingsolutions.com',
    },
};

export default async function HomePage() {
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
        <div className='home-page3'>
            <Hero3></Hero3>
            <Services3></Services3>
            <About3
                bgImg="/assets/images/home-3/about3-bg.png"
                MainImg={settings.homepageAboutImage || 'https://picsum.photos/seed/about-drew/633/623'}
                SubTitle={settings.homepageAboutSubTitle || 'ABOUT DREW'}
                Title={settings.homepageAboutTitle || 'Strategy-led growth for brands ready to <span>align.</span>'}
                Content="We start with understanding before execution. Because real growth doesn't come from being everywhere — it comes from being intentional, relevant, and precise."
                BoxTitle1="Strategy Before Spend"
                BoxTitle2="Results Guaranteed"
                listTitle1="Data-driven insights that guide every decision"
                listTitle2="Marketing systems built for measurable business outcomes"
            ></About3>
           <Counter></Counter>
           <CaseStudy></CaseStudy>
           <Process2></Process2>
           <Faq2></Faq2>
           <Blog2></Blog2>
        </div>
    );
}