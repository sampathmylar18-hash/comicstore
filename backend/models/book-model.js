const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title : {type : String , required : true} ,
    author : {type : String , required :true},
    price : {type : Number , required : true},
    image : {type : String},
    stock : {type : Number, default : 0},
    category : {type : String},
    description : {type : String},
    featured : { type : Boolean , default : false}
}, {timestamps : true});

module.exports = mongoose.model('Book',bookSchema);