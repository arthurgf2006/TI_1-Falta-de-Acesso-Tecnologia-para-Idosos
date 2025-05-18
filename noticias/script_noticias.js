// Carregamento dinâmico de notícias via fetch
const noticiasGrid = document.getElementById('noticiasGrid');
const searchInput = document.getElementById('searchInput');
const navLinks = document.querySelectorAll('.wire-nav-link');
let noticias = [];
let currentCategory = null;

function renderNoticias(filterText = '', category = null) {
  let filtered = noticias;

  if (category) {
    filtered = filtered.filter(n => n.categoria === category);
  }
  if (filterText) {
    filtered = filtered.filter(n =>
      n.titulo.toLowerCase().includes(filterText.toLowerCase()) ||
      (n.descricao && n.descricao.toLowerCase().includes(filterText.toLowerCase()))
    );
  }

  noticiasGrid.innerHTML = '';

  if (filtered.length === 0) {
    noticiasGrid.innerHTML = `
      <div class="col-12 text-center pt-4 text-muted">
        Nenhuma notícia encontrada.
      </div>`;
    return;
  }

  filtered.forEach(noticia => {
    const colClass = 'col-lg-4 col-md-6 col-12';
    noticiasGrid.innerHTML += `
      <div class="${colClass}">
        <div class="tutorial-card h-100" tabindex="0" aria-label="Abrir notícia: ${noticia.titulo}" data-titulo="${noticia.titulo}">
          ${noticia.imagem ? `
            <img src="${noticia.imagem}" alt="${noticia.titulo}" class="tutorial-image" />
          ` : `
            <div class="tutorial-image-placeholder"></div>
          `}
          <div class="tutorial-card-body d-flex flex-column">
            <div class="tutorial-category">${noticia.categoria}</div>
            <div class="tutorial-title">${noticia.titulo}</div>
            ${noticia.descricao ? `<div class="tutorial-desc">${noticia.descricao}</div>` : ''}
            <div class="d-flex justify-content-between align-items-center mt-auto pt-2">
              <div class="tutorial-author">${noticia.autor}</div>
              <div class="tutorial-date">${noticia.data}</div>
            </div>
          </div>
        </div>
      </div>`;
  });

  // Adiciona eventos para abrir a notícia via click e tecla Enter/Espaço
  document.querySelectorAll('.tutorial-card').forEach(card => {
    card.addEventListener('click', () => {
      alert('Abrir notícia: ' + card.dataset.titulo);
    });
    card.addEventListener('keypress', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });
  });
}

function loadNoticias() {
  noticiasGrid.innerHTML = `
    <div class='col-12 text-center pt-4 text-muted'>Carregando notícias...</div>`;
  
  fetch('noticias.json')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao carregar as notícias.');
      return response.json();
    })
    .then(data => {
      noticias = data;
      renderNoticias();
    })
    .catch(err => {
      noticiasGrid.innerHTML = `
        <div class='col-12 text-danger text-center pt-4'>
          Falha ao carregar notícias.
        </div>`;
      console.error(err);
    });
}

// Event listeners para pesquisa e filtro por categoria
if (searchInput) {
  searchInput.addEventListener('input', () => {
    renderNoticias(searchInput.value, currentCategory);
  });
}

if (navLinks.length > 0) {
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      currentCategory = link.dataset.category;
      renderNoticias(searchInput.value, currentCategory);
    });
  });
}

// Inicializa carregando as notícias
loadNoticias();
