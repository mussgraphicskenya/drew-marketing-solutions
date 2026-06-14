import BlogDetail from '@/app/Components/BlogDetail/BlogDetail';
import BreadCumb from '@/app/Components/Common/BreadCumb';
import React from 'react';

const page = () => {
    return (
        <div className='blog-detail'>
            <BreadCumb Title="Blog Details"></BreadCumb>
            <BlogDetail></BlogDetail>
        </div>
    );
};

export default page;