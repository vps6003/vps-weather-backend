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

//Pre-save Hook for create
weatherSchema.pre("save", (next, options) => {
  const doc = this;

  //options.ip must be passed from controller / handler
  if (doc.isNew) {
    if (options?.ip) {
      doc.createdByIp = options.ip;
      const geo = geoip.lookup(options.ip) || {};
      doc.createdByLocation = {
        city: geo.city || "",
        state: geo.region || "",
        country: geo.country || "",
        latitude: geo.ll ? geo.ll[0] : null,
        longitude: geo.ll ? geo.ll[1] : null,
      };
    }
  }
  next();
});

//Pre-save Hook for update
weatherSchema.pre("findOneAndUpdate", (next) => {
  const update = this.getUpdate();
  const options = this.getOptions();

  //options.ip must be passed from controller / handler
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

module.exports = mongoose.model("Weather", weatherSchema);