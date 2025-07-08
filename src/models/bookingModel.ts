import mongoose, { Schema, models } from "mongoose";

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
});

const Booking = models.Booking || mongoose.model("Booking", BookingSchema);

export default Booking;
