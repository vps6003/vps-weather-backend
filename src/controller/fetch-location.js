import axios from "axios";

const getLocationFromIP = async (req,res) => {
    try{
        let {ip} = req.body;
        // clean IP (remove port or IPv6 prefix) if needed
        ip = ip.replace(/^.*:/, "");  // handle IPv6 like "::ffff:1.2.3.4"
        
        const resp = await axios.get(`https://ipapi.co/${ip}/json/`);
        const { latitude, longitude } = resp.data;
        res.status(200).json(latitude,longitude);
    }
    catch(err){
        res.status(500).json("Unable to Fetch Location "+err.message);
    }
};

export {getLocationFromIP};


