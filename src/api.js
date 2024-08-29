var express = require("express");
const { check, validationResult } = require('express-validator'); // Remover duplicação
var app = express();
const usuarioController = require('./controller/usuarioController');
const salaController = require('./controller/salaController');
const token = require("./util/token");

app.use(express.urlencoded({extended : true}));
app.use(express.json());

var nickUser, idUser, tokenUser;

const router = express.Router();

app.use('/', router.get('/', (req, res, next) => {
    res.status(200).send("<h1>API - CHAT<h1>");
}));

app.use("/",router.get("/sobre", (req, res, next) => {
    res.status(200).send({
        "nome":"API CHAT",
    });
}));

app.use('/entrar', router.post('/entrar', [
    check('nick').isLength({ min: 1 }).withMessage('Nome de usuário é obrigatório')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let resp = await usuarioController.entrar(req.body.nick);
        nickUser = resp.nick;
        idUser = resp.iduser;
        tokenUser = resp.token;
        res.status(200).send(resp);
        console.log('entrar ok');
    } catch (error) {
        res.status(500).send({ msg: "Erro interno do servidor" });
    }
}));

app.use("/salas", router.get("/salas/listar", async (req, res, next) => {
    req.headers.nick = nickUser;
    req.headers.iduser = idUser;
    req.headers.token = tokenUser;
    if (await token.checktoken(req.headers.token, req.headers.iduser, req.headers.nick)) {
        let resp = await salaController.get();
        res.status(200).send(resp);
        console.log('listar salas ok');
    } else {
        res.status(400).send({msg:"Usuário não autorizado"});
    }
}));

app.use('/salas', router.get('/salas/entrar', async(req, res) => {
    console.log('Entrou na rota /salas/entrar');
    req.headers.nick = nickUser;
    req.headers.iduser = idUser;
    req.headers.token = tokenUser;
    if (await token.checktoken(req.headers.token, req.headers.iduser, req.headers.nick)) {
        console.log('Token verificado com sucesso');
        let resp = await salaController.entrar(req.headers.iduser, req.query.idsala);
        res.status(200).send(resp);
        console.log('Entrar na sala ok');
    } else {
        console.log('Token inválido');
        res.status(400).send({ msg: "Usuário não autorizado" });
    }
}));


app.use('/salas', router.post('/salas/criar', async (req, res) => {
    try {
        const { nome, tipo } = req.body;
        if (!nome || !tipo) {
            return res.status(400).send({ msg: "Nome e tipo da sala são obrigatórios" });
        }

        let resp = await salaController.criarSala(idUser, nome, tipo);
        res.status(201).send(resp);
        console.log('criar sala ok');
    } catch (error) {
        res.status(500).send({ msg: "Erro interno do servidor" });
    }
}));

app.use('/salas', router.post('/salas/sair', async (req, res) => {
    try {
        const { idSala } = req.body;
        if (!idSala) {
            return res.status(400).send({ msg: "ID da sala é obrigatório" });
        }

        let resp = await salaController.sairSala(idUser, idSala);
        res.status(200).send(resp);
        console.log('sair sala ok');
    } catch (error) {
        res.status(500).send({ msg: "Erro interno do servidor" });
    }
}));

app.use("/salas/mensagem", router.post("/salas/mensagem", async (req, res) => {
    if (!token.checktoken(req.headers.token, req.headers.iduser, req.headers.nick)) {
        return res.status(401).send({ msg: "Usuário não autorizado" });
    }
    try {
        let resp = await salaController.enviarMensagem(req.headers.nick, req.body.msg, req.body.idSala);
        res.status(200).send(resp);
    } catch (error) {
        res.status(500).send({ msg: "Erro interno do servidor" });
    }
}));

module.exports = app;
