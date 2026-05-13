import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    donorType: {
      type: String,
      enum: ["individual", "organization"],
      default: "individual",
    },
    organizationName: {
      type: String,
      trim: true,
    },
    totalDonated: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Donor = mongoose.model("Donor", donorSchema);
export default Donor;
