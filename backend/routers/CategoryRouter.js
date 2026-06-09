const express = require("express");
const { getData,create,deleteCategory ,toggleCategory,categoryUpdate} = require("../controllers/CategoryController");
const fileUpload = require("express-fileupload");

const CategoryRouter = express.Router();

//Read Opration on category
CategoryRouter.get("/", getData);
CategoryRouter.post("/create",fileUpload({
    createParentPath:true,
}),create);
CategoryRouter.delete("/delete/:id",deleteCategory)
CategoryRouter.patch("/toggle/:id/:flag", toggleCategory);
CategoryRouter.put("/edit/:id",fileUpload({
    createParentPath:true
}), categoryUpdate)


module.exports = { CategoryRouter }; //Named export.     yha se app k upar import kenra h
