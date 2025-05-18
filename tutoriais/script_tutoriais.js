// Carregamento dinâmico de tutoriais via fetch
const noticiasGrid = document.getElementById('tutoriaisGrid');
const searchInput = document.getElementById('searchInput');
const navLinks = document.querySelectorAll('.wire-nav-link');
let tutoriais = [];
let currentCategory = null;

function renderTutoriais(filterText = '', category = null) {
  let filtered = tutoriais;

  if (category) {
    filtered = filtered.filter(t => t.categoria === category);
  }
  if (filterText) {
    filtered = filtered.filter(t =>
      t.titulo.toLowerCase().includes(filterText.toLowerCase()) ||
      (t.descricao && t.descricao.toLowerCase().includes(filterText.toLowerCase()))
    );
  }

  noticiasGrid.innerHTML = '';

  if (filtered.length === 0) {
    noticiasGrid.innerHTML = `
      <div class="col-12 text-center pt-4 text-muted">
        Nenhum tutorial encontrado.
      </div>`;
    return;
  }

  filtered.forEach(tutorial => {
    const colClass = 'col-lg-4 col-md-6 col-12';
    noticiasGrid.innerHTML += `
      <div class="${colClass}">
        <div class="tutorial-card h-100" tabindex="0" aria-label="Abrir tutorial: ${tutorial.titulo}" data-titulo="${tutorial.titulo}">
          ${tutorial.imagem ? `
            <img src="${tutorial.imagem}" alt="${tutorial.titulo}" class="tutorial-image" />
          ` : `
            <div class="tutorial-image-placeholder"></div>
          `}
          <div class="tutorial-card-body d-flex flex-column">
            <div class="tutorial-category">${tutorial.categoria}</div>
            <div class="tutorial-title">${tutorial.titulo}</div>
            ${tutorial.descricao ? `<div class="tutorial-desc">${tutorial.descricao}</div>` : ''}
            <div class="d-flex justify-content-between align-items-center mt-auto pt-2">
              <div class="tutorial-author">${tutorial.autor}</div>
              <div class="tutorial-date">${tutorial.data}</div>
            </div>
          </div>
        </div>
      </div>`;
  });

  // Adiciona eventos para abrir o tutorial via click e tecla Enter/Espaço
  document.querySelectorAll('.tutorial-card').forEach(card => {
    card.addEventListener('click', () => {
      alert('Abrir tutorial: ' + card.dataset.titulo);
    });
    card.addEventListener('keypress', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });
  });
}

function loadTutoriais() {
  noticiasGrid.innerHTML = `
    <div class='col-12 text-center pt-4 text-muted'>Carregando tutoriais...</div>`;
  
  fetch('tutoriais.json')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao carregar os tutoriais.');
      return response.json();
    })
    .then(data => {
      tutoriais = data;
      renderTutoriais();
    })
    .catch(err => {
      noticiasGrid.innerHTML = `
        <div class='col-12 text-danger text-center pt-4'>
          Falha ao carregar tutoriais.
        </div>`;
      console.error(err);
    });
}

// Event listeners para pesquisa e filtro por categoria
if (searchInput) {
  searchInput.addEventListener('input', () => {
    renderTutoriais(searchInput.value, currentCategory);
  });
}

if (navLinks.length > 0) {
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      currentCategory = link.dataset.category;
      renderTutoriais(searchInput.value, currentCategory);
    });
  });
}

// Inicializa carregando os tutoriais
loadTutoriais();
