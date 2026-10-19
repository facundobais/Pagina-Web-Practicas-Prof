// ==================================================================================
// CARDS
// ==================================================================================
const CARDS = [
  { id:1, title:"TITULO1",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link:"#TITULO" },
  { id:2, title:"TITULO2",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link:"#TITULO" },
  { id:3, title:"TITULO3",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link:"#TITULO" },
  { id:4, title:"TITULO4",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link:"#TITULO" },
  { id:5, title:"TITULO5",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link:"#TITULO" },
  { id:6, title:"TITULO6",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link:"#TITULO" },
  { id:7, title:"TITULO7",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link:"#TITULO" },
  { id:8, title:"TITULO8",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=75", link:"#neuro" },
];

// ==================================================================================
// CONFIGURACIÓN Y VARIABLES
// ==================================================================================
const CARD_W     = 240;
const EXPANDED_W = 420;
const CARD_GAP   = 22;   
const SPEED      = 0.4;  

const track    = document.getElementById('carouselTrack');
const wrapper  = document.getElementById('carouselWrapper');

let offset        = 0;
let raf           = null;
let activeCard    = null;
let isAnimating   = false;
let halfSetWidth  = 0; 
let isHovered     = false;

// ==================================================================================
// HTML
// ==================================================================================
function buildCards(dataset, isClone) {
  dataset.forEach(data => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = data.id;
    if (isClone) card.dataset.clone = '1';

    card.innerHTML = `
      <div class="card-img-wrap">
        <img class="card-img" src="${data.img}" alt="${data.title}" loading="lazy"/>
      </div>
      <div class="card-content">
        <h2>${data.title}</h2>
        <p>${data.desc}</p>
        <a class="go-btn" href="${data.link}">
          VER MÁS
        </a>
      </div>
    `;

    // Interacción Mouse
    card.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      if (activeCard) {
        if (activeCard !== card) collapse();
        return; 
      }
      if (card.classList.contains('active')) return;
      e.preventDefault();
      expand(card);
    });

    // Interacción Touch
    card.addEventListener('touchstart', (e) => {
      if (activeCard) {
        if (activeCard !== card) collapse();
        return;
      }
      if (card.classList.contains('active')) return;
      expand(card);
    }, { passive: true });

    track.appendChild(card);
  });
}

// Clon de las tarjetas
buildCards(CARDS, false);
buildCards(CARDS, true);

const allCards = track.querySelectorAll('.card');
halfSetWidth = CARDS.length * (CARD_W + CARD_GAP);

// ==================================================================================
// ANIMACIÓN (LOOP)
// ==================================================================================
track.addEventListener('mouseenter', () => {
  if (!activeCard && !isAnimating) isHovered = true; 
});

track.addEventListener('mouseleave', () => {
  isHovered = false; 
});

function updateCenterCards() {
  const wrapperCenter = wrapper.offsetWidth / 2;

  allCards.forEach(card => {
    const cardCenter = card.offsetLeft + (CARD_W / 2) - offset;
    const distance = Math.abs(cardCenter - wrapperCenter);

    if (distance < 390) {
      card.classList.add('is-center');
    } else {
      card.classList.remove('is-center');
    }
  });
}

function animate() {
  if (!activeCard && !isHovered) {
    offset += SPEED;
    if (offset >= halfSetWidth) offset -= halfSetWidth;
    track.style.transform = `translateX(${-offset}px)`;
    
    updateCenterCards();
  }
  raf = requestAnimationFrame(animate);
}

// Iniciar animación al cargar
updateCenterCards();
raf = requestAnimationFrame(animate);

// ==================================================================================
// INTERACCIONES (MODAL)
// ==================================================================================
function expand(card) {
  if (isAnimating) return;
  isAnimating = true;

  if (activeCard && activeCard !== card) {
    activeCard.classList.remove('active');
  }

  activeCard = card;
  track.classList.remove('no-active');
  
  allCards.forEach(c => {
    if (c !== card) c.classList.add('dimmed');
  });

  card.classList.add('active');
  centerCard(card);

  setTimeout(() => { isAnimating = false; }, 600);
}

function centerCard(card) {
  const cardCenter = card.offsetLeft + (EXPANDED_W / 2);
  const wrapperCenter = wrapper.offsetWidth / 2;
  const target = cardCenter - wrapperCenter;

  const startOffset = offset;
  const delta = target - startOffset;
  const duration = 500; 
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    offset = startOffset + delta * eased;
    track.style.transform = `translateX(${-offset}px)`;
    
    updateCenterCards();
    
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function collapse() {
  if (!activeCard || isAnimating) return;
  isAnimating = true;

  activeCard.classList.remove('active');
  allCards.forEach(c => c.classList.remove('dimmed'));
  track.classList.add('no-active');
  activeCard = null;

  setTimeout(() => { isAnimating = false; }, 600);
}

// Cerrar tarjeta al apretar ESC o hacer clic afuera
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') collapse();
});

document.addEventListener('mousedown', e => {
  if (activeCard) {
    if (!activeCard.contains(e.target)) collapse();
  }
});