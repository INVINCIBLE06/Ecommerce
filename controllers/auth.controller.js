// bcrypt is used for req encryption and decryption
// jsonwebtoken allows token generation and access through it.

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const config = require('../config/auth.config');
const db = require("../models");

const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;

// register or signup
exports.signup = (req, res) =>
{
    const userObj =
        {
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)  // --> thiis 10 will add 10 other items in the encrypted string
        };
    User.create(userObj).then(user =>
        {
            if(req.body.roles)
                {
                    Role.findAll
                        ({
                            where : 
                                    {
                                        name : 
                                                {
                                                    [Op.or]: req.body.roles //--> It will check that one particular person have different or multiple roles                        
                                                }
                                    }
                    }).then(roles =>
                        {
                           user.setRoles(roles).then(() =>
                                {
                                    res.status(201).send({ message : "User registered successfully !" });
                                }) 
                        })
                }
            else
                {
                    // Default role => 1 - "customer" = db.ROLES[1]
                    // console.log("inside else part for no roles");
                    Role.findAll
                    ({
                        where: 
                            {
                                name: "customer"
                            }
                    }).then(role => 
                        {
                            user.setRoles(role).then(resp => 
                                {
                                    res.status(201).send({ message: "user registered successfully!" 
                                });
                        }).catch(err => 
                                {
                                    res.status(500).send({ message: `internal server error occurred: ${err}` });
                                })
                    })
                }
            }).catch(err => 
                {
                    res.status(500).send({ message: err.message });
                });
        }        

//  signin

exports.signin = (req, res) =>
{
    User.findOne({
        where :
                {
                    username : req.body.username
                }
    }).then(user =>
        {
            if(!user)
            {
                return res.status(404).send({message : "User Not found"});
            }
            var isValidPassword = bcrypt.compareSync(req.body.password, user.password);
            if(!isValidPassword)
                {
                    return res.status(401).send
                    ({
                        message : "Invalid Password"
                    })
                }
            var token = jwt.sign({ id: user.id }, config.secret,
                {
                    expiresIn : 86400  // Token will expires is 1000 milisecond
                })

                // hashing is done on password only
                // your jwt is encoded which consists od your payload data and other information
// [            {"1", "customer"}, {"2", "admin"}] => ["ROLE_CUSTOMER", "ROLE_ADMIN"]  <= This get from authorities array          
            var authorities = [];
            user.getRoles().then(roles =>
                {
                    for(let i=0; i<roles.length; i++)
                        {
                            authorities.push("ROLE_"+roles[i].name.toUpperCase());
                        }
                    res.status(200).send
                        ({
                            id : user.id,
                            username : user.username,
                            email : user.email,
                            roles : authorities,
                            accessToken : token
                        })
                })
        }).catch(err =>
            {
                res.status(500).send({ message : err.message});
            })
}

exports.base = (req, res) => 
    {
        return res.status(200).send({message : "Home Page"});
    }