const emojis = ['😊', '😍', '🤩', '😎', '🥳'];
const cards = document.querySelectorAll('.card');
const tentativasEl = document.getElementById('tentativas');
const acertosEl = document.getElementById('acertos');
const desempenhoEl = document.getElementById('desempenho');
const resetBtn = document.getElementById('reset-btn');
const newGameBtn = document.getElementById('newgame-btn');

let tentativas = 0;
let acertos = 0;
let emojiCorreto = '';
let cartaCorretaIndex = -1;
const maxTentativas = 5;
let rodadaFinalizada = false;

// Inicia o jogo zerando estatísticas e preparando rodada
function initGame() {
  tentativas = 0;
  acertos = 0;
  updateStats();
  prepararRodada();
  newGameBtn.disabled = true;
  resetBtn.disabled = true;
}

// Prepara uma nova rodada: sorteia emoji e carta correta, reseta cartas e eventos
function prepararRodada() {
  emojiCorreto = emojis[Math.floor(Math.random() * emojis.length)];
  cartaCorretaIndex = Math.floor(Math.random() * cards.length);
  rodadaFinalizada = false;

  cards.forEach((card, index) => {
    card.classList.remove('flipped', 'acertou', 'erro');
    card.querySelector('.card-back').textContent = '';
    card.addEventListener('click', handleClick);
  });

  resetBtn.disabled = true;
  newGameBtn.disabled = true;
}

// Evento ao clicar em uma carta
function handleClick() {
  if (rodadaFinalizada || this.classList.contains('flipped')) return;

  const cardIndex = parseInt(this.dataset.id);
  const isAcerto = cardIndex === cartaCorretaIndex;

  this.classList.add('flipped');
  rodadaFinalizada = true;

  setTimeout(() => {
    cards.forEach((card, index) => {
      const cardBack = card.querySelector('.card-back');
      if (index === cartaCorretaIndex) {
        cardBack.textContent = emojiCorreto;
        card.classList.add('acertou');
      } else {
        cardBack.textContent = '❌';
        card.classList.add('erro');
      }
      card.classList.add('flipped');
      card.removeEventListener('click', handleClick);
    });

    if (isAcerto) acertos++;
    tentativas++;

    updateStats();

    if (tentativas >= maxTentativas) {
      newGameBtn.disabled = false; // libera botão novo jogo
      resetBtn.disabled = true;
    } else {
      resetBtn.disabled = false; // libera botão reset
      newGameBtn.disabled = true;
    }
  }, 600); // tempo da animação do CSS
}

// Atualiza os números e cores das estatísticas na tela
function updateStats() {
  tentativasEl.textContent = tentativas;
  acertosEl.textContent = acertos;

  const taxa = tentativas > 0 ? Math.round((acertos / tentativas) * 100) : 0;
  desempenhoEl.textContent = `${taxa}%`;
  desempenhoEl.style.color = taxa >= 70 ? '#4CAF50' : taxa >= 40 ? '#FFC107' : '#F44336';
}

// Reseta a rodada atual (sem zerar estatísticas)
function resetGame() {
  if (tentativas >= maxTentativas) return;
  prepararRodada();
}

// Inicia um novo jogo (zera estatísticas e inicia rodada)
function newGame() {
  initGame();
}

// Event listeners dos botões
resetBtn.addEventListener('click', resetGame);
newGameBtn.addEventListener('click', newGame);

// Inicializa o jogo na carga da página
initGame();
