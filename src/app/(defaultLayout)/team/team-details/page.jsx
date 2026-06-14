import BreadCumb from '@/app/Components/Common/BreadCumb';
import TeamDetail from '@/app/Components/TeamDetail/TeamDetail';
import React from 'react';

const page = () => {
    return (
        <div className='team-detail'>
            <BreadCumb Title="Team Details"></BreadCumb>
            <TeamDetail></TeamDetail>
        </div>
    );
};

export default page;