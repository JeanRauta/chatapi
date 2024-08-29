const token = require("../util/token");
const usuarioModel = require('../models/usuarioModel');

exports.entrar=async(nick)=>{
    let resp = await usuarioModel.registrarUsuario(nick);
    if(resp.inserteId){
        return{"idUser":resp.inserteId,
        "token": await token.setToken(JSON.stringify(resp.inserteId).replace(/"/g, ''),nick),
        "nick":nick}
    }
}