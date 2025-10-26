import mongoose from "mongoose";
import geoip from "geoip-lite";

const weatherSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    temperature: { type: Number, required: true },
    wind_speed: { type: Number, required: true },
    weather_code: { type: Number, required: true },

    createdByIp: { type: String },
    updatedByIp: { type: String },

    createdByLocation: {
      city: String,
      state: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },
    updatedByLocation: {
      city: String,
      state: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
  },
  { timestamps: true }
);

// Pre-save hook
weatherSchema.pre("save", function (next, options) {
  if (this.isNew && options?.ip) {
    this.createdByIp = options.ip;
    const geo = geoip.lookup(options.ip) || {};
    this.createdByLocation = {
      city: geo.city || "",
      state: geo.region || "",
      country: geo.country || "",
      latitude: geo.ll ? geo.ll[0] : null,
      longitude: geo.ll ? geo.ll[1] : null,
    };
  }
  next();
});

// Pre-update hook
weatherSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  const options = this.getOptions();

  if (options.ip) {
    update.updatedByIp = options.ip;
    const geo = geoip.lookup(options.ip) || {};
    update.updatedByLocation = {
      city: geo.city || "",
      state: geo.region || "",
      country: geo.country || "",
      latitude: geo.ll ? geo.ll[0] : null,
      longitude: geo.ll ? geo.ll[1] : null,
    };
  }

  this.setUpdate(update);
  next();
});

export default mongoose.model("Weather", weatherSchema);
