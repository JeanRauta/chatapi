const express = require('express')

const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

const router = express.Router()

app.use('/salas', router.get('/salas', async (req, res) => {
    const salaController = require("./controllers/salaController");
    let resp = await salaController.get();
    res.status(200).send(resp);
}));

module.exports = app