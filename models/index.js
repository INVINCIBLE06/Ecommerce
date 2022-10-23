/**
 * This file will be used for 
 * 1. Creating DB connecton with the help of sequelize ORM
 * 2. Exporting all the functonalities of models
 * 3. If some one import this index.js then they can just import ./models
 * 
 */

 const Sequelize = require('sequelize');
 const dbConfig = require('../config/db.config.json');
 const env = process.env.NODE_ENV || "development";
 const dbSettings = dbConfig[env];
 const sequelize = new Sequelize 
    (
        dbSettings.database,
        dbSettings.username,
        dbSettings.password,
        dbSettings.dialectInformation
    );
// const db ={};
const db = {Sequelize, sequelize};
// db.Sequelize = Sequelize; // --> This line is used for using all the functionalites of the Database 
// db.sequelize = sequelize; // --> This line is used for using all the informantion of the Database
db.category = require('./category.model')(sequelize, Sequelize);
db.product = require('./product.model')(sequelize, Sequelize);
db.user = require('./user.model')(sequelize, Sequelize);
db.role = require('./role.model')(sequelize, Sequelize);
db.cart = require('./cart.model')(sequelize, Sequelize);
/**
 * Relationship between the Role and user is many to many
 */
db.role.belongsToMany(db.user,
    {
        through : "user_roles",
        foreignKey : "roleId",
        otherKey : "userId",
    });
db.user.belongsToMany(db.role,
    {
        through : "user_roles",
        foreignKey : "userId",
        otherKey : "roleId"
    });

db.ROLES = ["customer", "admin"];
// db.ROLES = ["user", "admin"];

/**
 * Relationship betweena cart and user
 * one user can have many carts
 */

db.user.hasMany(db.cart);

/**
 * Retionshp between Cart and Products : Many to Many
 */
db.product.belongsToMany(db.cart,
    {
        through: "cart_products",
        foreignKey: "productId",
        otherKey: "cartId"
    });

db.cart.belongsToMany(db.product,
    {
        through: "cart_products",
        foreignKey: "cartId",
        otherKey: "productId"
    });


module.exports = db;  // From here we can export the Databse information anywhere n the application

