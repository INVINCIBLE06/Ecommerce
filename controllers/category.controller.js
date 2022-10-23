/**
 * This would have all the controller logic for category
 * whenever user will mae a CRUD request, Some method defined in this controller for
 * that request will be cancelled
 */

// const { response } = require('express');
// const { category } = require('../models');
// const { product } = require('../models');
const db = require('../models');
const Category = db.category;
/**
 * create and save a new category
 */
exports.create = (req, res) =>
{
    /**
     * validate the request
     */
    // if(!req.body.name)
    // {
        // console.log(req.body);
        // Status code 400 is used for user's mistake
        // res.status(400).send
        // ({
        //    message : "Name of the category can be empty"
        // })
        // return;
    // }
    // Creatng the category object to be stored in the DB

    const category = 
        {
            name : req.body.name,
            description : req.body.description
        }

    // Storing the category object in the db
    // Promise.then(resolved).catch(err)
    
    Category.create(category).then(response =>
        {
            // Status code 201 defines that the data is stored 
            console.log(`category name: [${response} got inserted into the db ]`);
            res.status(201).send(response);
        }).catch(err => 
            {
                // Status code 500 define that there are some internal error
                console.log(`category name: [${err} not inserted in the db]`);
                res.status(500).send
                    ({
                        message : "Some internal error occurred while storng the category"
                    })
            })
}

/**
 * If user want to update existing category 
 */

exports.update = (req, res) =>
{
    /**
     * Valdate the request
     */
    // if(!req.body.name)
    // {
    //    res.status(400).send
    //    ({
    //        message: "Name of the category cant be empty"
    //    })
    //    return;
    // }
    /**
     * Creating the catgory object to be update in the DB
     */
    const category =
    {
        name : req.body.name,
        description : req.body.description
    }
    const categoryId = req.params.id;
    Category.update(category,
        {
            where:
            {
                id: categoryId
            }
        }).then(response =>
            {
                // console.log( category, categoryId);
                res.status(200).send(response);
            }).catch(err =>
                {
                    res.status(500).send
                    ({
                        message : "Some inetrnal error Occured while updating the category data !"
                    });
                }); 
};
// If user want to delete 
exports.delete = (req, res) =>
{
  const categoryId = req.params.id;
  Category.destroy
  ({
    where :
        {
            id: categoryId
        }
  }).then(response =>
    {
        res.sendStatus(200).send(response);
    }).catch(err =>
        {
            res.sendStatus(500).send
            ({
                message : "Some internal error occurred while deleting the category"
            })
        });     
}

/**
 * Get a category information based upon the category id
 */
exports.findOne = (req,res) =>
{
    const categoryId = req.params.id;
    Category.findByPk(categoryId).then(response =>
        {
            res.status(200).send(response);
        }).catch(err =>
            {
                res.status(500).send
                ({
                    message : "Some internal error occured while fetching category based upon category"
                })
            })
}

exports.findAll = (req, res) =>
{
    // when query is written it will not give any error even though not gettng any match.
    let categoryName = req.query.name;
    let promise;
    if(categoryName)
    {
        promise = Category.findAll
        ({
            where :
            {
                name : categoryName
            }
        })
    }
    else
    {
        promise = Category.findAll();
    }
    promise.then(response =>
        {
            res.status(200).send(response);
        }).catch(err =>
            {
                res.status(500).send
                ({
                    message : "Some internal error occured while fetching all the categories"
                })
            })

    } 
