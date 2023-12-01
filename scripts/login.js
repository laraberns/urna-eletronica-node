const fs = require("fs").promises;
const path = require("path");

async function lerArquivoEleitores() {
    const filePath = path.join(__dirname, "../eleitores.csv");
    const dado = await fs.readFile(filePath, "utf-8");

    const linhas = dado.split('\n');
    const eleitores = [];

    linhas.forEach((linha) => {
        const valores = linha.split(',');

        if (valores.length >= 3) {
            const eleitor = valores.map(valor => valor.trim());
            eleitores.push(eleitor);
        }
    });

    return eleitores
}

module.exports = {
    lerArquivoEleitores
};
