const mongoose = require("mongoose")

const ColorSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            require:true,
            unique:true,
        },
        slug:{
            type:String,
            require:true,
            unique:true,
        },
        hex_code:{
            type:String,
            require:true,
        },
        
        status:{
            type:Boolean,
            default:true,
        },
    },
     {
            timestamps:true
        }
);


const ColorModel = mongoose.model("color", ColorSchema)

module.exports = {ColorModel}