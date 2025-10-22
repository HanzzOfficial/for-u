// Simple gallery data: any images placed in images/ will be loaded automatically
const IMAGE_COUNT = 22; // change if you add/remove
const galleryEl = document.getElementById('gallery');
const openBtn = document.getElementById('open-gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('close-lightbox');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const musicOverlay = document.getElementById('music-overlay');
const musicOverlayBtn = document.getElementById('music-overlay-btn');

let currentIndex = 0;
const images = [];
for(let i=1;i<=IMAGE_COUNT;i++){
  images.push(`images/foto-${i}.jpg`);
}

function renderGallery(){
  galleryEl.innerHTML = '';
  images.forEach((src, i)=>{
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Foto ${i+1}`;
    img.className = 'thumb';
    img.dataset.index = i;
    img.onerror = ()=>{ img.src = placeholderDataUri(); };
    img.addEventListener('click', ()=> openLightbox(i));
    galleryEl.appendChild(img);
  });
}

function openLightbox(i){
  currentIndex = i;
  lightboxImg.src = images[i];
  lightboxCaption.textContent = `Foto ${i+1} - Untuk Awaa ❤️`;
  lightbox.classList.remove('hidden');
  lightbox.setAttribute('aria-hidden','false');
  // pulse animation
  lightboxImg.classList.remove('pulse');
  void lightboxImg.offsetWidth;
  lightboxImg.classList.add('pulse');
  // heart burst
  triggerHeartBurst();
}

function closeLightbox(){
  lightbox.classList.add('hidden');
  lightbox.setAttribute('aria-hidden','true');
}

function prev(){
  currentIndex = (currentIndex -1 + images.length) % images.length;
  openLightbox(currentIndex);
}

function next(){
  currentIndex = (currentIndex +1) % images.length;
  openLightbox(currentIndex);
}

openBtn.addEventListener('click', ()=>{ window.scrollTo({top:document.querySelector('.gallery-preview').offsetTop - 20, behavior:'smooth'}); });
closeBtn.addEventListener('click', closeLightbox);
// close when clicking overlay
const overlay = document.getElementById('lightbox-overlay');
overlay.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
// Music toggle logic
let musicEnabled = false;
function updateMusicButton(){
  musicToggle.textContent = musicEnabled ? '🔊 Musik (On)' : '🔈 Musik (Off)';
  musicToggle.classList.toggle('active', musicEnabled);
}
musicToggle.addEventListener('click', ()=>{
  musicEnabled = !musicEnabled;
  try{ if(musicEnabled) bgMusic.play(); else bgMusic.pause(); }catch(e){}
  updateMusicButton();
});

// Start music on first user interaction (mobile autoplay policy)
function enableMusicOnInteraction(){
  if(musicEnabled) return;
  musicEnabled = true;
  try{ bgMusic.play(); }catch(e){}
  updateMusicButton();
  window.removeEventListener('click', enableMusicOnInteraction);
  window.removeEventListener('touchstart', enableMusicOnInteraction);
}
window.addEventListener('click', enableMusicOnInteraction);
window.addEventListener('touchstart', enableMusicOnInteraction);

// Attempt autoplay with muted audio first (browsers allow this), then try to unmute
async function tryAutoplayUnmute(){
  // Start playing muted so browsers allow autoplay. Then show an explicit overlay
  // asking the user to unmute so audible playback can start.
  try{
    bgMusic.muted = true;
    bgMusic.volume = 0.7;
    await bgMusic.play();
    musicEnabled = true;
    updateMusicButton();
  }catch(e){
    // ignore play error — we'll still show overlay for manual start
  }
  // Show overlay asking user to enable sound (more reliable UX)
  musicOverlay.classList.remove('hidden');
  musicOverlay.setAttribute('aria-hidden','false');
}

musicOverlayBtn.addEventListener('click', async ()=>{
  try{
    bgMusic.muted = false;
    await bgMusic.play();
    musicOverlay.classList.add('hidden');
    musicOverlay.setAttribute('aria-hidden','true');
    musicEnabled = true;
    updateMusicButton();
  }catch(e){
    // fallback: still muted
    bgMusic.muted = true;
    try{ await bgMusic.play(); }catch(_){}
    musicOverlay.classList.add('hidden');
    musicOverlay.setAttribute('aria-hidden','true');
    musicEnabled = true;
    updateMusicButton();
  }
});

// Kick off autoplay attempt on load
window.addEventListener('load', ()=> tryAutoplayUnmute());
window.addEventListener('keydown', (e)=>{
  if(lightbox.classList.contains('hidden')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') prev();
  if(e.key === 'ArrowRight') next();
});

// placeholder tiny SVG data URI for missing images
function placeholderDataUri(){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect fill='#ffeef8' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#ff6fa3' font-size='28'>Foto belum tersedia</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// small confetti hearts when page loads
function launchHearts(count=30){
  for(let i=0;i<count;i++){
    const el = document.createElement('div');
    el.textContent = '💖';
    el.style.position = 'fixed';
    el.style.left = Math.random()*100 + '%';
    el.style.top = '-10px';
    el.style.fontSize = `${8 + Math.random()*20}px`;
    el.style.pointerEvents = 'none';
    el.style.opacity = '0.95';
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    el.style.transition = `transform 4s linear, top 4s linear, opacity 1.2s linear`;
    document.body.appendChild(el);
    setTimeout(()=>{ el.style.top = 90 + Math.random()*30 + '%'; el.style.transform = `rotate(${Math.random()*360}deg) scale(.9)`; el.style.opacity='0.6'; }, 50 + Math.random()*500);
    setTimeout(()=> el.remove(), 5200);
  }
}

// Floating balloons/hearts in background
function spawnFloats(count=12){
  const wrap = document.createElement('div');
  wrap.className = 'float-wrap';
  document.body.appendChild(wrap);
  for(let i=0;i<count;i++){
    const f = document.createElement('div');
    f.className = 'float';
    f.textContent = Math.random() > 0.4 ? '🎈' : '💗';
    f.style.left = (Math.random()*100) + '%';
    f.style.fontSize = `${12 + Math.random()*36}px`;
    f.style.animationDuration = `${8 + Math.random()*8}s`;
    f.style.animationDelay = `${Math.random()*6}s`;
    wrap.appendChild(f);
  }
}

function triggerHeartBurst(){
  const hb = document.getElementById('heart-burst');
  hb.innerHTML = '';
  const total = 8 + Math.floor(Math.random()*6);
  for(let i=0;i<total;i++){
    const d = document.createElement('div');
    d.className = 'h';
    d.textContent = '💖';
    d.style.left = (Math.random()*60 - 30) + 'px';
    d.style.fontSize = `${12 + Math.random()*24}px`;
    d.style.animation = `heartFly ${0.9 + Math.random()*0.7}s ease-out forwards`;
    d.style.transform = `translateY(0) scale(${0.6 + Math.random()*0.7})`;
    hb.appendChild(d);
  }
  setTimeout(()=> hb.innerHTML = '', 1600);
}

// Initialize
renderGallery();
window.addEventListener('load', ()=> launchHearts(28));
window.addEventListener('load', ()=> spawnFloats(14));
