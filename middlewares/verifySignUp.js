const db = require("../models");


const checkDuplicateUsernameorEmail = (req, res, next) =>
{
    db.user.findOne
    ({
        where :
            {
                username : req.body.username
            }
    }).then(user =>
        {
            if(user)
            {
                res.status(400).send
                ({
                    message : "Username ALready Exists"
                })
                return;
            }
        // If user not present already, then validate for email also
        db.user.findOne
        ({
            where :
                {
                    email : req.body.email
                }
        }).then(user =>
            {
                if(user)
                {
                    res.status(400).send
                    ({
                        message : "Email Already exists"
                    })
                    return;
                }
                next();
            })
    })
}
const checkRolesExists = async (req, res, next) =>
{
    if(req.body.roles)
    {
        // iterate through roles provde by user
        for(let i=0; i<req.body.roles.length; i++)
        {
            let roleIncluded = await db.ROLES.includes(req.body.roles[i]);
            if(!roleIncluded)
            {
                res.status(400).send
                ({
                    message : "Roles doesn't exists" + req.body.roles[i]
                })
              return;
            }

            // db.role.findOne
            // ({
            //     where :
            //     {
            //             name : req.body.roles[i]
            //     }
            // }).then(role =>
            //     {
            //         if(!role)
            //         {
            //             res.status(400).send
            //             ({
            //                 message : "Roles doesn't exists : " +req.body.roles[i]
            //             })
            //             return;
            //         }
            //     })
        }
    }
    next();
}
 
const verifySignUp = { checkDuplicateUsernameorEmail, checkRolesExists};
module.exports = verifySignUp;