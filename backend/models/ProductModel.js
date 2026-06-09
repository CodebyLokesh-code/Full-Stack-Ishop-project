const mongoose = require("mongoose");
// const { ColorModel } = require("./ColorModel");

const ProductSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            maxLength:150,
            unique:true
        },
        slug:{
            type:String,
            required:true,
            trim:true,
            unique:true
        },
        description:{
            type:String,
        },
        thumbnail:{
            type:String,
            required:true,
        },
        original_price:{
 type:Number,
 required:true
},

discount_percentage:{
 type:Number,
 default:0
},

final_price:{
 type:Number,
 required:true
},
        status:{
            type:Boolean,
            default:true
        },
        stock:{
            type:Boolean,
            default:true
        },
        is_best_seller:{
           type:Boolean,
            default:false
        },
        is_featured:{
           type:Boolean,
            default:false
        },
        is_hot:{
           type:Boolean,
            default:false
        },
        is_home:{
           type:Boolean,
            default:false
        },
        other_images:[
            {
                type:String
            }
        ],
        category_ids:[
 {
  type:mongoose.Schema.Types.ObjectId,
  ref:"Category",
  required:true
 }
],
        sku_id:{
 type:String,
 required:true,
 unique:true
},

color_ids:[
 {
  type:mongoose.Schema.Types.ObjectId,
  ref:"color"
 }
],

brand_id:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"Brand",
 required:true
}
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("Product",ProductSchema)
