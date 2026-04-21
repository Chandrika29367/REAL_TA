// models/Inquiry.js
import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    propertyId: { type: String, required: true }, // stored as string (works for both ObjectId and original "P89075154" IDs)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, default: "pending", enum: ["pending", "contacted", "resolved"] },
  },
  { timestamps: true }
);

InquirySchema.index({ propertyId: 1, userId: 1 });

export default mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
