const express = require("express");
const {
  getData,
  create,
  deleteProduct,
  toggleProduct,
  updateProduct,
} = require("../controllers/ProductController");

const fileUpload = require("express-fileupload");

const ProductRouter = express.Router();

// READ
ProductRouter.get("/", getData);

// CREATE
ProductRouter.post(
  "/create",
  fileUpload({
    createParentPath: true,
  }),
  create,
);

// DELETE
ProductRouter.delete("/delete/:id", deleteProduct);

// TOGGLE
ProductRouter.patch("/toggle/:id/:flag", toggleProduct);

// UPDATE
ProductRouter.put(
  "/edit/:id",
  fileUpload({
    createParentPath: true,
  }),
  updateProduct,
);

module.exports = { ProductRouter };
