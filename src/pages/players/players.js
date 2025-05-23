let cadastrando = true;
const jogadores = [];
let total_estrelas = 0

function cadastrar() {
  if (!cadastrando) {
    alert("Cadastro finalizado. Não é possível adicionar novos jogadores.");
    return;
  }

  const nome_input = document.getElementById('nomeJogador');
  const estrelas_input = document.getElementById('estrelaJogador');
  

  const nome = nome_input.value.trim();
  const estrelas = parseInt(estrelas_input.value);
  
  total_estrelas += estrelas

  if (nome && estrelas >= 1 && estrelas <= 5) {
    const jogador = { nome, estrelas };
    jogadores.push(jogador);

    const li = document.createElement('li');
    li.textContent = `${nome} - ${"⭐".repeat(estrelas)}`;
    document.getElementById('lista_jogadores').appendChild(li);

    nome_input.value = "";
    estrelas_input.value = "";

    console.log("Jogador cadastrado:", jogador);
  } else {
    alert("Digite um nome e uma quantidade de estrelas válida (1 a 5).");
  }
}



function finalizar() {
  cadastrando = false;
  alert("Cadastro finalizado. Não é possível adicionar novos jogadores.");
  console.log("Jogadores cadastrados:", jogadores); 
  localStorage.setItem("jogadores", JSON.stringify(jogadores))
  window.location.href = '../times/times.html' 
}

