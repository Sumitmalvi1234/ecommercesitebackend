const { body, param } = require("express-validator");

const productValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Product description is required"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer")
];

const productUpdateValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be empty"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product description cannot be empty"),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer")
];

const productIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid product ID")
];

module.exports = {
    productValidator,
    productUpdateValidator,
    productIdValidator
};