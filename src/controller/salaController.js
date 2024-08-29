const salaModel = require("../model/salaModel");

exports.get=async(req,res)=>{
    return await salaModel.listarSalas();
};

exports.entrar = async (iduser, idsala)=>{
    const sala = await salaModel.buscarSala(idsala);
    let usuarioModel = require('../model/usuarioModel');
    let user = await usuarioModel.buscarUsuario(iduser);
    user.sala={_id:sala._id, nome:sala.nome,tipo:sala.tipo};
    if(await usuarioModel.alterarUsuario(user)){
        return{msg:"OK", timestamp:timestamp=Date.now()};
    }
    return false;
};

exports.enviarMensagem = async (nick, msg, idsala)=>{
    const sala = await salaModel.buscarSala(idsala);
    if(!sala.msgs){
        sala.msgs=[];
    }
    timestamp=Date.now()
    sala.msgs.push(
        {
            timestamp:timestamp,
            msg:msg,
            nick:nick
        }
    )
    let resp = await salaModel.atualizarMensagens(sala);
    return {"msg":"OK", "timestamp":timestamp};
}

exports.buscarMensagens = async (idsala, timestamp)=>{
    let mensagens = await salaModel.buscarMensagens(idsala, timestamp);
    return{
        "timestamp":mensagens[mensagens.length - 1].timestamp,
        "msgs":mensagens
    };
}

exports.criarSala = async (iduser, nome, tipo) => {
    let resp = await salaModel.criarSala(nome, tipo, iduser);
    return { msg: "Sala criada com sucesso", sala: resp };
}

exports.sairSala = async (iduser, idSala) => {
    let resp = await salaModel.sairSala(iduser, idSala);
    if (resp) {
        return { msg: "Usuário saiu da sala com sucesso" };
    } else {
        return { msg: "Não foi possível sair da sala" };
    }
}
