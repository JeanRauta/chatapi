const { connect } = require("../api");
const db = require("./db");
async function registrarUsuario(nick){
    return await db.insertOne("Usuario",{"nick":nick});

}

module.exports = {registrarUsuario}

