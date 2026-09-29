const Product = require("../models/Product");

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock
        } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            stock
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET SINGLE PRODUCT
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const {
            name,
            description,
            price,
            stock
        } = req.body;

        if (name !== undefined) {
            product.name = name;
        }

        if (description !== undefined) {
            product.description = description;
        }

        if (price !== undefined) {
            product.price = price;
        }

        if (stock !== undefined) {
            product.stock = stock;
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};