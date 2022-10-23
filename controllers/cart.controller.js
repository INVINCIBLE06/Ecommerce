// const { cart, product } = require('../models');
const db = require('../models');
const cartRoutes = require('../routes/cart.routes');

/**
 * Create and save a new cart
 */

exports.create = (req, res) =>
{
    const cartObj =
        {
            userId : req.userId // it will be provided by the middlewares.
        }

    db.cart.create(cartObj).then(cart =>
        {
            res.status(201).send(cart);
        }).catch(err =>
            {
                res.status(500).send
                    ({
                        message : "Some internal server error occured"
                    })
            })
}

/** 
 * Update in the cart
*/

exports.update = (req, res) =>
{
    const cartId = req.params.id;

    db.cart.findByPk(cartId).then(cart =>
        {
            // console.log(cart);
            db.product.findAll
            ({
                where : 
                {
                    id : req.body.productIds
                }
            }).then(productList =>
                {
                    if(!productList)
                    {
                        res.status(400).send
                            ({
                                message : "Addded product doesn't exist"
                            })
                            return;
                    }
                    cart.setProducts(productList).then(() =>  // Sequelize will provde two function "set" and "get" will be used for conection
                    {
                        let selectedProducts =[];
                        let totalCost = 0;
                        cart.getProducts().then(products =>
                            {
                                for(let i=0; i<products.length; i++)
                                    {
                                        totalCost = totalCost + products[i].price;
                                        selectedProducts.push
                                        ({
                                            id : products[i].id,
                                            name : products[i].name,
                                            cost : products[i].price
                                        });
                                    }
                                res.status(200).send
                                    ({
                                        id : cart.id,
                                        selectedProducts : selectedProducts,
                                        cost : totalCost
                                    })
                            })
                    })
            })
    })
}

/**
 * get all the cart items based on cartId
 */

exports.getCart = (req, res) =>
    {
        const cartId = req.params.id;
        db.cart.findByPk(cartId).then(cart =>
            {
                if(!cart)
                {
                    res.status(400).send
                        ({
                            message : "Cart doesn't exist"
                        });
                        return;
                }
                let productList =[];
                let totalCost = 0;
                    cart.getProducts().then(products =>
                    {
                        for(let i=0;  i<products.length; i++)
                         {
                            totalCost = totalCost + products[i].price;
                            productList.push
                            ({
                                id : products[i].id,
                                name : products[i].name,
                                cost : products[i].price
                            });
                         }
                         res.status(200).send
                         ({
                            id : cart.id,
                            productList : productList,
                            cost : totalCost
                         })
                    })
            })

    }