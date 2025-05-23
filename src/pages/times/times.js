window.addEventListener("DOMContentLoaded", function () {
  const jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];
  console.log(jogadores);

  const header = document.getElementById("header");
  const btnGerarTimes = document.getElementById("btnGerarTimes");
  const listaTimes = document.getElementById("lista_times");
  const divJogadores = document.getElementById("times_add");

  if (!btnGerarTimes || !listaTimes) {
    console.error("Elemento(s) não encontrado(s): btnGerarTimes ou lista_times.");
    return;
  }

  btnGerarTimes.addEventListener("click", gerarTimes);

  function gerarTimes() {
    const jogadoresSalvos = JSON.parse(localStorage.getItem("jogadores")) || [];
    const jogadoresPorTime = parseInt(document.getElementById("numero_jogadores").value);

    if (jogadoresSalvos.length === 0 || jogadoresPorTime <= 0) {
      alert("Certifique-se de ter jogadores cadastrados e de informar um número válido.");
      return;
    }

    const jogadores = [...jogadoresSalvos];
    for (let i = jogadores.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [jogadores[i], jogadores[j]] = [jogadores[j], jogadores[i]];
    }

    jogadores.sort((a, b) => b.estrelas - a.estrelas);

    const totalJogadores = jogadores.length;
    const numTimes = Math.ceil(totalJogadores / jogadoresPorTime);
    const times = new Array(numTimes).fill().map(() => []);

    let direcao = 1;
    let timeIndex = 0;

    for (const jogador of jogadores) {
      times[timeIndex].push(jogador);

      if (timeIndex === 0) direcao = 1;
      else if (timeIndex === numTimes - 1) direcao = -1;

      timeIndex += direcao;
    }

    listaTimes.innerHTML = "";

    times.forEach((time, i) => {
      const estrelasTime = time.reduce((acc, j) => acc + j.estrelas, 0);
      const li = document.createElement("li");
      li.innerHTML =
        `<strong>Time ${i + 1}</strong> (${estrelasTime}⭐): ` +
        time.map((j) => `${j.nome} (${j.estrelas}⭐)`).join(", ");
      listaTimes.appendChild(li);
    });

    let botaoExtra = document.getElementById("botaoGerarNovamente");
    if (!botaoExtra) {
      botaoExtra = document.createElement("button");
      botaoExtra.id = "botaoGerarNovamente";
      botaoExtra.textContent = "🔁 Gerar Novos Times";
      botaoExtra.style.marginTop = "10px";
      listaTimes.appendChild(botaoExtra);
      botaoExtra.addEventListener("click", gerarTimes);
    } else {
      listaTimes.appendChild(botaoExtra);
    }

    const btnTempo = document.createElement("h2");
    btnTempo.innerHTML = "Tempo de partida:";
    btnTempo.id = "btnTempo";

    const inputTempo = document.createElement("input");
    inputTempo.id = "inputTempo";
    inputTempo.placeholder = "00:00";

    listaTimes.appendChild(btnTempo);
    listaTimes.appendChild(inputTempo);

    const btnComecar = document.createElement("button");
    btnComecar.textContent = "Começar";
    btnComecar.id = "btnComecar";

    listaTimes.appendChild(btnComecar);

    btnComecar.addEventListener("click", function () {
      listaTimes.innerHTML += `<p>Preparando contagem...</p>`;
      let contador = 3;
      const contagem_regressiva = document.createElement("p");
      contagem_regressiva.textContent = contador;
      listaTimes.appendChild(contagem_regressiva);

      const intervalo = setInterval(() => {
        contador--;
        if (contador > 0) {
          contagem_regressiva.textContent = contador;
        } else {
          clearInterval(intervalo);
          contagem_regressiva.textContent = `Iniciando jogos!`;
          iniciarJogos(times, inputTempo.value);
        }
      }, 1000);
    });
  }

  function iniciarJogos(times, tempoDigitado = "00:00") {
    header.remove();
    listaTimes.innerHTML = "<h3>Confronto Atual</h3>";
    const fila = [...times];
    const timeAtual = fila.shift();
    novoReiDaMesa(timeAtual, fila, times, tempoDigitado);
  }

  let ultimoRei = null;
  let ultimoDesafiante = null;

  function novoReiDaMesa(rei, fila, times, tempoDigitado) {
    if (fila.length === 0) {
      listaTimes.innerHTML += "<p>⚠️ Sem mais times para desafiar.</p>";
      return;
    }

    const desafiante = fila.shift();
    const confrontoEl = document.createElement("div");

    function listarJogadores(time) {
      return time.map(j => `${j.nome} (${j.estrelas}⭐)`).join(", ");
    }

    confrontoEl.innerHTML = `
      <p><strong>Time Atual (Rei):</strong> ${listarJogadores(rei)}</p>
      <p><strong>Desafiante:</strong> ${listarJogadores(desafiante)}</p>
      <button id="vitoriaRei">Time 1 venceu</button>
      <button id="vitoriaDesafiante">Time 2 venceu</button>
      <button id="empate">Empate</button>
      <button id="finalizarJogo" style="margin-left: 10px;">Finalizar Jogo</button>
    `;

    listaTimes.appendChild(confrontoEl);

    const cronometroEl = document.createElement("p");
    cronometroEl.id = "cronometro";
    listaTimes.appendChild(cronometroEl);

    const controles = document.createElement("div");
    const btnPausar = document.createElement("button");
    const btnRetomar = document.createElement("button");
    const btnReiniciar = document.createElement("button");

    btnPausar.textContent = "Pausar";
    btnRetomar.textContent = "Retomar";
    btnReiniciar.textContent = "Reiniciar";

    controles.appendChild(btnPausar);
    controles.appendChild(btnRetomar);
    controles.appendChild(btnReiniciar);
    listaTimes.appendChild(controles);

    const [min, sec] = tempoDigitado.split(":").map(Number);
    let tempoRestante = (min * 60) + sec;
    let tempoInicial = tempoRestante;
    let intervaloCronometro = null;

    function atualizarDisplay() {
      const minutos = String(Math.floor(tempoRestante / 60)).padStart(2, "0");
      const segundos = String(tempoRestante % 60).padStart(2, "0");
      cronometroEl.textContent = `⏳ ${minutos}:${segundos}`;
    }

    function iniciarContagem() {
      if (intervaloCronometro !== null) return;
      intervaloCronometro = setInterval(() => {
        if (tempoRestante <= 0) {
          clearInterval(intervaloCronometro);
          intervaloCronometro = null;
          cronometroEl.textContent = "⏱️ Tempo esgotado!";
          return;
        }
        tempoRestante--;
        atualizarDisplay();
      }, 1000);
    }

    function pausarContagem() {
      clearInterval(intervaloCronometro);
      intervaloCronometro = null;
    }

    function reiniciarContagem() {
      tempoRestante = tempoInicial;
      atualizarDisplay();
      iniciarContagem();
    }

    atualizarDisplay();
    iniciarContagem();

    btnPausar.addEventListener("click", pausarContagem);
    btnRetomar.addEventListener("click", iniciarContagem);
    btnReiniciar.addEventListener("click", () => {
      pausarContagem();
      reiniciarContagem();
    });

    document.getElementById("vitoriaRei").addEventListener("click", () => {
      alert("🏆 Time 1 venceu e continua!");
      confrontoEl.remove();
      cronometroEl.remove();
      controles.remove();
      fila.push(desafiante);
      novoReiDaMesa(rei, fila, times, tempoDigitado);
      pausarContagem();
    });

    document.getElementById("vitoriaDesafiante").addEventListener("click", () => {
      alert("⚔️ Time 2 venceu e assume o lugar!");
      confrontoEl.remove();
      cronometroEl.remove();
      controles.remove();
      fila.push(rei);
      novoReiDaMesa(desafiante, fila, times, tempoDigitado);
      pausarContagem();
    });

    document.getElementById("empate").addEventListener("click", () => {
      alert("🤝 Empate! Novos times vão entrar.");
      confrontoEl.remove();
      cronometroEl.remove();
      controles.remove();
      pausarContagem();

      const candidatos = times.filter(
        t => t !== rei && t !== desafiante && t !== ultimoRei && t !== ultimoDesafiante
      );

      let novaFila = candidatos;
      if (novaFila.length < 2) {
        novaFila = times.filter(t => t !== rei && t !== desafiante);
      }

      if (novaFila.length < 2) {
        listaTimes.innerHTML += `<p>⚠️ Não há times suficientes para continuar após empate.</p>`;
        return;
      }

      for (let i = novaFila.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [novaFila[i], novaFila[j]] = [novaFila[j], novaFila[i]];
      }

      const novoTime1 = novaFila[0];
      const novoTime2 = novaFila[1];
      novoReiDaMesa(novoTime1, times.filter(t => t !== novoTime1 && t !== novoTime2), times, tempoDigitado);
    });

    document.getElementById("finalizarJogo").addEventListener("click", () => {
      confrontoEl.remove();
      cronometroEl.remove();
      controles.remove();
      pausarContagem();
      listaTimes.innerHTML = `
        <h2>✅ Jogo Finalizado</h2>
        <p>Último time vencedor: ${listarJogadores(rei)}</p>
      `;
    });

    ultimoRei = rei;
    ultimoDesafiante = desafiante;
  }
});

