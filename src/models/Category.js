import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      unique: true,
      required: true,
    },

    categoryname: {
      english: {
        type: String,
        required: true,
        trim: true,
      },

      telugu: {
        type: String,
        required: true,
        trim: true,
      },
    },

    slug: {
      english: {
        type: String,
        required: true,
        lowercase: true,
      },

      telugu: {
        type: String,
        required: true,
        lowercase: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
