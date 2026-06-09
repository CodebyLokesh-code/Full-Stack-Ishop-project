const express = require("express");
const dotenv = require("dotenv");
dotenv.config(".env");

const mongoose = require("mongoose");
const cors = require("cors");

require("./models/CategoryModel");
require("./models/BrandModel");
require("./models/ColorModel");


const { CategoryRouter } = require("./routers/CategoryRouter");
const { BrandRouter } = require("./routers/BrandRouter");
const { ColorRouter } = require("./routers/ColorRouter");
const { ProductRouter } = require("./routers/ProductRouter");

const app = express();


app.use(express.static("public"));
app.use(cors({ origin: "*" }));
app.use(express.json());


app.use("/api/category", CategoryRouter);
app.use("/api/brand", BrandRouter);
app.use("/api/color", ColorRouter);
app.use("/api/product", ProductRouter);
// ✅ DB CONNECT
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("DB Connected");

    app.listen(8000, () => {
      console.log("Server started on port 8000");
    });
  })
  .catch(() => {
    console.log("Unable to connect DB");
  });