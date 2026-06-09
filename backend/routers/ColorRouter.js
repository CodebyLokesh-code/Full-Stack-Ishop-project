const express = require("express")
const { getData, create, deleteData, toggleData, updateData } = require("../controllers/ColorController")

const ColorRouter = express.Router()

ColorRouter.get("/", getData)

ColorRouter.post("/create", create)

ColorRouter.delete("/delete/:id", deleteData)

ColorRouter.patch("/toggle/:id/:flag", toggleData)

ColorRouter.put("/edit/:id", updateData)

module.exports = { ColorRouter }