import BreadCumb from '@/app/Components/Common/BreadCumb';
import ProjectDetail from '@/app/Components/ProjectDetail/ProjectDetail';
import React from 'react';

const page = () => {
    return (
        <div className='project-detail'>
            <BreadCumb Title="Project Details"></BreadCumb>
            <ProjectDetail></ProjectDetail>
        </div>
    );
};

export default page;