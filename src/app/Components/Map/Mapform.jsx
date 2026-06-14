const MapForm = () => {

    const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.277444357989!2d36.80237!3d-1.2676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c0a1f9de7%3A0x4c1e82e5c0e0e0e0!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1716707554611!5m2!1sen!2ske";

    return (
        <div className="google-map">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <iframe src={mapUrl} loading="lazy"></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapForm;