const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try{
        
        const token = req.header("x-auth-token")
       
        
        if (!token) {
            return res
            .status(401)
            .send("No authentication token, athorization denied.")
        }
        
        const verified= jwt.verify( token, 'q&*E+Aa2J?uX;*pu}=rXb&#8XjgYhHqT3xP%[:"tv/*55Ha/>^' )
        // process.env.JWT_SECRET
        // console.log(verified);

        if(!verified){
            return res
                .status(401)
                .send("Token verification failed,, athorization denied blalblablblablbal.")
        }
    
        req.user= verified.id
        next()

    }catch(err){
        res.status(500).send(console.log(err))

    }
};

module.exports= auth;