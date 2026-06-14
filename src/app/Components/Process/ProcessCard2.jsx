import Image from "next/image";

const ProcessCard2 = ({mainImage,Number,Title,Content}) => {
    return (
        <div>
            <div className="process-thumb">
                <Image src={mainImage} alt="img" width={216} height={216}   />
            <div className="process-number">
                <span>{Number}</span>
            </div>
            </div>
            <div className="process-content">
                <h4>{Title}</h4>
                <p>{Content}</p>
            </div>           
        </div>
    );
};

export default ProcessCard2;