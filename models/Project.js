import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: 0,
    },
    amountReceived: {
      type: Number,
      default: 0,
    },
    amountSpent: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["planned", "ongoing", "completed", "cancelled"],
      default: "planned",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer",
      },
    ],
    beneficiaries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beneficiary",
      },
    ],
    donors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// virtual field — balance remaining
projectSchema.virtual("balance").get(function () {
  return this.amountReceived - this.amountSpent;
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
