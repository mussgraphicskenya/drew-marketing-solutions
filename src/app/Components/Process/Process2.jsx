import SectionTitle from "../Common/SectionTitle";
import ProcessCard2 from "./ProcessCard2";

const Process2 = () => {
    return (
            <div className="working-proces-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title text-center">
                                <SectionTitle
                                    SubTitle="OUR PROCESS"
                                    Title="HOW WE DELIVER RESULTS"
                                ></SectionTitle>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="working-process-box before-transprent after-transprent">
                                <ProcessCard2
                                    mainImage="/assets/images/home-3/process-1.png"
                                    Number="01"
                                    Title="UNDERSTAND"
                                    Content="We research your market, audience and competitors before touching strategy."
                                ></ProcessCard2>
                            </div>
                        </div>	
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="working-process-box after-transprent">
                                <ProcessCard2
                                    mainImage="/assets/images/home-3/process-2.png"
                                    Number="02"
                                    Title="ALIGN"
                                    Content="We align your marketing to your business goals so every effort has purpose."
                                ></ProcessCard2>
                            </div>
                        </div>	
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="working-process-box before-transprent">
                                <ProcessCard2
                                    mainImage="/assets/images/home-3/process-3.png"
                                    Number="03"
                                    Title="EXECUTE"
                                    Content="We build and deploy systems that attract, nurture and convert your audience."
                                ></ProcessCard2>
                            </div>
                        </div>			
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="working-process-bottom">
                                <p>We deliver growth the right way — <span>strategy first.</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Process2;