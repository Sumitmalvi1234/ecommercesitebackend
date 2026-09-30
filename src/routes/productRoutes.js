const express = require("express");

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const authenticate = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
    productValidator,
    productUpdateValidator,
    productIdValidator
} = require("../validators/productValidators");

const router = express.Router();


// CREATE
router.post(
    "/",
    authenticate,
    productValidator,
    validate,
    createProduct
);


// READ ALL -> FIXED: Added authenticate middleware
router.get(
    "/",
    authenticate,
    getProducts
);


// READ ONE -> FIXED: Added authenticate middleware
router.get(
    "/:id",
    authenticate,
    productIdValidator,
    validate,
    getProduct
);


// UPDATE
router.put(
    "/:id",
    authenticate,
    productIdValidator,
    productUpdateValidator,
    validate,
    updateProduct
);


// DELETE
router.delete(
    "/:id",
    authenticate,
    productIdValidator,
    validate,
    deleteProduct
);


module.exports = router;
