// const { response } = require("express");
// const { response } = require("express");
const { category } = require("../models");
const validateCategoryRequest = (req, res, next) =>
{
    /**
     * validate the request for name
     */
    if(!req.body.name)
    {
      res.status(400).send
            ({
                message: "Name of the category cannot be empty"
            }) 
    return; 
    }
    next();
}

// Validating product request

const validateProductRequest = (req, res, next) =>
{
      /**
      * Valdate the request body
      */
        if(!req.body.name || !req.body.price)
        {
            res.status(400).send
            ({
                message: "Name or price of the product can't be empty"
            })
            return;
        }
        else
        {
            if(req.body.categoryId)  //--> if category id is provided
                {
                    // Validate if that is a valid category id
                    category.findByPk(req.body.categoryId).then(response =>
                    {
                        if(!response)
                        {
                          // console.log("*****we are here in request validator for product for create****",req.body);
                          res.status(400).send
                          ({
                              message: `CategoryId passed is not valid : ${req.body.categoryId}`
                          })
                          return;
                        }
                        else 
                        {
                              if(!req.body.price || req.body.price <= 0)
                              {
                                    res.status(400).send
                                    ({
                                          message : "Irrelevant price"
                                    })
                              return;
                              }
                              else
                              {
                                  next();
                              }
                          }
                    }) 
                }
              else  // --> If category id is not provided
              {
                  res.status(400).send
                  ({
                        message: "Category id of a product is not provided"
                  })
                  return;
              }
        }
}
const validateCategoryInRequestParams=(req, res, next) =>
{
    const categoryId = req.params.categoryId;
    if(categoryId)   // User have provide some catgory id
        {
              // validate category id
              category.findByPk(categoryId).then(response =>
              {
                    if(!response)  // category id is not valid
                    {
                        res.status(400).send
                        ({
                            message: `CategoryId passed is not valid : ${categoryId}`
                        })
                        return;
                    }
                    else   //---> Category id is valid
                        {
                        next();
                        }
              }).catch(err =>
                  {
                      res.status(500).send
                      ({
                            message: `Some internal error occured`
                      })
                  })
        }
    else // User have not provided the category id
        {
              res.status(400).send
              ({
                  message: `CategoryId is not provided`
              })
              return;
          }
}
module.exports = 
{
  validateCategoryRequest, validateProductRequest, validateCategoryInRequestParams 
};