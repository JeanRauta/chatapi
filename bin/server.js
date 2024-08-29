require('dotenv').config();
const app = require("../src/api")

app.use((req, res, next)=>{
    next()
})

const port = process.env.PORT || 5001;

app.listen(port)

console.log("Porta: " + port)