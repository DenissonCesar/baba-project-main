let cadastrando = true;
const jogadores = [];
let total_estrelas = 0;
let editandoIndex = null;

function cadastrar() {
  if (!cadastrando && editandoIndex === null) {
    alert("Cadastro finalizado. Não é possível adicionar novos jogadores.");
    return;
  }

  const nome_input = document.getElementById('nomeJogador');
  const estrelas_input = document.getElementById('estrelaJogador');

  const nome = nome_input.value.trim();
  const estrelas = parseInt(estrelas_input.value);

  if (!nome || isNaN(estrelas) || estrelas < 1 || estrelas > 5) {
    alert("Digite um nome e uma quantidade de estrelas válida (1 a 5).");
    return;
  }

  if (editandoIndex !== null) {
    // Modo de edição
    jogadores[editandoIndex].nome = nome;
    jogadores[editandoIndex].estrelas = estrelas;
    atualizarListaJogadores();
    editandoIndex = null;
  } else {
    const jogador = { nome, estrelas };
    jogadores.push(jogador);
    total_estrelas += estrelas;
    adicionarJogadorNaLista(jogador, jogadores.length - 1);
  }

  nome_input.value = "";
  estrelas_input.value = "";
}

function adicionarJogadorNaLista(jogador, index) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span class="nome">${jogador.nome} - ${"⭐".repeat(jogador.estrelas)}</span>
    <div class="acoes">
      <button class="editar" onclick="editarJogador(${index})">✏️</button>
      <button class="deletar" onclick="excluirJogador(${index})">🗑️</button>
    </div>
  `;
  document.getElementById('lista_jogadores').appendChild(li);
}

function atualizarListaJogadores() {
  const lista = document.getElementById('lista_jogadores');
  lista.innerHTML = "";
  jogadores.forEach((jogador, index) => {
    adicionarJogadorNaLista(jogador, index);
  });
}

function editarJogador(index) {
  const jogador = jogadores[index];

  const novoNome = prompt("Editar nome do jogador:", jogador.nome);
  if (novoNome === null) return; // Cancelado

  const novaEstrelaStr = prompt("Editar quantidade de estrelas (1 a 5):", jogador.estrelas);
  if (novaEstrelaStr === null) return; // Cancelado

  const novaEstrela = parseInt(novaEstrelaStr);

  if (!novoNome.trim() || isNaN(novaEstrela) || novaEstrela < 1 || novaEstrela > 5) {
    alert("Valores inválidos. Edição cancelada.");
    return;
  }

  jogador.nome = novoNome.trim();
  total_estrelas -= jogadores[index].estrelas;
  jogador.estrelas = novaEstrela;
  total_estrelas += novaEstrela;

  atualizarListaJogadores();
}

function excluirJogador(index) {
  const jogador = jogadores[index];
  jogadores.splice(index, 1);
  total_estrelas -= jogador.estrelas;
  atualizarListaJogadores();
  alert(`Jogador "${jogador.nome}" foi excluído com sucesso.`);
}

function finalizar() {
  cadastrando = false;
  alert("Cadastro finalizado. Não é possível adicionar novos jogadores.");
  console.log("Jogadores cadastrados:", jogadores); 
  localStorage.setItem("jogadores", JSON.stringify(jogadores))
  window.location.href = 'times.html'; 
}
