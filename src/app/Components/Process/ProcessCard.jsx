import Image from "next/image";

const ProcessCard = ({Img,Title,Content}) => {
    return (
        <div>
            <div className="project-icon">
            <Image src={Img} alt="img" width={45} height={45}   />
        </div>
        <div className="projects-content">
            <h4 className="project-title"><a href="project-details.html">{Title}</a></h4>
            <p className="project-des">{Content}
            </p>
        </div>           
        </div>
    );
};

export default ProcessCard;