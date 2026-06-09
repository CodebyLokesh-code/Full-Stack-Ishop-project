const { message } = require("../library/message");
const { BrandModel } = require("../models/BrandModel");
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

    const brands = await BrandModel.find(dynamic_filter).sort({
      createdAt: -1,
    }).populate({
        path:"category_ids",
        select:"name"
    })

    res.send({
      flag: 1,
      brands,
      image_path: "/images/brand/",
    });

  } catch (error) {
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

    const brandExist = await BrandModel.findOne({
      $or: [{ name: data.name || "" }, { slug: data.slug }]
    });

    if (brandExist) {
      return res.send(message.general_error("Name and slug must be unique"));
    }

    const imageName = generateRandomNames(image.name);
    const destination = "./public/images/brand/" + imageName;

    await image.mv(destination);

    const brand = new BrandModel({
      name: data.name,
      slug: data.slug,
      category_ids: JSON.parse(data.category_ids),
      image_name: imageName,
    });

    await brand.save();

    res.send(message.created_msg("Brand created"));

  } catch (error) {
    res.send(message.catch_error);
  }
};

const deleteData = async (req, res) => {
  try {

    const id = req.params.id;

    const brand = await BrandModel.findById(id);

    if (!brand) {
      return res.send(message.general_error("Brand not found"));
    }

    fs.unlinkSync(`public/images/brand/${brand.image_name}`);

    await BrandModel.findByIdAndDelete(id);

    res.send(message.delete_msg("Brand"));

  } catch (error) {
    console.log(error.message);
    res.send(message.catch_error);
  }
};

const toggleData = async (req, res) => {
  try {

    const { flag, id } = req.params;

    const brand = await BrandModel.findById(id);

    if (brand) {

      if (flag == 1) {
        brand.status = !brand.status;
      }

      await brand.save();

      res.send(message.general_success("Toggle successfully"));

    } else {

      res.send(message.general_error("Brand not found"));

    }

  } catch (error) {
    res.send(message.catch_error);
  }
};

const updateData = async (req, res) => {
  try {

    const { id } = req.params;
    const image = req.files?.image;
    const { name, slug } = req.body;

    const brand = await BrandModel.findById(id);

    if (!brand) {
      return res.send(message.general_error("Brand not found"));
    }

    if (image) {

      const imageName = generateRandomNames(image.name);
      const destination = "./public/images/brand/" + imageName;

      await image.mv(destination);

      fs.unlinkSync(`public/images/brand/${brand.image_name}`);

      brand.image_name = imageName;
    }

    brand.name = name;
    brand.slug = slug;
    

    await brand.save();

    return res.send(message.general_success("Brand updated"));

  } catch (error) {
    console.log(error.message);
    res.send(message.catch_error);
  }
};

module.exports = {
  getData,
  create,
  deleteData,
  toggleData,
  updateData,
};