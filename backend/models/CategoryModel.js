const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    image_name: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    is_top: {
      type: Boolean,
      default: false,
    },

    is_home: {
      type: Boolean,
      default: true,
    },

    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = { CategoryModel };