import Blog3 from '@/app/Components/Blog/Blog3';
import BreadCumb from '@/app/Components/Common/BreadCumb';
import React from 'react';

export const metadata = {
    title:       'Insights',
    description: 'Marketing insights, brand strategy articles and thought leadership from Drew Marketing Solutions — helping brands grow intentionally in Kenya.',
    openGraph: {
        title:       'Marketing Insights | Drew Marketing Solutions',
        description: 'Thought leadership and practical marketing strategy from Drew\'s team.',
        url:         'https://www.drewmarketingsolutions.com/blog',
    },
};

const page = ({ searchParams }) => {
    // Next.js passes query params as a plain object to page components
    const category = searchParams?.category || '';

    return (
        <div className='blog-page'>
            <BreadCumb Title={category ? `Insights — ${category}` : 'Insights'}></BreadCumb>
            <Blog3 category={category}></Blog3>
        </div>
    );
};

export default page;