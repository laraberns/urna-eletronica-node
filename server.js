const express = require("express")
const cors = require("cors")

const app = express()

const carregarDadosDosCandidatos = require("./banco.js")

//MIDDLEWARES
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.post("/voto", function (req, resp) {

    let nmNumero = req.body
    resp.json(nmNumero)
})

app.get("/cargainicial", function (req, resp) {

    carregarDadosDosCandidatos().then(arrayDosCandidatos => {
        resp.send(arrayDosCandidatos)
    })

})

app.listen(3000)




