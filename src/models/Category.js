import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      unique: true,
      required: true,
    },

    categoryname: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
    },

    language: {
      type: String,
      enum: ["english", "telugu"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
categorySchema.index({ slug: 1, language: 1 }, { unique: true });
const Category = mongoose.model("Category", categorySchema);

export default Category;
