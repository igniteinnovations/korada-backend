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
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
