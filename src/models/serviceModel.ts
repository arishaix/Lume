import mongoose, { Schema, models } from "mongoose";

const ServiceSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
});

const Service = models.Service || mongoose.model("Service", ServiceSchema);

export default Service;
