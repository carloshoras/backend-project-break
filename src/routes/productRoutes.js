const express = require('express')
const router = express.Router()
const Product = require('../models/Product.js')
const ProductController = require('../controllers/productController.js')

router.get('/products', ProductController.getProducts)
router.get('/products/:productId', ProductController.getProductByID)
router.get('/dashboard', ProductController.getProducts)
router.get('/dashboard/new', ProductController.getFormProduct)
router.post('/dashboard', ProductController.createProduct)
router.get('/dashboard/:productId', ProductController.getProductByID)
router.get('/dashboard/:productId/edit', ProductController.getFormProduct)
router.put('/dashboard/:productId', ProductController.updateProduct)
router.delete('/dashboard/:productId/delete', ProductController.deleteProduct)

module.exports = router