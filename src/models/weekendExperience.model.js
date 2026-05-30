import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    experienceId: {
      type: String,
      unique: true,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    distance: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    price: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    tags: [
      {
        type: String,
      },
    ],

    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    mediaUrl: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
