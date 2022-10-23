const express = require('express');
const app = express();
// const dbConfig = require('./configs/db.config.json');
const serverConfig = require('./config/server.config.js');
const db = require("./models"); // It will automatically gets models/index.js it is feature off express.
// Force true will check if that specific table is available then deleted it 
// const Category = require("./models/category.model")(db.sequelize, db.Sequelize);
const bodyParser = require('body-parser');
//const { ROLES } = require('./models');
// const { INITIALLY_DEFERRED } = require('sequelize/types/deferrable.js');
app.use(bodyParser.urlencoded({extended:true}));  // this will translate the api to json 
app.use(bodyParser.json()); // 

function init()
{
	db.role.create
		({
			id : 1,
			name : db.ROLES[0]
		}),
	db.role.create
		({
			id: 2,
			name : db.ROLES[1]
		})
    var categoriesData =
	[   
    	{   
			name : "Electronics",
        	description : "This categories contan electrical appliances"
		},
    	{   
			name : "Vegetables",
        	description : "This category contains Vegetables"
		},
    ]
	var productData =
	[
		{
			name: "Samsung",
			price: "10000"
		}
	]

    db.category.bulkCreate(categoriesData).then(() =>
	{
    	console.log("Category table is initialized wth category data")
    }).catch((err) =>
	{
    	console.log("Error in intializing categories table", err);
    })

	db.product.bulkCreate(productData).then(() =>
	{
		console.log("Product table is initialized with product data");
	}).catch((err) =>
	{
		console.log("Error in initializing  the product table", err);
	})
}
    // 
	db.category.hasMany(db.product);
    db.sequelize.sync({force:true}).then(() =>
    {
        console.log("models/tables are droped and recreated")
        init();
    })

// app.get('/', (req, res) => res.send("Welcome to Ecommerce App"));
require('./routes/category.routes')(app);
require('./routes/product.routes')(app);
require('./routes/auth.routes')(app);
require('./routes/cart.routes')(app);

app.listen(serverConfig.PORT, () =>
            { 
                console.log("My Server is Running");
            });