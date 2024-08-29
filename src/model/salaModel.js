const db = require("./db");
let buscarSala= async(idsala)=>{
    return db.findOne("salas", {_id: idsala});
}

let listarSalas = async()=>{
    let salas = await db.findAll('salas');
    return salas;
}

let atualizarMensagens = async (sala) => {
    return await db.updateOne("salas", sala,{_id:sala._id});
}

let buscarMensagens = async (idsala,timestamp)=>{
    let sala = await buscarSala(idsala);
    if(sala.msgs){
        let msgs =[];
        sala.msgs.forEach((msg)=>{
            if(msg.timestamp >= timestamp){
                msgs.push(msg);
            }
        });
        return msgs;
    }
    return [];
}

let criarSala = async (nome, tipo, iduser) => {
    let novaSala = {
        nome: nome,
        tipo: tipo,
        msgs: [],
        usuarios: [{ _id: iduser }] 
    };
    return await db.insertOne("salas", novaSala);
}

let sairSala = async (iduser, idsala) => {
    let sala = await buscarSala(idsala);
    if (sala) {
        sala.usuarios = sala.usuarios.filter(user => user._id.toString() !== iduser.toString());
        return await db.updateOne("salas", sala, { _id: sala._id });
    }
    return false;
}


module.exports = {listarSalas, atualizarMensagens, buscarMensagens, buscarSala, criarSala, sairSala};