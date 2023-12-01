const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs").promises;
const app = express();
const jwt = require("jsonwebtoken")
const SECRET = "dfghj&%$GHH5/hbj54"

const carregarDadosDosCandidatos = require("./banco.js");
const apuracao = require("./apuracao.js");
const login = require("./login.js");

let erro = null;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../')));
app.use(express.static(path.join(__dirname, '../styles')));
app.use(express.static(path.join(__dirname, '../assets')));
app.use(express.static(path.join(__dirname, '../scripts')));

app.get("/", function (req, resp) {
    resp.send(fs.readFileSync(path.join(__dirname, "../index.html"), "utf-8"));
});



app.get("/cargainicial", function (req, resp) {
    carregarDadosDosCandidatos().then(arrayDosCandidatos => {
        resp.send(arrayDosCandidatos);
    });
});



app.post("/voto", function (req, resp) {
    let { nmNumero, nmRg } = req.body;
    let timestamp = Date.now();
    let dados = `${nmRg},${nmNumero},${timestamp}`;
    salvarDadosVotacaoCSV(dados);

    if (!erro) {
        resp.json({
            "Status": "200",
            "Mensagem": "Voto registrado com sucesso"
        });
    } else {
        resp.json({
            "Status": "500",
            "Mensagem": "Erro ao registrar voto, contate o administrador do sistema"
        });
    }
});

function salvarDadosVotacaoCSV(dados) {
    const filePath = path.join(__dirname, "../votacao.csv");
    fs.appendFile(filePath, dados + "\n", (err) => {
        if (err) {
            erro = true;
        } else {
            erro = false;
        }
    });
}



app.get("/apuracao", async function (req, resp) {
    const numeroDosCandidatosCadaVoto = await apuracao.lerArquivoVotacao()

    const resultadoContagem = apuracao.verificarQtdVotosPorCandidato(numeroDosCandidatosCadaVoto);
    const arrayDosCandidatos = await carregarDadosDosCandidatos()
    const resultados = await apuracao.contabilizaVotosValidos(resultadoContagem, arrayDosCandidatos);

    resp.json(resultados.sort((a, b) => b[1] - a[1]))
})



app.post("/login", async function (req, resp) {

    const eleitores = await login.lerArquivoEleitores();

    const { cpf, senha } = req.body
    const eleitorEncontrado = eleitores.find(eleitor => eleitor[0] === cpf && eleitor[1] === senha)
    const tokenInBlacklist = blacklist.includes(req.header("x-access-token"))

    if (tokenInBlacklist) {
        return resp.status(401).end()
    }

    if (eleitorEncontrado) {
        const token = jwt.sign({ userId: eleitorEncontrado[0] }, SECRET, { expiresIn: 60 })
        return resp.status(200).json({
            "auth": true,
            "nome": eleitorEncontrado[2],
            token
        });
    } else {
        resp.status(403).end();
    }
    
});



const blacklist = []
app.post("/logout", (req, res) => {
    const token = req.header("x-access-token");
    blacklist.push(token)
    res.status(200).end()
})

app.listen(3005)
