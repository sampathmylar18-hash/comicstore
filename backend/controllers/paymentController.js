const razorpayInstance = require('../utils/razorpay');
const crypto = require('crypto');
const order = require('../models/order-model')
const Book = require('../models/book-model')

const createRazorpayOrder = async (req,res)=>{
    try{
        const { totalAmount } = req.body;

        if(!totalAmount || totalAmount <= 0){
            return res.status(400).json({ message : 'invalid aamount'});
        }

        const options = {
            amount : Math.round(totalAmount * 100),
            currency : 'INR',
            receipt : `receipt_${Date.now()}`
         };

         const  razorpayOrder = await razorpayInstance.orders.create(options);

         res.status(200).json(razorpayOrder)
    }catch(e){
        console.error(e);
        res.status(500).json({ message : 'failed to create Razorpay order'})
    }
}

//----------------------------------------

const verifyPayment = async(req,res)=>{
    try{
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            totalAmount    
        } = req.body;

         // Step 1: rebuild the signature ourselves, using the SAME data + our secret key
        const generatedSignature = crypto
            .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

            console.log('order_id:', razorpay_order_id);
            console.log('payment_id:', razorpay_payment_id);
            console.log('received signature:', razorpay_signature);
            console.log('generated signature:', generatedSignature);
         // Step 2: compare it to what Razorpay/the frontend sent us
         if(generatedSignature !== razorpay_signature){
            return res.status(400).json({message : 'payment verification failed'})
         }

         // Step 3: signature matches — payment is genuine. Now check + decrement stock
        for (const item of items) {
        const book = await Book.findById(item.bookId)
        
        if(!book){
            return res.status(404).json({ message : `book not found : ${item.title}`})
        }
        if(book.stock < item.quantity){
            return res.status(400).json({
                message : `not enough stock for "${book.title}".only ${book.stock} left`
            });
        }
    }

    for(const item of items){
        await Book.findByIdAndUpdate(item.bookId,{
            $inc: { stock : -item.quantity}
        })
    }
    // Step 4: create the actual order in our own database
    const newOrder = await order.create({
        items,
        totalAmount,
        userId : req.user.id,
        status : 'paid',
        paymentId : razorpay_payment_id
    });

    res.status(200).json(newOrder)
    }catch(e){
        console.error(e);
        res.status(500).json({message : 'payment verifcation error'});
    }
}
module.exports = { createRazorpayOrder , verifyPayment}