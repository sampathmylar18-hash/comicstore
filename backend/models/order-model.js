const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    userId : { type : mongoose.Schema.Types.ObjectId , ref :'user' , required : true},
    items : [
    {
       bookId : { type : mongoose.Schema.Types.ObjectId  , ref : 'Book' , required : true},
       title : { type : String , required : true},
       price : { type : Number , required : true},
       quantity : { type : Number , required : true}, 
       image : { type : String , required : true}
    }
],
totalAmount : { type : Number , required : true},
status : { type : String , default : 'pending'},
paymentId : {type : String}
}, { timestamps : true });

module.exports = mongoose.model('order',orderSchema)