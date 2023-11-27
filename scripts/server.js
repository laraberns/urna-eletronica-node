const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs").promises;

const app = express()

const carregarDadosDosCandidatos = require("./banco.js")

//ERROR LET - SAVE STATUS
let erro = null

//MIDDLEWARES
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../')));
app.use(express.static(path.join(__dirname, '../styles')));
app.use(express.static(path.join(__dirname, '../assets')));
app.use(express.static(path.join(__dirname, '../scripts')));

app.get("/", function (req, resp) {
    const indexPath = path.join(__dirname, "../index.html");
    const conteudoIndex = fs.readFileSync(indexPath, "utf-8");
    resp.send(conteudoIndex);
});


app.post("/voto", function (req, resp) {

    let { nmNumero, nmRg } = req.body
    let timestamp = Date.now()

    let dados = `${nmRg},${nmNumero},${timestamp}`

    salvarDadosVotacaoCSV(dados)

    if (!erro) {
        resp.json({
            "Status": "200",
            "Mensagem": "Voto Registrado Com sucesso"
        })
    } else {
        resp.json({
            "Status": "500",
            "Mensagem": "Erro ao registrar voto, contate o administrador do sistema"
        })
    }

})

app.get("/cargainicial", function (req, resp) {

    carregarDadosDosCandidatos().then(arrayDosCandidatos => {
        resp.send(arrayDosCandidatos)
    })

})

function salvarDadosVotacaoCSV(dados) {
    fs.appendFile("votacao.csv", dados + "\n", (err) => {
        if (err) {
            erro = true
        } else {
            erro = false
        }
    });
}

app.listen(3000)




