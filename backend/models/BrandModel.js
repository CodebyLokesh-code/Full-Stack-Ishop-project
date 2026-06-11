const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    image_name: {
      type: String,
      required: true,
      unique: true,
    },

    category_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const BrandModel = mongoose.model("Brand", BrandSchema);

module.exports = { BrandModel };