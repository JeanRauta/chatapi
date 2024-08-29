const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.status(200).send("<h2>Teste</h2>");
    } catch (error) {
        res.status(500).send({ error: 'Erro no servidor' });
    }
});

app.use("/salas", router.get("/salas", async (req, res,next)=>{
    if (await token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) {
        let resp = await salaController.get()
        res.status(200).send(resp)
    }else{
        res.status(400).send({msg: "não autorizado"})
    }
}))

app.use("/entrar", router.post("/entrar", async (req, res, next) => {
    const usuarioController = require("../controllers/usuarioController")
    let resp = await usuarioController.entrar(req.body.nick);
    res.status(200).send(resp);
}));

app.use('/', router); 

module.exports = app;
