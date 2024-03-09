const Product = require('../models/Product.js')

function headAndHeaderHTML (isDashboard) {
    const productsOrDashboard = isDashboard ? "dashboard" : "products";
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
    <a href="/${productsOrDashboard}">Products</a>
    <a href="/${productsOrDashboard}?filter=T-Shirts">T-Shirts</a>
    <a href="/${productsOrDashboard}?filter=Pants">Pants</a>
    <a href="/${productsOrDashboard}?filter=Shoes">Shoes</a>
    <a href="/${productsOrDashboard}?filter=Accessories">Accessories</a>
    ${isDashboard ? '<a href="/dashboard/new">New Product</a>' : ''}
    <a>${isDashboard ? "Logout" : "Login"}</a>
    </nav>
    </header>`
    return headHTML + headerHTML
}

function productsCards (products, isDashboard) {
    const productsOrDashboard = isDashboard ? "dashboard" : "products";
    let productsCardsHTML = `
    <main>
    <h1>PRODUCTS</h1>
    <section class="cardsProducts">
    ${products.map( product => `
        <div class="cardProduct">
            <p>${product.name}</p>
            <img src="${product.image}" alt="${product.name}" />
            <a href="/${productsOrDashboard}/${product._id}">
                <button>See</button>
            </a>
        </div>`).join("")}
    </section>
    </main>
    </body>`
    return productsCardsHTML
}

function singleProduct (product, isDashboard) {
    let singleProductHTML = `
    <section class="cardsProducts singleProduct">
        <div class="cardProduct">
            <p>${product.name}</p>
            <img src="${product.image}" alt="${product.name}"/>
            <p>${product.description}</p>
            <p>${product.price} $</p>
            <p>Category: ${product.category}</p>
            <p>Size: ${product.size}</p>
            ${isDashboard ? `<a href="/dashboard/${product._id}/edit"><button>Edit</button></a><a href="/dashboard/${product._id}/delete?_method=DELETE"><button>Delete</button></a>`:""}
        </div>
    <section class="cardsProducts">`
    return singleProductHTML
}

function formProduct (isEdit, product) {
    const formProductHTML = `
    <main>
    <h1>${isEdit ? "Edit" : "Create New"} Product</h1>
    <form action="/dashboard${isEdit ? `/${product._id}/?_method=PUT` : ""}" method="post">
    <label for="name">Name: </label>
            <input type="text" id="name" name="name" ${isEdit ? `value="${product.name}"` : ""}>
            <label for="description">Description: </label>
            <textarea id="description" name="description">${isEdit ? product.description : ""}</textarea>
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
            <label for="price" ${isEdit ? `value="${product.price}"` : ""}>Price: </label>
            <input type="number" id="price" name="price">
            <button type="submit">${isEdit ? "Apply Changes" : "Create"}</button>
            ${isEdit ? `<a href="/dashboard/${product._id}">Cancel</a>` : ''}
        </form>
        </main>
        </body>`
        return formProductHTML
}

const ProductController = {
    async getProducts (req, res) {
        try {
            const filter = req.query.filter
            const products = filter ? await Product.find({category: filter}) : await Product.find()
            const isDashboard = req.originalUrl.includes("dashboard") ? true : false
            if (req.originalUrl.includes("api")) {
                res.json(products)
            } else {
                res.send(headAndHeaderHTML(isDashboard) + productsCards(products, isDashboard))
            }
        } catch (error) {
            console.log(error)
        }
    },
    async getProductByID (req, res) {
        try {
            const _id = req.params.productId
            const product = await Product.findById(_id)
            const isDashboard = req.originalUrl.includes("dashboard") ? true : false
            if(!product) {
                return res.status(404).send({message: "Product not found"})
            }
            if (req.originalUrl.includes("api")) {
                res.json(product)
            } else {
                res.send(headAndHeaderHTML(isDashboard) + singleProduct(product, isDashboard))
            }
        } catch (error) {
            console.log(error)
        }
    },
    async getFormProduct (req, res) {
        try {
            const _id = req.params.productId
            const product = await Product.findById(_id)
            const isEdit = req.originalUrl.includes("edit") ? true : false
            res.send(headAndHeaderHTML(true) + formProduct(isEdit, product))
        } catch (error) {
            console.log(error)
        }
    },
    async createProduct (req, res) {
        try {
            const product = await Product.create({...req.body})
            if (req.originalUrl.includes("api")) {
                res.json({message:"Product successfully created", product: product})
            } else {
                res.redirect('/dashboard')
            }
        } catch (error) {
            console.log(error)
        }
    },
    async updateProduct (req, res) {
        try {
            const _id = req.params.productId
            const product = await Product.findByIdAndUpdate(_id, req.body, {new: true})
            if (req.originalUrl.includes("api")) {
                res.json({message: "Product updated successfully", product: product})
            } else {
                res.redirect('/dashboard')
            }            
        } catch (error) {
            console.log(error)
        }
    },
    async deleteProduct (req, res) {
        try {
            const _id = req.params.productId
            const deletedProduct = await Product.findByIdAndDelete(_id)
            if (req.originalUrl.includes("api")) {
                res.json({message: "Product deleted successfully", product: deletedProduct})
            } else {
                res.redirect('/dashboard')
            } 
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ProductController