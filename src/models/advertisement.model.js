import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    advertisementId: {
      type: String,
      unique: true,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    redirectUrl: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

export default Advertisement;
