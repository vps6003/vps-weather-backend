import Weather from "../models/Weather.js";
import axios from "axios";
import geoip from "geoip-lite";

const fetchWeather = async (req, res) => {
  try {
    let { latitude, longitude } = req.body;
    if(!latitude || !!longitude){

      let ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      req.co;
      req.ip || "0.0.0.0";
      
      ip = process.env.LOCAL_IP || ip;
      
      console.log(ip);
      ip = ip.split(":")[0];
      
      // Remove IPv6 prefix if present (e.g. "::ffff:")
      ip = ip.replace(/^.*:/, "");
      
      console.log("Resolved IP:", ip);
      
      const geo = geoip.lookup(ip) || {};
      
      latitude = latitude || geo.ll[0];
      longitude = longitude || geo.ll[1];
      console.log("latitude &  longitude : ", latitude, "  & ", longitude);
    }
      
    const response = await axios.get(process.env.WEATHER_API_URL, {
      params: {
        latitude,
        longitude,
        daily: "temperature_2m_max,temperature_2m_min,weathercode",
        timezone: "auto",
      },
    });

    // console.log(response.data);
    // Save to MongoDB
    const weather = new Weather({
      latitude,
      longitude,
      temperature: response.data.daily.temperature_2m_max[0],
      wind_speed: 0, // Replace with actual if API provides
      weather_code: response.data.daily.weathercode[0],
    });

    await weather.save({ ip });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Server Error = " + err.message });
  }
};

const getAllWeather = async (req, res) => {
  try {
    const weatherData = await Weather.find().sort({ createdAt: -1 });
    weatherData.map((x) => x.toObject());
    res.json(weatherData);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export { fetchWeather, getAllWeather };
