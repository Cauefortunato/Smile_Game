const emojis = ['😊', '😍', '🤩', '😎', '🥳'];
const cardsGrid = document.querySelector('.cards-grid');
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
let cards = [];

// Inicializa o jogo
function initGame() {
  tentativas = 0;
  acertos = 0;
  generateCards();
  updateStats();
  startNewRound();
}

// Gera as cartas dinamicamente
function generateCards() {
  cardsGrid.innerHTML = emojis.map((_, index) => `
    <div class="card" data-id="${index}">
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back"></div>
      </div>
    </div>
  `).join('');
  
  cards = document.querySelectorAll('.card');
}

// Inicia uma nova rodada
function startNewRound() {
  emojiCorreto = emojis[Math.floor(Math.random() * emojis.length)];
  cartaCorretaIndex = Math.floor(Math.random() * cards.length);
  rodadaFinalizada = false;

  resetCards();
  updateButtons();
}

// Reseta o estado das cartas
function resetCards() {
  cards.forEach(card => {
    card.classList.remove('flipped', 'acertou', 'erro');
    card.querySelector('.card-back').textContent = '';
    card.addEventListener('click', handleClick);
  });
}

// Atualiza o estado dos botões
function updateButtons() {
  newGameBtn.disabled = false;
  resetBtn.disabled = tentativas >= maxTentativas;
}

// Manipula o clique nas cartas
function handleClick() {
  if (rodadaFinalizada || this.classList.contains('flipped')) return;

  this.classList.add('flipped');
  rodadaFinalizada = true;

  const cardIndex = parseInt(this.dataset.id);
  const isAcerto = cardIndex === cartaCorretaIndex;

  setTimeout(() => {
    revealAllCards(isAcerto);
    
    if (isAcerto) acertos++;
    tentativas++;
    
    updateStats();
    updateButtons();
  }, 600);
}

// Revela todas as cartas
function revealAllCards(isAcerto) {
  cards.forEach((card, index) => {
    const cardBack = card.querySelector('.card-back');
    cardBack.textContent = index === cartaCorretaIndex ? emojiCorreto : '❌';
    card.classList.add('flipped', index === cartaCorretaIndex ? 'acertou' : 'erro');
    card.removeEventListener('click', handleClick);
  });
}

// Atualiza as estatísticas
function updateStats() {
  tentativasEl.textContent = tentativas;
  acertosEl.textContent = acertos;

  const taxa = tentativas > 0 ? Math.round((acertos / tentativas) * 100) : 0;
  desempenhoEl.textContent = `${taxa}%`;
  desempenhoEl.style.color = taxa >= 70 ? '#4CAF50' : taxa >= 40 ? '#FFC107' : '#F44336';
}

// Event listeners
resetBtn.addEventListener('click', () => {
  if (tentativas >= maxTentativas) return;
  startNewRound();
});

newGameBtn.addEventListener('click', initGame);

// Inicializa o jogo
initGame();