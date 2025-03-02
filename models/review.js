const mongoose = require("mongoose");

let reviewSchema=new mongoose.Schema({
    comment:String,
    date:{
        type:Date,
        default:Date.now()
    },
    rating:{
        type:Number,
        min:1,
        max:5
    }
})
module.exports=mongoose.model("review",reviewSchema);