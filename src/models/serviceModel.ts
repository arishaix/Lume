import mongoose, { Schema, models } from "mongoose";

const ServiceSchema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  image: { type: String, required: false },
  basicPrice: { type: Number, required: true },
  standardPrice: { type: Number, required: true },
  premiumPrice: { type: Number, required: true },
});

const Service = models.Service || mongoose.model("Service", ServiceSchema);

export default Service;
