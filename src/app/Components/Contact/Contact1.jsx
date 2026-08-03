"use client"
import { useEffect } from "react";
import SectionTitle from "../Common/SectionTitle";
import Form from "../Form/Form";
import loadBackgroudImages from "../Common/loadBackgroudImages";


const Contact1 = () => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);

    return (
        <div className="contact-area" data-background="/assets/images/contact-bg2.png">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-10">
                            <div className="section-title text-left">
                            <SectionTitle
                                    SubTitle="CONTACT DREW"
                                    Title="If your marketing isn't aligned,<br> it's costing you."
                            ></SectionTitle>
                            </div>
                            <Form></Form>
                        </div>
                    </div>
                </div>
            </div>

    );
};

export default Contact1;