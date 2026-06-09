const { message } = require("../library/message");
const ProductModel = require("../models/ProductModel");
const { generateRandomNames } = require("../library/helpers");
const fs = require("fs");

// ================= GET =================
const getData = async (req, res) => {
  try {

    const query = req.query;
    const filter = {};

    if (query.id) filter["_id"] = query.id;
    if (query.slug) filter["slug"] = query.slug;

    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .populate("category_ids", "name")
      .populate("color_ids", "name")
      .populate("brand_id", "name");
console.log("PRODUCT COUNT =", products.length);
console.log("PRODUCTS =", products);
    res.send({
  flag: 1,
  products,
  image_path: "/images/products/"
});

  } catch (error) {
    console.log("ERROR =", error.message);
    res.send(message.catch_error);
    
  }
};

// ================= CREATE =================
const create = async (req, res) => {
  try {

    const data = req.body;

    // ✅ FILE SAFETY CHECK
    if (!req.files || !req.files.thumbnail) {
      return res.send(message.general_error("Thumbnail required"));
    }

    const thumbnail = req.files.thumbnail;
    const images = req.files?.other_images;

    // ✅ UNIQUE CHECK
    const exist = await ProductModel.findOne({
      $or: [
        { name: data.name },
        { slug: data.slug },
        { sku_id: data.sku_id }
      ]
    });

    if (exist) {
      return res.send(message.general_error("Name / Slug / SKU already exists"));
    }

    // ✅ THUMBNAIL SAVE
    const thumbName = generateRandomNames(thumbnail.name);
    const thumbPath = "./public/images/products/main_images/" + thumbName;
    await thumbnail.mv(thumbPath);

    // ✅ OTHER IMAGES
    let imageArray = [];

    if (images) {
      if (Array.isArray(images)) {
        for (let img of images) {
          const name = generateRandomNames(img.name);
          await img.mv("./public/images/products/other_images/" + name);
          imageArray.push(name);
        }
      } else {
        const name = generateRandomNames(images.name);
        await images.mv("./public/images/products/other_images/" + name);
        imageArray.push(name);
      }
    }

    // ✅ SAFE PARSE
    const category_ids = data.category_ids ? JSON.parse(data.category_ids) : [];
    const color_ids = data.color_ids ? JSON.parse(data.color_ids) : [];

    const product = new ProductModel({
      name: data.name,
      slug: data.slug,
      description: data.description,
      sku_id: data.sku_id,

      thumbnail: thumbName,
      other_images: imageArray,

      original_price: data.original_price,
      discount_percentage: data.discount_percentage,
      final_price: data.final_price,

      category_ids: category_ids,
      color_ids: color_ids,
      brand_id: data.brand_id
    });

    await product.save();

    res.send(message.created_msg("Product created"));

  } catch (error) {
    console.log(error.message);
    res.send(message.catch_error);
  }
};

// ================= DELETE =================
const deleteProduct = async (req, res) => {
  try {

    const id = req.params.id;
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.send(message.general_error("Product not found"));
    }

    // ✅ SAFE DELETE FILES
    const thumbPath = `public/images/products/main_images/${product.thumbnail}`;
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);

    for (let img of product.other_images) {
      const path = `public/images/products/other_images/${img}`;
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }

    await ProductModel.findByIdAndDelete(id);

    res.send(message.delete_msg("Product"));

  } catch (error) {
    console.log(error.message);
    res.send(message.catch_error);
  }
};

// ================= TOGGLE =================
const toggleProduct = async (req, res) => {
  try {

    const { id, flag } = req.params;
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.send(message.general_error("Product not found"));
    }

    if (flag == 1) product.status = !product.status;
    if (flag == 2) product.is_featured = !product.is_featured;
    if (flag == 3) product.is_best_seller = !product.is_best_seller;
    if (flag == 4) product.is_hot = !product.is_hot;
    if (flag == 5) product.is_home = !product.is_home;

    await product.save();

    res.send(message.general_success("Updated"));

  } catch (error) {
    res.send(message.catch_error);
  }
};

// ================= UPDATE =================
const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;
    const data = req.body;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.send(message.general_error("Product not found"));
    }

    const thumbnail = req.files?.thumbnail;

    // ✅ UPDATE IMAGE
    if (thumbnail) {
      const name = generateRandomNames(thumbnail.name);
      await thumbnail.mv("./public/images/products/main_images/" + name);

      const oldPath = `public/images/products/main_images/${product.thumbnail}`;
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      product.thumbnail = name;
    }

    // ✅ SAFE PARSE
    const category_ids = data.category_ids ? JSON.parse(data.category_ids) : [];
    const color_ids = data.color_ids ? JSON.parse(data.color_ids) : [];

    product.name = data.name;
    product.slug = data.slug;
    product.description = data.description;
    product.sku_id = data.sku_id;

    product.original_price = data.original_price;
    product.discount_percentage = data.discount_percentage;
    product.final_price = data.final_price;

    product.category_ids = category_ids;
    product.color_ids = color_ids;
    product.brand_id = data.brand_id;

    await product.save();

    res.send(message.general_success("Product updated"));

  } catch (error) {
    console.log(error.message);
    res.send(message.catch_error);
  }
};

module.exports = {
  getData,
  create,
  deleteProduct,
  toggleProduct,
  updateProduct
};