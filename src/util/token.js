const jwt = require('jsonwebtoken');

const checktoken = (token, id, key) => {
  console.log(token);
    try{
        const dec = jwt.verify(token, key, (err, decoded) =>{
            if (err){
                return false;
            }
            if (decoded){
                if(decoded.id !=id) return false;
            }
        });
       
            return true;
    }catch(e){
        console.log("e do checktoken: "+e);
    }
};

const setToken = async (id, key) => {
  console.log(id);
    if(id){
        return jwt.sign({id}, key, {expiresIn: 28800});
    }
    return false;
};

module.exports = {checktoken, setToken};





