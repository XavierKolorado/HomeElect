document.addEventListener('DOMContentLoaded', () => {

  /* Ano no rodapé */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Cabeçalho: muda de estilo ao rolar ===== */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ===== Menu mobile ===== */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ===== Revelar elementos ao rolar ===== */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 70}ms`;
    io.observe(el);
  });

  /* =========================================================
     GALERIA DE PROJETOS
     Os itens abaixo usam gradientes de estúdio como placeholder
     visual. Basta trocar "img" por uma URL de foto real do
     projeto (ex: 'fotos/cozinha-01.jpg') que o layout se ajusta
     automaticamente.
     ========================================================= */
  const projects = [
    { cat: 'cozinhas',    label: 'Cozinha Integrada — Carvalho Fosco', tone: ['#3B2A20', '#6B4A30'], size: 'wide' },
    { cat: 'quartos',     label: 'Quarto Casal — Painel Ripado',       tone: ['#2A2420', '#544230'], size: 'tall' },
    { cat: 'salas',       label: 'Sala de Estar — Estante Suspensa',   tone: ['#463527', '#8A6238'] },
    { cat: 'closets',     label: 'Closet Ilha Central',                tone: ['#5C3A28', '#93613B'] },
    { cat: 'escritorios', label: 'Home Office — Bancada Contínua',     tone: ['#2E2721', '#5C4633'] },
    { cat: 'cozinhas',    label: 'Cozinha Gourmet — Ilha em Nogueira', tone: ['#33251B', '#7A5233'] },
    { cat: 'quartos',     label: 'Suíte Master — Guarda-roupa de Correr', tone: ['#4A3624', '#8A6238'], size: 'wide' },
    { cat: 'salas',       label: 'Painel de TV — Mogno Fosco',         tone: ['#432A1D', '#6B3A2A'] },
    { cat: 'closets',     label: 'Closet Feminino — Vitrine em Vidro', tone: ['#38312B', '#6E5A44'], size: 'tall' },
    { cat: 'escritorios', label: 'Escritório Comercial — Recepção',    tone: ['#2A241F', '#59462F'] },
    { cat: 'salas',       label: 'Living Integrado — Buffet Baixo',    tone: ['#2E2721', '#8A6238'] },
    { cat: 'cozinhas',    label: 'Cozinha Compacta — Preto e Carvalho',tone: ['#15120F', '#5C3A28'] },
  ];

  const grid = document.getElementById('galleryGrid');
  const frag = document.createDocumentFragment();

  projects.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item reveal' + (p.size ? ` g-${p.size}` : '');
    item.dataset.category = p.cat;
    item.dataset.index = i;
    item.style.transitionDelay = `${(i % 4) * 60}ms`;
    item.innerHTML = `
      <div class="g-inner" style="background:linear-gradient(155deg, ${p.tone[0]}, ${p.tone[1]})"></div>
      <span class="g-label">${p.label}</span>
    `;
    frag.appendChild(item);
    io.observe(item);
  });
  grid.appendChild(frag);

  /* ===== Filtro da galeria ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hide', !match);
      });
    });
  });

  /* ===== Lightbox ===== */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const p = projects[currentIndex];
    lightboxContent.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(155deg, ${p.tone[0]}, ${p.tone[1]});display:flex;align-items:flex-end;padding:28px;">
      <span style="font-family:'JetBrains Mono',monospace;color:#F7F3EC;font-size:0.85rem;letter-spacing:.05em;text-transform:uppercase;">${p.label}</span>
    </div>`;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showRelative(step) {
    currentIndex = (currentIndex + step + projects.length) % projects.length;
    openLightbox(currentIndex);
  }

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item || item.classList.contains('hide')) return;
    openLightbox(Number(item.dataset.index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showRelative(-1));
  lightboxNext.addEventListener('click', () => showRelative(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showRelative(1);
    if (e.key === 'ArrowLeft') showRelative(-1);
  });

});
