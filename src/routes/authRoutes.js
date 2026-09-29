const express = require("express");

const {
    register,
    login,
    getMe,
    refreshToken,
    logout
} = require("../controllers/authController");

const {
    registerValidator,
    loginValidator
} = require("../validators/authValidators");

const validate = require("../middleware/validationMiddleware");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();


// REGISTER
router.post(
    "/register",
    registerValidator,
    validate,
    register
);


// LOGIN
router.post(
    "/login",
    loginValidator,
    validate,
    login
);
// CURRENT USER
router.get(
    "/me",
    authenticate,
    getMe
);
router.post(
    "/refresh-token",
    refreshToken
);
router.post(
    "/logout",
    authenticate,
    logout
);


module.exports = router;