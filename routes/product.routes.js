// const { application } = require('express');
const productController = require('../controllers/product.controller');
const {requestValidator, authJwt} = require('../middlewares');
module.exports = function (app)
{
    // Route for POST request to create the product
    app.post("/ecomm/api/v1/products", [requestValidator.validateProductRequest, authJwt.verifyToken, authJwt.isAdmin], productController.create)

    // Route for PUT request to update the category

    app.put("/ecomm/api/v1/products/:id", [requestValidator.validateProductRequest, authJwt.verifyToken, authJwt.isAdmin], productController.update)

    // Route for DELETE request to delete the category

    app.delete("/ecomm/api/v1/products/:id", [authJwt.verifyToken, authJwt.isAdmin], productController.delete)

    // Route for GET request to get the category based on the id
    app.get("/ecomm/api/v1/products/:id", productController.findOne)

    // route for GET request to get all the catgories
    app.get("/ecomm/api/v1/products", productController.findAll)

    // Routes for GET request to get all the products of the given catgory id
    app.get("/ecomm/api/v1/categories/:categoryId/products",[requestValidator.validateCategoryInRequestParams], productController.getProductsUnderCategory)

}