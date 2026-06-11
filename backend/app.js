const express = require("express");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

require("./models/CategoryModel");
require("./models/BrandModel");
require("./models/ColorModel");

const { CategoryRouter } = require("./routers/CategoryRouter");
const { BrandRouter } = require("./routers/BrandRouter");
const { ColorRouter } = require("./routers/ColorRouter");
const { ProductRouter } = require("./routers/ProductRouter");

const app = express();


process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION");
  console.error(err);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION");
  console.error(reason);
});



app.use(helmet());

app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(fileUpload());

app.use(express.static("public"));


app.use("/api/category", CategoryRouter);

app.use("/api/brand", BrandRouter);

app.use("/api/color", ColorRouter);

app.use("/api/product", ProductRouter);


app.use((req, res) => {
  res.status(404).send({
    flag: 0,
    message: "Route not found",
  });
});


app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(500).send({
    flag: 0,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : undefined,
  });
});


mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("DB Connected");

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect DB");
    console.error(err);
  });