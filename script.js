// URL base da API de cartas
const apiCartas = "https://deckofcardsapi.com/api/deck";

// Variável para armazenar o ID do baralho criado
let idBaralho = "";

// Variável para armazenar a última carta puxada
let ultimaCarta = null;

// Variável para armazenar a pontuação do jogador
let pontuacao = 0;

// Função para iniciar o jogo
async function iniciarJogo() {
    // Obtém o nome do usuário do campo de entrada
    let nomeUsuario = document.getElementById("nomeUsuario").value;
    
    // Verifica se o nome do usuário foi inserido
    if (nomeUsuario.trim() === "") {
        alert("Digite um nome de usuário!");
        return;
    }

    document.getElementById("exibirNome").innerText = nomeUsuario;
    document.getElementById("nomeUsuarioComeco").value = nomeUsuario;

    // Cria e embaralha um novo baralho usando a API
    const resposta = await fetch(`${apiCartas}/new/shuffle/?deck_count=1`);
    const dados = await resposta.json();
    idBaralho = dados.deck_id; // Armazena o ID do baralho criado

    // Atualiza a interface do jogo
    document.getElementById("telaLogin").style.display = "none"; // Oculta a tela de login
    document.getElementById("telaComeco").style.display = "block"; // Exibe a tela do começo

    document.getElementById("mensagem").innerText = "Baralho embaralhado! Puxe uma carta."; // Mensagem de status
    document.getElementById("placar").innerText = `Pontuação: ${pontuacao}`; // Atualiza a pontuação exibida
}

async function comecarJogo() {
    document.getElementById("telaComeco").style.display = "none"; // Oculta a tela de começo
    document.getElementById("telaJogo").style.display = "block"; // Exibe a tela do jogo

    telaIniciar();
}

function telaIniciar() {
    console.log("Jogo iniciado!");
}

// Função para puxar uma carta do baralho
async function puxarCarta() {
    // Faz uma requisição para puxar uma carta do baralho
    const resposta = await fetch(`${apiCartas}/${idBaralho}/draw/?count=1`);
    const dados = await resposta.json();

    // Verifica se o baralho acabou
    if (dados.remaining === 0) {
        document.getElementById("mensagem").innerText = "Baralho acabou! Reinicie.";
        return null;
    }

    // Exibe a carta tirada na interface
    const carta = dados.cards[0];
    document.getElementById("containerCartas").innerHTML = `<img src="${carta.image}" alt="${carta.value} de ${carta.suit}">`;
    document.getElementById("mensagem").innerText = `Você tirou: ${carta.value} de ${carta.suit}`;
    return carta; // Retorna a carta puxada
}

// Função para adivinhar se a próxima carta é MAIOR
async function adivinharMaior() {
    if (!idBaralho) return alert("Inicie o jogo primeiro!");
    
    // Puxa uma nova carta
    const novaCarta = await puxarCarta();
    if (!ultimaCarta) {
        ultimaCarta = novaCarta;
        return;
    }

    // Compara os valores das cartas e atualiza a pontuação
    if (converterValorCarta(novaCarta.value) > converterValorCarta(ultimaCarta.value)) {
        document.getElementById("mensagem").innerText += " ✅ Você acertou!";
        pontuacao++;
    } else {
        document.getElementById("mensagem").innerText += " ❌ Errou!";
        pontuacao = Math.max(0, pontuacao - 1);
    }
    document.getElementById("placar").innerText = `Pontuação: ${pontuacao}`;
    ultimaCarta = novaCarta; // Atualiza a última carta puxada
}

// Função para adivinhar se a próxima carta é MENOR
async function adivinharMenor() {
    if (!idBaralho) return alert("Inicie o jogo primeiro!");
    
    // Puxa uma nova carta
    const novaCarta = await puxarCarta();
    if (!ultimaCarta) {
        ultimaCarta = novaCarta;
        return;
    }

    // Compara os valores das cartas e atualiza a pontuação
    if (converterValorCarta(novaCarta.value) < converterValorCarta(ultimaCarta.value)) {
        document.getElementById("mensagem").innerText += " ✅ Você acertou!";
        pontuacao++;
    } else {
        document.getElementById("mensagem").innerText += " ❌ Errou!";
        pontuacao = Math.max(0, pontuacao - 1);
    }
    document.getElementById("placar").innerText = `Pontuação: ${pontuacao}`;
    ultimaCarta = novaCarta; // Atualiza a última carta puxada
}

// Função para converter os valores das cartas em números para comparação
function converterValorCarta(valor) {
    const valores = {
        "ACE": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
        "JACK": 11, "QUEEN": 12, "KING": 13
    };
    return valores[valor]; // Retorna o valor numérico correspondente à carta
}

// Função para reiniciar o jogo
async function reiniciarJogo() {
    // Embaralha o baralho novamente
    await fetch(`${apiCartas}/${idBaralho}/shuffle/`);
    document.getElementById("mensagem").innerText = "Baralho reiniciado!";
    document.getElementById("containerCartas").innerHTML = ""; // Limpa a exibição das cartas
    ultimaCarta = null; // Reseta a última carta puxada
    pontuacao = 0; // Reseta a pontuação
    document.getElementById("placar").innerText = `Pontuação: ${pontuacao}`; // Atualiza a pontuação exibida
}