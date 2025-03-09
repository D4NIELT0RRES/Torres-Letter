const apiCartas = "https://deckofcardsapi.com/api/deck";
let idBaralho = "";
let ultimaCarta = null;
let pontuacao = 0;

// Função para iniciar o jogo
async function iniciarJogo() {
    let nomeUsuario = document.getElementById("nomeUsuario").value;
    
    if (nomeUsuario.trim() === "") {
        alert("Digite um nome de usuário!");
        return;
    }

    // Criar e embaralhar um novo baralho via API
    const resposta = await fetch(`${apiCartas}/new/shuffle/?deck_count=1`);
    const dados = await resposta.json();
    idBaralho = dados.deck_id;

    // Atualiza a interface do jogo
    document.getElementById("telaLogin").style.display = "none";
    document.getElementById("telaJogo").style.display = "block";
    document.getElementById("mensagem").innerText = "Baralho embaralhado! Puxe uma carta.";
    document.getElementById("placar").innerText = `Pontuação: ${pontuacao}`;
}

// Função para puxar uma carta do baralho
async function puxarCarta() {
    const resposta = await fetch(`${apiCartas}/${idBaralho}/draw/?count=1`);
    const dados = await resposta.json();

    // Se o baralho acabou
    if (dados.remaining === 0) {
        document.getElementById("mensagem").innerText = "Baralho acabou! Reinicie.";
        return null;
    }

    // Exibe a carta tirada
    const carta = dados.cards[0];
    document.getElementById("containerCartas").innerHTML = `<img src="${carta.image}" alt="${carta.value} de ${carta.suit}">`;
    document.getElementById("mensagem").innerText = `Você tirou: ${carta.value} de ${carta.suit}`;
    return carta;
}

// Função para adivinhar se a próxima carta é MAIOR
async function adivinharMaior() {
    if (!idBaralho) return alert("Inicie o jogo primeiro!");
    
    const novaCarta = await puxarCarta();
    if (!ultimaCarta) {
        ultimaCarta = novaCarta;
        return;
    }

    if (converterValorCarta(novaCarta.value) > converterValorCarta(ultimaCarta.value)) {
        document.getElementById("mensagem").innerText += " ✅ Você acertou!";
        pontuacao++;
    } else {
        document.getElementById("mensagem").innerText += " ❌ Errou!";
        pontuacao = Math.max(0, pontuacao - 1);
    }
    document.getElementById("placar").innerText = `Pontuação: ${pontuacao}`;
    ultimaCarta = novaCarta;
}

// Função para adivinhar se a próxima carta é MENOR
async function adivinharMenor() {
    if (!idBaralho) return alert("Inicie o jogo primeiro!");
    
    const novaCarta = await puxarCarta();
    if (!ultimaCarta) {
        ultimaCarta = novaCarta;
        return;
    }

    if (converterValorCarta(novaCarta.value) < converterValorCarta(ultimaCarta.value)) {
        document.getElementById("mensagem").innerText += " ✅ Você acertou!";
        pontuacao++;
    } else {
        document.getElementById("mensagem").innerText += " ❌ Errou!";
        pontuacao = Math.max(0, pontuacao - 1);
    }
    document.getElementById("placar").innerText = `Pontuação: ${pontuacao}`;
    ultimaCarta = novaCarta;
}

// Converte os valores das cartas em números para comparação
function converterValorCarta(valor) {
    const valores = {
        "ACE": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
        "JACK": 11, "QUEEN": 12, "KING": 13
    };
    return valores[valor];
}

// Função para reiniciar o jogo
async function reiniciarJogo() {
    await fetch(`${apiCartas}/${idBaralho}/shuffle/`);
    document.getElementById("mensagem").innerText = "Baralho reiniciado!";
    document.getElementById("containerCartas").innerHTML = "";
    ultimaCarta = null;
    pontuacao = 0;
    document.getElementById("placar").innerText = `Pontuação: ${pontuacao}`;
}
