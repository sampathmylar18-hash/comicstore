const express = require('express')
const router = express.Router();
const { getAllBooks,getBookById,createBook,updateBook,deleteBook } = require('../controllers/bookController.js')
const { protect , isAdmin} = require('../middlewares/authMiddle.js')

router.get('/',getAllBooks)
router.get('/:id',getBookById)
router.post('/' , protect , isAdmin , createBook)
router.put('/:id' , protect , isAdmin , updateBook)
router.delete('/:id' , protect , isAdmin , deleteBook)

module.exports = router