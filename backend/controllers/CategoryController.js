const { message } = require("../library/message");
const { CategoryModel } = require("../models/CategoryModel");
const { generateRandomNames } = require("../library/helpers");
const fs = require("fs");

const getData = async (req, res) => {
  try {
    const url_query = req.query;
    const dynamic_filter = {};

    if (url_query.id) {
      dynamic_filter["_id"] = url_query.id;
    }

    if (url_query.slug) {
      dynamic_filter["slug"] = url_query.slug;
    }

    const categories = await CategoryModel.find(dynamic_filter).sort({
      createdAt: -1,
    });

    res.send({
      flag: 1,
      categories,
      image_path: "/images/category/",
    });
  } catch (error) {
    console.log(error);
    res.send(message.catch_error);
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const image = req.files?.image;

    if (!image) {
      return res.send(message.general_error("Image required"));
    }

    const categoryExist = await CategoryModel.findOne({
      $or: [{ name: data.name || "" }, { slug: data.slug }],
    });

    if (categoryExist) {
      return res.send(
        message.general_error("Name and slug must be unique")
      );
    }

    const imageName = generateRandomNames(image.name);
    const destination = "./public/images/category/" + imageName;

    await image.mv(destination);

    const category = new CategoryModel({
      name: data.name,
      slug: data.slug,
      image_name: imageName,
    });

    await category.save();

    res.send(message.created_msg("Category created"));
  } catch (error) {
    console.log(error);
    res.send(message.catch_error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.send(
        message.general_error("Category not found")
      );
    }

    const imagePath = `public/images/category/${category.image_name}`;

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await CategoryModel.findByIdAndDelete(id);

    res.send(message.delete_msg("Category"));
  } catch (error) {
    console.log(error.message);
    res.send(message.catch_error);
  }
};

const toggleCategory = async (req, res) => {
  try {
    const { flag, id } = req.params;

    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.send(
        message.general_error("Category not found")
      );
    }

    if (flag == 1) {
      category.status = !category.status;
    }

    if (flag == 2) {
      category.is_home = !category.is_home;
    }

    if (flag == 3) {
      category.is_featured = !category.is_featured;
    }

    if (flag == 4) {
      category.is_top = !category.is_top;
    }

    await category.save();

    res.send(
      message.general_success("Toggle successfully")
    );
  } catch (error) {
    console.log(error);
    res.send(message.catch_error);
  }
};

const categoryUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.files?.image;
    const { name, slug } = req.body;

    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.send(
        message.general_error("Category not found")
      );
    }

    const duplicateCategory = await CategoryModel.findOne({
      _id: { $ne: id },
      $or: [{ name }, { slug }],
    });

    if (duplicateCategory) {
      return res.send(
        message.general_error("Name and slug must be unique")
      );
    }

    if (image) {
      const imageName = generateRandomNames(image.name);
      const destination =
        "./public/images/category/" + imageName;

      await image.mv(destination);

      const imagePath = `public/images/category/${category.image_name}`;

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      category.image_name = imageName;
    }

    category.name = name;
    category.slug = slug;

    await category.save();

    return res.send(
      message.general_success("Category updated")
    );
  } catch (error) {
    console.log(error.message);
    res.send(message.catch_error);
  }
};

module.exports = {
  getData,
  create,
  deleteCategory,
  toggleCategory,
  categoryUpdate,
};