const { message } = require("../library/message");
const { ColorModel } = require("../models/ColorModel");

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

    const colors = await ColorModel.find(dynamic_filter).sort({
      createdAt: -1,
    });

    res.send({
      flag: 1,
      colors,
    });

  } catch (error) {
    res.send(message.catch_error);
  }
};

const create = async (req, res) => {
  try {

    const { name, slug, hex_code } = req.body;

    const colorExist = await ColorModel.findOne({
      $or: [{ name: name || "" }, { slug }]
    });

    if (colorExist) {
      return res.send(message.general_error("Name and slug must be unique"));
    }

    const color = new ColorModel({
      name,
      slug,
      hex_code
    });

    await color.save();

    res.send(message.created_msg("Color created"));

  } catch (error) {
    res.send(message.catch_error);
  }
};

const deleteData = async (req, res) => {
  try {

    const id = req.params.id;

    const color = await ColorModel.findById(id);

    if (!color) {
      return res.send(message.general_error("Color not found"));
    }

    await ColorModel.findByIdAndDelete(id);

    res.send(message.delete_msg("Color"));

  } catch (error) {
    console.log(error.message);
    res.send(message.catch_error);
  }
};

const toggleData = async (req, res) => {
  try {

    const { flag, id } = req.params;

    const color = await ColorModel.findById(id);

    if (color) {

      if (flag == 1) {
        color.status = !color.status;
      }

      await color.save();

      res.send(message.general_success("Toggle successfully"));

    } else {

      res.send(message.general_error("Color not found"));

    }

  } catch (error) {
    res.send(message.catch_error);
  }
};

const updateData = async (req, res) => {
  try {

    const { id } = req.params;
    const { name, slug, hex_code } = req.body;

    const color = await ColorModel.findById(id);

    if (!color) {
      return res.send(message.general_error("Color not found"));
    }

    color.name = name;
    color.slug = slug;
    color.hex_code = hex_code;

    await color.save();

    return res.send(message.general_success("Color updated"));

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