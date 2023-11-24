const campoRg = document.getElementById('campoRg');
const numeroCandidatoInput = document.querySelector('.input-numero')
const nomeCandidato = document.querySelector('.nome-candidato')
const imagemCandidato = document.querySelector('.imagem-candidato');
const dataListNumeros = document.getElementById("opcoesDatalist")

campoRg.style.display = 'none';

// salvar valor do input quando alterado
let valorInput = null

//zerar dados
function zerarDados() {
    nomeCandidato.textContent = "Digite um número válido"
    imagemCandidato.src = `./assets/candidato.png`
}

//fetch da /cargainicial ao ligar a urna
async function carregarDadosFetch() {

    let resposta = await fetch("http://localhost:3000/cargainicial")

    let respostaJson = await resposta.json()

    if (respostaJson[0].tipoVotacao != 'a') {
        campoRg.style.display = "block"
    }

    respostaJson.forEach(element => {

        const options = document.createElement("option")
        options.textContent = element.numero

        dataListNumeros.appendChild(options)
    });

}

carregarDadosFetch()

numeroCandidatoInput.addEventListener('input', async function (event) {

    zerarDados()

    let resposta = await fetch("http://localhost:3000/cargainicial")

    let respostaJson = await resposta.json()

    valorInput = event.target.value;

    respostaJson.forEach(element => {
        if (element.numero == valorInput) {
            nomeCandidato.textContent = element.nome
            imagemCandidato.src = `./assets/${element.nome}.jpg`
        }
    })
});