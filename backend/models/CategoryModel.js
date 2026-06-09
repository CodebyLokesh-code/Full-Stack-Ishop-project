const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema(
    {
        name:{
            type:String,
            require:true,
            trim:true,
        },
        slug:{
            type:String,
            require:true,
            trim:true,
            unique:true,
        },
        image_name:{
            type:String,
            unique:true,

        },
        status:{
            type:Boolean,
            default:true,
        },
         is_top:{
            type:Boolean,
            default:false,
        },
         is_home:{
            type:Boolean,
            default:true,
        },
         is_featured:{
            type:Boolean,
            default:false,
        },
    },

    {
        timestamps:true
    }
)

const CategoryModel = mongoose.model("Category",CategorySchema);

module.exports={CategoryModel}