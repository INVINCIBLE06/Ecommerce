/**
 * This file will have all the controller logic for product
 * all the crud request coming for product would be executing some method of this file.
 */

/**
 * This would have all the controller logic for category
 * whenever user will mae a CRUD request, Some method defined in this controller for
 * that request will be cancelled
 */

// const { response } = require('express');
// const { category } = require('../models');
// const { response } = require('express');
// const { product } = require('../models');

const db = require('../models');
const Product = db.product;
// console.log(db);

/**
* create and save a new Product
*/

exports.create = (req, res) =>
 {
     /**
      * validate the request
      */
     // if(!req.body.name || !req.body.price)
     // {
         // console.log(req.body);
         // Status code 400 is used for user's mistake
         // res.status(400).send
         // ({
         //    message : "Name of the Product and price cannot be empty"
         //  })
         //  return;
     //  }

    // Creating the product object to be stored in the DB
 
     const product = 
        {
            name : req.body.name,
            description : req.body.description,
            price : req.body.price,
            categoryId : req.body.categoryId
        }
     // Storing the product object in the db
     // Promise.then(resolved).catch(err)
     // console.log(Product);
     // console.log("*****we are here in product controller for create****",Product)
     Product.create(product).then(response =>
         {
             // Status code 201 defines that the data is stored 
             console.log(`product name: [${response} got inserted into the db ]`);
             res.status(201).send(response);
         }).catch(err => 
             {
                 // Status code 500 define that there are some internal error
                 console.log(`Product: [${err} not inserted into the db]`);
                 res.status(500).send
                    ({
                         message : "Some internal error occurred while storing into the product data"
                    })
             })
 }
 
 /**
  * If user want to update existing product 
  */
 
 exports.update = (req, res) =>
 {
     /**
      * Creating the Product object to be update in the DB
      */
     const product =
     {
         name : req.body.name,
         description : req.body.description,
         price : req.body.price,
         // categoryId : req.body.categoryId
     }
     const productId = req.params.id;
     Product.update(product,
         {
             where:
                {
                     id: productId
                }
         }).then(response =>
             {
                 // console.log( product, productId);
                 res.status(200).send(response);
             }).catch(err =>
                 {
                     res.status(500).send
                     ({
                         message : "Some internal error occured while updating the product data !"
                     })
                 }); 
 };
 // If user want to delete 
 exports.delete = (req, res) =>
 {
   const productId = req.params.id;
   Product.destroy
    ({
        where :
            {
                id: productId
            },
            returning: true
    }).then(response =>
        {
            res.status(200).send(response);
        }).catch(err =>
         {
             res.status(500).send
                ({
                    message : "Some internal error occurred while deleting the product"
                })
         });     
 }
 
 /**
  * Get a product information based upon the category id
  */
 exports.findOne = (req,res) =>
 {
     const productId = req.params.id;
     Product.findByPk(productId).then(response =>
         {
             res.status(200).send(response);
         }).catch(err =>
             {
                 res.status(500).send
                    ({
                        message : "Some internal error occured while fetching product based upon product id"
                    })
             })
 }
 
 exports.findAll = (req, res) =>
 {
     // when query is written it will not give any error even though not gettng any match.
     let productName = req.query.name;
     let promise;
     if(productName)
     {
         promise = Product.findAll
         ({
             where :
                    {
                        name : productName
                    }
         })
     }
     else
        {
            promise = Product.findAll();
        }
     promise.then(response =>
         {
             res.status(200).send(response);
         }).catch(err =>
             {
                 res.status(500).send
                 ({
                     message : "Some internal error occured while fetching all the products"
                 })
             })
} 

exports.getProductsUnderCategory = (req, res) =>
{
    const categoryId = req.params.categoryId;
    Product.findAll
    ({
        where :
        {
           categoryId: categoryId 
        }
    }).then(response =>
        {
           res.status(200).send(response);  
        }).catch(err =>
            {
                res.status(500).send
                ({
                    message: " Some internal error occured while fetching all the products based on the category id"
                })

            })
}