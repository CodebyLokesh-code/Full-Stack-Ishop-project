const express = require("express")
const {getData , create, deleteData, toggleData, updateData} = require("../controllers/BrandController")
const fileUpload = require("express-fileupload");

const BrandRouter = express.Router()

BrandRouter.get("/",getData);
BrandRouter.post("/create",fileUpload({
    createParentPath:true,
}),create);
BrandRouter.delete("/delete/:id",deleteData)
BrandRouter.patch("/toggle/:id/:flag",toggleData)
BrandRouter.put("/edit/:id",fileUpload({
    createParentPath:true
}),updateData)


module.exports = {BrandRouter}