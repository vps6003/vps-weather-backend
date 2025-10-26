import express from "express";
import { fetchWeather, getAllWeather } from "../controller/weather-controller.js"; // ✅ corrected path + .js
import {getLocationFromIP} from "../controller/fetch-location.js";

const router = express.Router();

router.get("/getWeather", fetchWeather);       // GET /api/weather?latitude=..&longitude=..
router.get("/all", getAllWeather);   // GET /api/weather/all
router.get("/fetchLocation",getLocationFromIP);

export default router; // ✅ use export default (ESM style)
