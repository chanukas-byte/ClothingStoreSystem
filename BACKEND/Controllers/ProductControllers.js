const Product = require("../Models/ProductModel"); 

//Product Insert
const addProduct = async (req, res, next) => {

    const {name, description, price, category, stockQuantity, imageUrl, createdAt, updatedAt} = req.body;

    let products;

    try {
        products = new Product({name, description, price, category, stockQuantity, imageUrl, createdAt, updatedAt});
        await products.save();
    }catch (err) {
        console.log(err);
    }

    //data not inserted 
    if (!products) {
        return res.status(404).json ({message:"unable to add Product"});
    }
    return res.status(200).json ({products})

}

//Get By ID
const getById = async (req, res, next) => {

    const id = req.params.id;

    let products;

    try {
        products  = await Product.findById(id);
    }catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!products || products.length === 0) {
        return res.status(404).json({ message: "Product not found" }); 
    }

    return res.status(200).json({ products });
}

//Add New Stock
const updateProduct = async (req, res, next) => {

    const id = req.params.id;
    const {stockQuantity, updatedAt} = req.body;

    let products;

    try {
        products = await Product.findByIdAndUpdate(id, 
            { stockQuantity:stockQuantity, updatedAt:updatedAt});
            products = await products.save();

    }catch(err) {
        console.log(err);
    }

    if (!products || products.length === 0) {
        return res.status(404).json({ message: "Product not found" }); 
    }

    return res.status(200).json({ products });

}

//Delete Product
const deleteProduct = async (req, res, next) => {
    const id = req.params.id;

    let product;

    try {
        product = await Product.findOneAndDelete(id)
    } catch (err) {
        console.log(err);
    }

    if (!product || product.length === 0) {
        return res.status(404).json({ message: "Unable to Delete Product" }); 
    }

    return res.status(200).json({ product });

}

// Display Product with Filters
const getAllProduct = async (req, res, next) => {
    const { name, category, minPrice, maxPrice } = req.query;

    let filter = {};

    if (name) {
        filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search for name
    }
    if (category) {
        filter.category = category;
    }
    if (minPrice) {
        filter.price = { $gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
        filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    }

    let products;
    try {
        products = await Product.find(filter);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found matching filters" });
    }

    return res.status(200).json({ products });
};



exports.addProduct = addProduct;
exports.getAllProduct =getAllProduct;
exports.getById = getById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;

