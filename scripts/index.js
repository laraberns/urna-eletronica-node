const campoRg = document.getElementById('campoRg')
const numeroCandidatoInput = document.querySelector('.input-numero')
const nomeCandidato = document.querySelector('.nome-candidato')
const imagemCandidato = document.querySelector('.imagem-candidato')
const dataListNumeros = document.getElementById("opcoesDatalist")
const formulario = document.querySelector('.formulario')
const conteudoFormularioSemBotoes = document.querySelector('.campos-formulario-sem-botoes')
const divBotoes = document.querySelector('.botoes')
const statusVoto = document.querySelector('.statusVoto')

campoRg.style.display = 'none';

// salvar valor do input quando alterado
let valorInput = null

//zerar dados
function zerarDados() {
    nomeCandidato.textContent = "Digite um número válido"
    imagemCandidato.src = `../assets/candidato.png`
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

//MOSTRAR NOME DOS CANDIDATOS E IMAGEM DE ACORDO COM DADOS DA CARGA INICIAL
numeroCandidatoInput.addEventListener('input', async function (event) {

    zerarDados()

    let resposta = await fetch("http://localhost:3000/cargainicial")

    let respostaJson = await resposta.json()

    valorInput = event.target.value;

    respostaJson.forEach(element => {
        if (element.numero == valorInput) {
            nomeCandidato.textContent = element.nome
            imagemCandidato.src = `../assets/${element.nome}.jpg`
        }
    })
});

//PEGANDO DADOS DO /VOTO E EXIBINDO NA TELA
formulario.addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const response = await fetch("http://localhost:3000/voto", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nmNumero: numeroCandidatoInput.value,
            nmRg: campoRg.value,
        }),
    });

    const responseData = await response.json();

    //MOSTRANDO MENSAGEM NA TELA DO STATUS

        divBotoes.style.display = "none"
        numeroCandidatoInput.style.display = "none"
        nomeCandidato.style.display = "none"
        statusVoto.textContent = responseData.Mensagem

        if(responseData.Status == 200){
            setTimeout(() => {
                divBotoes.style.display = "block"
                nomeCandidato.style.display = "block"
                numeroCandidatoInput.style.display = "block"
                statusVoto.textContent = ""
                numeroCandidatoInput.value = ""
                zerarDados()
            }, 2000);
        }else{
            statusVoto.classList.add('destacado-erro')
        }


});



