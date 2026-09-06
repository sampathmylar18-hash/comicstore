const Book = require('../models/book-model')

const getAllBooks = async(req,res)=>{
    try{
        const books = await Book.find({}); 
        res.json(books)
   }catch(e){
        res.status(500).json({
            success : false,
            message : `error ocurred while getting all books${e.message}`
        });
   }
};

const getBookById = async(req,res)=>{
    try{
        const singlebook = await Book.findById(req.params.id);
        if(!singlebook){ return res.status(404).json({
            success : false,
            message : "book id not found"
        })}
        res.json({
            success : true ,
            data : singlebook
        })
    }catch(e){
        res.status(500).json({
            success : false,
            message : `some error occured ${e.message}`
        })
    }
}

const createBook = async(req,res)=>{
    try{
         const newBook = await Book.create(req.body);
         res.status(200).json(newBook)
    }catch(e){
        res.status(400).json({
            success : false,
            message : `some error occured ${e.message}`
        })
    }
}

const updateBook = async(req,res)=>{
    try{
        const updatedBook = await Book.findByIdAndUpdate(req.params.id,req.body)
        if(!updatedBook){
            return res.status(404).json({
                message : "error. book with id not found"
            })
        }
        return res.json({updatedBook})
    }catch(e){
        res.status(400).json({
            success : false,
            message : `some error occured ${e.message}`
        })
}
}

const deleteBook = async(req,res)=>{
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    try{
    if(!deletedBook){
        return res.status(404).json({
            message : "error. book with the id is not found"
        })
    }   return res.json({
        message : "book is deleted",
        data : deletedBook})

    }catch(e){
        res.status(500).json({message : e.message})
    }
}

module.exports = { getAllBooks , getBookById , createBook , updateBook , deleteBook}