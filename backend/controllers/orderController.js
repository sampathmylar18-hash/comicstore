const order = require('../models/order-model')
const Book = require('../models/book-model')

const createOrder = async(req,res)=>{
    try{
        const { items } = req.body;

        for(const item of items){
            const book = await Book.findById(item.bookId);

            if(!book){
                return res.status(404).json({message : `book not found  : ${ item.title}`})
            }
            if(book.stock < item.quantity){
                return res.status(400).json({
                    message : `not enough stock for "${book.title}". only ${book.stock} left`
                })
            }
        }

        for(const item of items){
            await Book.findByIdAndUpdate(item.bookId,{
                $inc : {stock : -item.quantity}
            })
        }
    const newOrder = await order.create({...req.body,userId : req.user.id});
    res.status(200).json(newOrder)
    }catch(e){
        res.status(400).json({
            message : e.message
        })
    }
}
const getAllOrders = async (req ,res)=>{
    try{
        const orders = await order.find();
        res.json(orders);
    }catch(e){
        res.status(500).json({
            message : e.message
        })
    }
}

const getMyOrders = async (req,res)=>{
    try{
        const myOrders = await order.find({userId : req.user.id})
        res.json(myOrders)
    }catch(e){
        res.status(500).json({
            message : e.message
        })
    }
}
module.exports = {createOrder,getAllOrders,getMyOrders};