// models/SavedProperty.js
import mongoose from "mongoose";

const SavedPropertySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: String, required: true },
  },
  { timestamps: true }
);

SavedPropertySchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export default mongoose.models.SavedProperty || mongoose.model("SavedProperty", SavedPropertySchema);
