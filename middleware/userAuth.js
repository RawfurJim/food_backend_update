const jwt = require('jsonwebtoken');
const config = require('config');

function Userauth(req,res,next){
     const uToken = req.header('user-auth-token');
     console.log(uToken);
     if(!uToken){
     	res.status(400).send('no token provided');
     	return;
     }
     try{
    	const decoded = jwt.verify(uToken , config.get('UserjwtPrivatekey'));  
    	next();

     }
     catch(ex){
     	res.status(400).send('invalid');
     }

}
module.exports = Userauth;