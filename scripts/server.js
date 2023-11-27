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


app.get("/apuracao", async function lerArquivo(req, resp) {
    const dado = await fs.readFile("votacao.csv", "utf-8")

    const linhas = dado.split('\n')
    const numeroDosCandidatosCadaVoto = [];

    linhas.forEach((linha) => {
        // Dividir os valores usando vírgulas
        const valores = linha.split(',');

        // Certificar-se de que existem pelo menos 3 valores
        if (valores.length >= 3) {
            numeroDosCandidatosCadaVoto.push(valores[1]);
        }
    });

    // Responder com o array de numeroDosCandidatosCadaVoto em formato JSON
    resp.json(numeroDosCandidatosCadaVoto);

    //contabilizar votos
    const resultadoContagem = verificarQtdVotosPorCandidato(numeroDosCandidatosCadaVoto)
    contabilizaVotosValidos(resultadoContagem)
}
)


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

function contabilizaVotosValidos(resultadoContagem) {
    carregarDadosDosCandidatos().then(arrayDosCandidatos => {
        // Mapear o array de contagem para adicionar nome e URL da foto
        const resultadoComInfoCandidato = resultadoContagem.map(([numero, qtdVotos]) => {
            // Encontrar o candidato correspondente no arrayDosCandidatos
            const candidato = arrayDosCandidatos.find(c => c.numero === numero);

            // Verificar se o candidato foi encontrado
            if (candidato) {
                return [numero, qtdVotos, candidato.nome, candidato.foto];
            } else {
                // Se o candidato não foi encontrado, retornar apenas número e quantidade de votos
                return [numero, qtdVotos, "Candidato inexistente"];
            }
        });

        console.log(resultadoComInfoCandidato);
    });
}

function verificarQtdVotosPorCandidato(numeroDosCandidatosCadaVoto) {
    const contagem = {};

    // Iterar sobre o array dinâmico
    numeroDosCandidatosCadaVoto.forEach(numero => {
        // Verificar se o número já existe na contagem
        if (contagem[numero]) {
            // Se existe, incrementar a contagem
            contagem[numero]++;
        } else {
            // Se não existe, iniciar a contagem em 1
            contagem[numero] = 1;
        }
    });

    // Converter o objeto de contagem em um array de arrays
    const resultado = Object.entries(contagem).map(([numero, quantidade]) => [numero, quantidade]);

    return resultado;
}




