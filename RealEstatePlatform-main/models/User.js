// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "buyer", enum: ["buyer", "agent", "admin"] },
    phone: { type: String },
    agentName: { type: String },
    agentBio: { type: String },
    agentPhoto: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
