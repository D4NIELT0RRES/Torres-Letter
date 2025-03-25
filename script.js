// URL base da API de cartas
const apiCartas = "https://deckofcardsapi.com/api/deck";

// Variáveis globais
let idBaralho = "";
let ultimaCarta = null;
let pontuacao = 0;

// Função para iniciar o jogo (chamada da tela de login)
async function iniciarJogo() {
    const nomeUsuario = document.getElementById("nomeUsuario").value;
    
    if (nomeUsuario.trim() === "") {
        alert("Digite um nome de usuário!");
        return;
    }

    // Salva o nome do usuário no localStorage
    localStorage.setItem("nomeUsuario", nomeUsuario);

    try {
        // Cria e embaralha um novo baralho
        const resposta = await fetch(`${apiCartas}/new/shuffle/?deck_count=1`);
        const dados = await resposta.json();
        idBaralho = dados.deck_id;
        
        // Salva o ID do baralho no localStorage
        localStorage.setItem("idBaralho", idBaralho);
        
        // Redireciona para a tela do começo
        window.location.href = "comeco.html";
    } catch (error) {
        console.error("Erro ao criar baralho:", error);
        alert("Erro ao iniciar o jogo. Tente novamente.");
    }
}

// Função chamada quando a tela do começo é carregada
function carregarComeco() {
    const nomeUsuario = localStorage.getItem("nomeUsuario");
    idBaralho = localStorage.getItem("idBaralho");
    
    if (!nomeUsuario || !idBaralho) {
        // Se não houver dados, volta para a tela de login
        window.location.href = "index.html";
        return;
    }
    
    document.getElementById("exibirNome").textContent = nomeUsuario;
    document.getElementById("nomeUsuarioComeco").value = nomeUsuario;
}

// Função para ir para a tela do jogo
function comecarJogo() {
    window.location.href = "jogo.html";
}

// Função chamada quando a tela do jogo é carregada
function carregarJogo() {
    const nomeUsuario = localStorage.getItem("nomeUsuario");
    idBaralho = localStorage.getItem("idBaralho");
    
    if (!nomeUsuario || !idBaralho) {
        // Se não houver dados, volta para a tela de login
        window.location.href = "index.html";
        return;
    }
    
    document.getElementById("placar").textContent = `Pontuação: ${pontuacao}`;
}

// Restante das funções do jogo (mantidas iguais)
async function puxarCarta() {
    const resposta = await fetch(`${apiCartas}/${idBaralho}/draw/?count=1`);
    const dados = await resposta.json();

    if (dados.remaining === 0) {
        document.getElementById("mensagem").textContent = "Baralho acabou! Reinicie.";
        return null;
    }

    const carta = dados.cards[0];
    document.getElementById("containerCartas").innerHTML = `<img src="${carta.image}" alt="${carta.value} de ${carta.suit}">`;
    document.getElementById("mensagem").textContent = `Você tirou: ${carta.value} de ${carta.suit}`;
    return carta;
}

async function adivinharMaior() {
    if (!idBaralho) return alert("Inicie o jogo primeiro!");
    
    const novaCarta = await puxarCarta();
    if (!ultimaCarta) {
        ultimaCarta = novaCarta;
        return;
    }

    if (converterValorCarta(novaCarta.value) > converterValorCarta(ultimaCarta.value)) {
        document.getElementById("mensagem").textContent += " ✅ Você acertou!";
        pontuacao++;
    } else {
        document.getElementById("mensagem").textContent += " ❌ Errou!";
        pontuacao = Math.max(0, pontuacao - 1);
    }
    document.getElementById("placar").textContent = `Pontuação: ${pontuacao}`;
    ultimaCarta = novaCarta;
}

async function adivinharMenor() {
    if (!idBaralho) return alert("Inicie o jogo primeiro!");
    
    const novaCarta = await puxarCarta();
    if (!ultimaCarta) {
        ultimaCarta = novaCarta;
        return;
    }

    if (converterValorCarta(novaCarta.value) < converterValorCarta(ultimaCarta.value)) {
        document.getElementById("mensagem").textContent += " ✅ Você acertou!";
        pontuacao++;
    } else {
        document.getElementById("mensagem").textContent += " ❌ Errou!";
        pontuacao = Math.max(0, pontuacao - 1);
    }
    document.getElementById("placar").textContent = `Pontuação: ${pontuacao}`;
    ultimaCarta = novaCarta;
}

function converterValorCarta(valor) {
    const valores = {
        "ACE": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
        "JACK": 11, "QUEEN": 12, "KING": 13
    };
    return valores[valor];
}

async function reiniciarJogo() {
    await fetch(`${apiCartas}/${idBaralho}/shuffle/`);
    document.getElementById("mensagem").textContent = "Baralho reiniciado!";
    document.getElementById("containerCartas").innerHTML = "";
    ultimaCarta = null;
    pontuacao = 0;
    document.getElementById("placar").textContent = `Pontuação: ${pontuacao}`;
}