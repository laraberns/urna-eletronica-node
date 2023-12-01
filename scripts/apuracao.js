const fs = require("fs").promises;
const path = require("path");

async function lerArquivoVotacao() {
    const filePath = path.join(__dirname, "../votacao.csv");
    console.log(filePath);
    const dado = await fs.readFile(filePath, "utf-8");

    const linhas = dado.split('\n');
    const numeroDosCandidatosCadaVoto = [];

    linhas.forEach((linha) => {
        const valores = linha.split(',');

        // Certificar-se de que existem pelo menos 3 valores
        if (valores.length >= 3) {
            numeroDosCandidatosCadaVoto.push(valores[1]);
        }
    });

    return numeroDosCandidatosCadaVoto;
}

function verificarQtdVotosPorCandidato(numeroDosCandidatosCadaVoto) {
    const contagem = {};

    numeroDosCandidatosCadaVoto.forEach(numero => {
        if (contagem[numero]) {
            contagem[numero]++;
        } else {
            contagem[numero] = 1;
        }
    });

    const resultado = [];

    for (const numero in contagem) {
        resultado.push([numero, contagem[numero]]);
    }

    return resultado;
}

async function contabilizaVotosValidos(resultadoContagem, arrayDosCandidatos) {
    const resultadoComInfoCandidato = resultadoContagem.map(([numero, qtdVotos]) => {
        const candidato = arrayDosCandidatos.find(c => c.numero === numero);

        if (candidato) {
            return [numero, qtdVotos, candidato.nome, candidato.foto];
        } else {
            return [numero, qtdVotos, "Candidato inexistente"];
        }
    });

    return resultadoComInfoCandidato;
}

module.exports = {
    lerArquivoVotacao,
    verificarQtdVotosPorCandidato,
    contabilizaVotosValidos
};
