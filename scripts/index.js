const campoRg = document.getElementById('campoRg')
const numeroCandidatoInput = document.querySelector('.input-numero')
const nomeCandidato = document.querySelector('.nome-candidato')
const imagemCandidato = document.querySelector('.imagem-candidato')
const dataListNumeros = document.getElementById("opcoesDatalist")
const formulario = document.querySelector('.formulario')
const statusVoto = document.querySelector('.statusVoto')
const botaoCancelar = document.getElementById('botaoCancelar')
const botaoBranco = document.getElementById('botaoBranco')
const divInfoForm = document.querySelector('.container-formulario')
const botaoLogin = document.getElementById('botaoLogin')
const conteudoPaginaSemLogin = document.querySelector('.conteudo-pagina')
const conteudoLogin = document.querySelector('.tela_autenticacao')

//SOM DA URNA
const somUrna = 'assets/Urna.mp3';
const audio = new Audio(somUrna);

//LOGIN
conteudoPaginaSemLogin.style.display = "none"

botaoLogin.addEventListener("click", loginUser)

// Adicione uma variável para rastrear se a mensagem já foi exibida
let acessoNegadoExibido = false;

async function loginUser() {
    let cpf = document.getElementById("idCPF").value
    let senha = document.getElementById("idSenha").value

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "cpf": cpf,
            "senha": senha
        })
    };

    try {
        let res = await fetch('http://localhost:3005/login', options)
        let autenticacao = await res.json()
        sessionStorage.setItem("auth", autenticacao.token)

        if (autenticacao.auth) {
            conteudoPaginaSemLogin.style.display = "block";
            conteudoLogin.style.display = "none";
        }

        if (acessoNegadoExibido) {
            acessoNegadoExibido = false;
            conteudoLogin.removeChild(document.querySelector('.acessoNegado'));
        }
    } catch (error) {
        if (error && !acessoNegadoExibido) {
            let acessoNegado = document.createElement('p');
            acessoNegado.textContent = "Acesso negado";
            acessoNegado.classList.add("acessoNegado");

            conteudoLogin.appendChild(acessoNegado);

            acessoNegadoExibido = true;
        }
    }
}



//CAMPO RG ESCONDIDO POR PADRAO - SO LIBERA COM TIPO != a
campoRg.style.display = 'none';

//ZERAR DADOS
function zerarDados() {
    nomeCandidato.textContent = "Digite o número do candidato"
    imagemCandidato.src = `../assets/candidato.png`
}

//FECTH NA /CARGAINICIAL AO LIGAR A URNA - MOSTRAR LISTA NO DATALIST
async function carregarDadosFetch() {

    let resposta = await fetch("http://localhost:3005/cargainicial")

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

    let resposta = await fetch("http://localhost:3005/cargainicial")

    let respostaJson = await resposta.json()

    let valorInput = event.target.value;

    respostaJson.forEach(element => {
        if (element.numero == valorInput) {
            nomeCandidato.textContent = element.nome
            imagemCandidato.src = `../assets/${element.nome}.jpg`
        }
    })
});

//PEGANDO DADOS DO /VOTO E EXIBINDO NA TELA
formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    //TRATANDO VOTOS NULOS
    if (numeroCandidatoInput.value == "") {
        postVotacao("Nulo")
    } else {
        postVotacao(numeroCandidatoInput.value)
    }

})

//FUNCAO POST
async function postVotacao(numeroVoto) {

    //SOM DA URNA
    audio.currentTime = 2;
    audio.play();
    setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
    }, 2000);

    const response = await fetch("http://localhost:3005/voto", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nmNumero: numeroVoto,
            nmRg: campoRg.value,
        }),
    });

    const responseData = await response.json();

    //MOSTRANDO MENSAGEM NA TELA DE ACORDO COM O STATUS
    divInfoForm.style.display = "none"
    statusVoto.textContent = responseData.Mensagem

    if (responseData.Status == 200) {
        setTimeout(() => {
            divInfoForm.style.display = "block"
            statusVoto.textContent = ""
            numeroCandidatoInput.value = ""
            campoRg.value = ""
            zerarDados()
        }, 2000);
    } else {
        statusVoto.classList.add('destacado-erro')
    }
}

//CANCELAR - LIMPAR A TELA - BOTAO
botaoCancelar.addEventListener("click", () => {
    zerarDados()
    numeroCandidatoInput.value = null
})


//BRANCO - SALVAR VOTO COMO "BRANCO" - BOTAO
botaoBranco.addEventListener("click", () => {
    postVotacao("Branco")
});


