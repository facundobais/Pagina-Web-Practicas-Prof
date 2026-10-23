// ==================================================================================
// CARDS
// ==================================================================================
const CARDS = [
  { id:1, title:"Infografia Digital",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link1:"https://canva.link/1t3aa4zwtb4jd5u", link2:"pdf/Infografia Digital - Energia Solar - Bais, Facundo Daniel - Villacorta, Federico Roman.pdf" },
  { id:2, title:"Podcast",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link1:"https://open.spotify.com/episode/5bMLVEvmzW6Cw6uhvpaeZD", link2:"pdf/Podcast - Energia Solar - Bais, Facundo Daniel - Villacorta, Federico Roman.pdf" },
  { id:3, title:"Resvista Digital",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link1:"https://simplebooklet.com/nordicnaturetravelmagazine7", link2:"pdf/Revista Digital - Energia Solar - Bais, Facundo Daniel - Villacorta, Federico Roman.pdf" },
  { id:4, title:"Stream",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link1:"https://www.youtube.com/watch?v=v6UMz-CR8mA", link2:"pdf/Stream - Energia Solar - Bais, Facundo Daniel - Villacorta, Federico Roman.pdf" },
  { id:5, title:"Animacion Digital",
    desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    img:"", link1:"https://view.genially.com/6a852d12e64ea0d1bceef1b5", link2:"pdf/Animación Digital - Energia Solar - Bais, Facundo Daniel - Villacorta, Federico Roman.pdf" },
];

// ==================================================================================
// CONFIGURACIÓN Y VARIABLES
// ==================================================================================
const CARD_W     = 240;
const getExpandedWidth = () => Math.min(window.innerWidth * 0.8, 1000);
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
let isRecentering = false;
let tweenId       = 0;
let mouseX        = 0;
let mouseY        = 0;
let mouseInside   = false;

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
          <div class="btn-row">
            <a class="go-btn" href="${data.link1}" target="_blank" rel="noreferrer">VER TRABAJO</a>
            <a class="go-btn" href="${data.link2}" target="_blank" rel="noreferrer">INFORME</a>
          </div>
      </div>


      <div class="card-glow"></div>
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
buildCards(CARDS, true);

const allCards = track.querySelectorAll('.card');  
halfSetWidth = CARDS.length * (CARD_W + CARD_GAP); 

offset = halfSetWidth;                             // ← arranca en el set del medio
track.style.transform = `translateX(${-offset}px)`;// ← lo aplica antes del primer frame

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

function updateGlow() {
  allCards.forEach(card => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${mouseX - r.left}px`);
    card.style.setProperty('--my', `${mouseY - r.top}px`);
  });
}

wrapper.addEventListener('mouseenter', () => { mouseInside = true; });
wrapper.addEventListener('mouseleave', () => { mouseInside = false; });
wrapper.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  updateGlow();
});

function animate() {
  if (!activeCard && !isHovered && !isRecentering) {
    offset += SPEED;
    if (offset >= halfSetWidth * 2) offset -= halfSetWidth;
    if (offset < halfSetWidth)      offset += halfSetWidth;
    track.style.transform = `translateX(${-offset}px)`;
    
    updateCenterCards();
  }

  //CAMBIO
  if (mouseInside) updateGlow();   

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

  isRecentering = false;
  card.classList.add('active');
  centerCard(card, getExpandedWidth());

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


function tweenOffsetTo(target, duration = 500, onDone) {
  const myId = ++tweenId;            // cancela cualquier tween anterior
  const startOffset = offset;
  const delta = target - startOffset;
  const start = performance.now();

  function step(now) {
    if (myId !== tweenId) return;    // otro tween tomó el control
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    offset = startOffset + delta * eased;
    track.style.transform = `translateX(${-offset}px)`;
    updateCenterCards();

    if (t < 1) requestAnimationFrame(step);
    else if (onDone) onDone();
  }
  requestAnimationFrame(step);
}

function centerCard(card, width, onDone) {
  const target = card.offsetLeft + (width / 2) - (wrapper.offsetWidth / 2);
  tweenOffsetTo(target, 500, onDone);
}

function collapse() {
  if (!activeCard || isAnimating) return;
  isAnimating = true;

  const card = activeCard;           // guardamos la referencia
  card.classList.remove('active');
  allCards.forEach(c => c.classList.remove('dimmed'));
  track.classList.add('no-active');
  activeCard = null;

  // Re-centramos la carta con su ancho normal y recién después seguimos el loop
  isRecentering = true;
  isHovered = false;
  centerCard(card, CARD_W, () => { isRecentering = false; });

  setTimeout(() => { isAnimating = false; }, 600);
}