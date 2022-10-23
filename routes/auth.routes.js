const controller = require('../controllers/auth.controller');
const { verifySignUp } = require('../middlewares');
module.exports = function(app)
{
    /**
    app.use(function(req, res, next)
    {
        res.header
        {
            "Access-Control-Allow-Header", // --> Header should provide access token inside the header, The request that having an login it is available there 
            "x-access-token, Origin, Content-type, Accept"   // --> This is other things are we want with token
        }
        next();
    })
    */
    app.post("/ecomm/api/v1/auth/signup",[verifySignUp.checkDuplicateUsernameorEmail], verifySignUp.checkRolesExists, controller.signup);
    app.post("/ecomm/api/v1/auth/signin", controller.signin);
}