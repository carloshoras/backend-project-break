const express = require('express')
const router = express.Router()
const Product = require('../models/Product.js')

function singleProduct (product, isDashBoard) {
    let singleProductHTML = `
    <div class="singleCardProduct">
        <p>${product.name}</p>
        <p>${product.image}</p>
        <p>${product.description}</p>
        <p>${product.price} $</p>
        <p>Category: ${product.category}</p>
        <p>Size: ${product.size}</p>
    </div>`
    return singleProductHTML
}

function productsCards (products) {
    let productsCardsHTML = `
                <main>
                    <h1>PRODUCTS</h1>
                    <section class="cardsProducts">
                        ${products.map( product => `
                        <div class="cardProduct">
                            <p>${product.name}</p>
                            <p>${product.image}</p>
                            <a href="/products/${product._id}">
                                <button>See</button>
                            </a>
                        </div>`).join("")}
                    </section>
                </main>
            </body>`
    return productsCardsHTML
}

const headHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Carlos' Store</title>
            <link rel="stylesheet" href="/styles.css">
        </head>`

const headerHTML = `
        <body>
            <header>
                <nav>
                    <a href="/products">Products</a>
                    <a href="/products/?filter=T-Shirts">T-Shirts</a>
                    <a href="/products/?filter=Pants">Pants</a>
                    <a href="/products/?filter=Shoes">Shoes</a>
                    <a href="/products/?filter=Accessories">Accessories</a>
                    <a>Login</a>
                </nav>
            </header>`

router.get('/products', async (req, res) => {
    try {
        const filter = req.query.filter
        const products = filter ? await Product.find({category: filter}) : await Product.find()
        console.log(req.originalUrl)
        res.send(headHTML + headerHTML + productsCards(products))
    } catch (error) {
        console.log(error)
    }
})

router.get('/products/:productId', async (req, res) => {
    try {
        const _id = req.params.productId
        const product = await Product.findById(_id)
        if(!product) {
            return res.status(404).send({message: "Product not found"})
        }
        res.send(headHTML + headerHTML + singleProduct(product))
    } catch (error) {
        console.log(error)
    }
})

router.get('/dashboard', async (req, res) => {
    try {
        const products = await Product.find()
        let dashboardHTML = ""
        for (let product of products) {
            dashboardHTML += `
            <div>
            <p>${product.name}</p>
            <p>${product.image}</p>
            <a href="/dashboard/${product._id}">
                <button>Ver</button>
            </a>
            </div>`
        }
        res.send(dashboardHTML)
    } catch (error) {
        console.log(error)
    }
})

router.get('/dashboard/new', async (req, res) => {
    try {
        const formNewProduct = `
        <h1>Create New Product</h1>
            <form action="/dashboard" method="post">
                <label for="name">Name: </label>
                <input type="text" id="name" name="name">
                <label for="description">Description: </label>
                <input type="text" id="description" name="description">
                <label for="image">Image: </label>
                <input type="text" id="image" name="image">
                <label for="category">Category: </label>
                <select id="category" name="category">
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Pants">Pants</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                </select>
                <label for="size">Size: </label>
                <select id="size" name="size">
                    <option value="XL">XL</option>
                    <option value="L">L</option>
                    <option value="M">M</option>
                    <option value="S">S</option>
                    <option value="XS">XS</option>
                </select>
                <label for="price">Price: </label>
                <input type="number" id="price" name="price">
                <button type="submit">Crear Producto</button>
            </form>`
        res.send(formNewProduct)
    } catch (error) {
        console.log(error)
    }
})

router.post('/dashboard', async (req, res) => {
    try {
        const product = await Product.create({...req.body, image: `${req.body._id}.jpg`})
        res.send({message:"Product successfully created", product: product})
    } catch (error) {
        console.log(error)
    }
})

router.get('/dashboard/:productId', async (req, res) => {
    try {
        const _id = req.params.productId
        const product = await Product.findById(_id)
        const productDashboardHTML = `
        <div>
        <p>${product.name}</p>
        <p>${product.image}</p>
        <p>${product.size}</p>
        <a href="/dashboard/${product._id}/edit"><button>Edit</button></a>
        <a href="/dashboard/${_id}/delete?_method=DELETE"><button>Borrar</button></a>
        </div>`
        res.send(productDashboardHTML)
    } catch (error) {
        console.log(error)
    }
})

//refactorizar string html
router.get('/dashboard/:productId/edit', (req, res) => {
    const _id = req.params.productId
    const formulary = `
                <h1>Edit Product</h1>
                    <form action="/dashboard/${_id}/?_method=PUT" method="post">
                        <label for="name">Name: </label>
                        <input type="text" id="name" name="name">
                        <label for="description">Description: </label>
                        <input type="text" id="description" name="description">
                        <label for="image">Image: </label>
                        <input type="text" id="image" name="image">
                        <label for="category">Category: </label>
                        <input type="text" id="category" name="category">
                        <label for="size">Size: </label>
                        <input type="text" id="size" name="size">
                        <label for="price">Price: </label>
                        <input type="number" id="price" name="price">
                        <button type="submit">Guardar cambios</button>
                    </form>`
    res.send(formulary)
})

router.put('/dashboard/:productId', async (req, res) => {
    try {
        console.log(req.query._method)
        const _id = req.params.productId
        const product = await Product.findByIdAndUpdate(_id, req.body, {new: true})
        res.send({message: "Product updated successfully", product: product})
    } catch (error) {
        console.log(error)
    }
})

router.delete('/dashboard/:productId/delete', async(req, res) => {
    try {
        const _id = req.params.productId
        const deletedProduct = await Product.findByIdAndDelete(_id)
        res.send({message: "Product deleted successfully", product: deletedProduct})
    } catch (error) {
        console.log(error)
    }
})

module.exports = router