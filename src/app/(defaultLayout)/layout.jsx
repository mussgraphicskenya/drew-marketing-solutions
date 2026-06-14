import React from 'react';
import HeaderStyle3 from '../Components/Header/HeaderStyle3';
import Footer from '../Components/Footer/Footer';

const layout = ({ children }) => {
    return (
        <div className='main-page-area3'>
            <HeaderStyle3></HeaderStyle3>
            {children}
            <Footer></Footer>
        </div>
    );
};

export default layout;