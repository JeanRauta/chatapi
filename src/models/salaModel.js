 const db = require("./db");


 async function listarSalas() {
 return await db.findAll("salas");
 }

let atualizarMensagens = async (sala) => {
    return await db.updateOne("salas", sala,{_id:sala._id});
}
let buscarSala = async(idsala)=>{
   return db.findOne("salas",idsala);
}

let buscarUsuario = async(iduser)=>{
    return db.findOne("usuarios", iduser)
}

let alterarUsuario = async(user)=>{
    return await db.updateOne("usuarios", user, {_id:user._id})
}


let buscarMensagens = async (idsala, timestamp)=>{
    let sala = await buscarSala(idsala);
    if(sala.msgs){
        let msgs=[];
        sala.msgs.forEach((msg)=>{
            if(msg.timestamp >= timestamp){
                msgs.push(msg);
            }
        });
        return msgs;
    }
    return [];
}

 module.exports = { listarSalas, atualizarMensagens, buscarMensagens, buscarUsuario, alterarUsuario, buscarSala}; 