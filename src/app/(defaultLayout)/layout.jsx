import React from 'react';
import HeaderWrapper from '../Components/Header/HeaderWrapper';
import Footer from '../Components/Footer/Footer';

const layout = ({ children }) => {
    return (
        <div className='main-page-area3'>
            <HeaderWrapper></HeaderWrapper>
            {children}
            <Footer></Footer>
        </div>
    );
};

export default layout;