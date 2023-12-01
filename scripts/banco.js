const fs = require("fs/promises")
const path = require("path");

module.exports = async function lerArquivo() {
    const filePath = path.join(__dirname, "../config.csv");
    const dado = await fs.readFile(filePath, "utf-8")
    const candidatos = dado.split("\r\n")
    const arrayDosCandidatos = []

    candidatos.forEach(candidato => {
        let candidatoArray = candidato.split(",")

        let user = {
            tipoVotacao: candidatoArray[0],
            numero: candidatoArray[1],
            nome: candidatoArray[2],
            foto: candidatoArray[3]
        }

        arrayDosCandidatos.push(user)
    })

    return arrayDosCandidatos;
}