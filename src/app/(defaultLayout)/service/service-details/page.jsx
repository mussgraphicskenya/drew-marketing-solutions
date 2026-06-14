import BreadCumb from '@/app/Components/Common/BreadCumb';
import ServiceDetail from '@/app/Components/ServiceDetail/ServiceDetail';
import React from 'react';

const page = () => {
    return (
        <div className='service-details'>
            <BreadCumb Title="Service Details"></BreadCumb>
            <ServiceDetail></ServiceDetail>
        </div>
    );
};

export default page;