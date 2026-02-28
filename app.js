/* =======================================================
   SCTEC — app.js
   CRUD completo com localStorage
   ======================================================= */

'use strict';

/* ---------- CONSTANTS ---------- */
const STORAGE_KEY = 'sctec_empreendimentos';
const THEME_KEY = 'sctec_theme';

const SEGMENT_ICONS = {
    'Tecnologia': '💻',
    'Comércio': '🛍️',
    'Indústria': '🏭',
    'Serviços': '🤝',
    'Agronegócio': '🌾',
};

/* ---------- STATE ---------- */
let empreendimentos = [];
let deleteTargetId = null;
let currentView = 'list';

/* ---------- THEME ---------- */
function applyTheme(isLight) {
    document.body.classList.toggle('light', isLight);

    // Sidebar icons
    const iconLight = document.getElementById('icon-light');
    const iconDark = document.getElementById('icon-dark');
    const label = document.getElementById('theme-label');
    if (iconLight) iconLight.style.display = isLight ? '' : 'none';
    if (iconDark) iconDark.style.display = isLight ? 'none' : '';
    if (label) label.textContent = isLight ? 'Modo Claro' : 'Modo Escuro';

    // Mobile icons
    const mIconLight = document.getElementById('mobile-icon-light');
    const mIconDark = document.getElementById('mobile-icon-dark');
    if (mIconLight) mIconLight.style.display = isLight ? '' : 'none';
    if (mIconDark) mIconDark.style.display = isLight ? 'none' : '';
}

function toggleTheme() {
    const isNowLight = !document.body.classList.contains('light');
    localStorage.setItem(THEME_KEY, isNowLight ? 'light' : 'dark');
    applyTheme(isNowLight);
}

/* ---------- PERSISTENCE ---------- */
function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        empreendimentos = raw ? JSON.parse(raw) : [];
    } catch {
        empreendimentos = [];
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empreendimentos));
}

/* ---------- ID GENERATOR ---------- */
function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------- STATS ---------- */
function updateStats() {
    const total = empreendimentos.length;
    const ativos = empreendimentos.filter(e => e.status === 'Ativo').length;
    const inativos = total - ativos;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-ativos').textContent = ativos;
    document.getElementById('stat-inativos').textContent = inativos;
}

/* ---------- VIEWS ---------- */
function showView(view) {
    currentView = view;
    document.getElementById('view-list').classList.toggle('hidden', view !== 'list');
    document.getElementById('view-add').classList.toggle('hidden', view !== 'add');

    // Nav highlight
    document.getElementById('nav-list').classList.toggle('active', view === 'list');
    document.getElementById('nav-add').classList.toggle('active', view === 'add');

    if (view === 'list') {
        renderCards(getFiltered());
    }

    // Close sidebar on mobile when navigating
    if (window.innerWidth <= 768) closeSidebar();
}

/* ---------- FILTERS ---------- */
function getFiltered() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const segmento = document.getElementById('filter-segmento').value;
    const status = document.getElementById('filter-status').value;

    return empreendimentos.filter(e => {
        const matchSearch = !query ||
            e.nome.toLowerCase().includes(query) ||
            e.empreendedor.toLowerCase().includes(query) ||
            e.municipio.toLowerCase().includes(query) ||
            e.contato.toLowerCase().includes(query);

        const matchSegmento = !segmento || e.segmento === segmento;
        const matchStatus = !status || e.status === status;

        return matchSearch && matchSegmento && matchStatus;
    });
}

function applyFilters() {
    renderCards(getFiltered());
}

function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-segmento').value = '';
    document.getElementById('filter-status').value = '';
    renderCards(empreendimentos);
}

/* ---------- HELPERS ---------- */
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ---------- RENDER ---------- */
function renderCards(list) {
    const grid = document.getElementById('cards-grid');
    const empty = document.getElementById('empty-state');

    grid.innerHTML = '';

    if (list.length === 0) {
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    list.forEach((e, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${i * 0.04}s`;

        const icon = SEGMENT_ICONS[e.segmento] || '🏢';
        const statusClass = e.status === 'Ativo' ? 'tag-status-ativo' : 'tag-status-inativo';
        const statusDot = e.status === 'Ativo' ? '●' : '○';

        card.innerHTML = `
      <div class="card-header">
        <div class="card-avatar" title="${e.segmento}">${icon}</div>
        <div class="card-actions">
          <button class="btn-icon btn-icon-edit" title="Editar" onclick="openEdit('${e.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn-icon btn-icon-delete" title="Excluir" onclick="openDeleteModal('${e.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="card-title">${escHtml(e.nome)}</div>
      <div class="card-empreendedor">
        <svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        ${escHtml(e.empreendedor)}
      </div>
      <div class="card-tags">
        <span class="tag tag-segmento">${icon} ${escHtml(e.segmento)}</span>
        <span class="tag tag-municipio">📍 ${escHtml(e.municipio)}</span>
        <span class="tag ${statusClass}">${statusDot} ${escHtml(e.status)}</span>
      </div>
      <div class="card-contato">
        <svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        ${escHtml(e.contato)}
      </div>
    `;
        grid.appendChild(card);
    });
}

/* ---------- CREATE ---------- */
function openAdd() {
    resetForm();
    document.getElementById('form-title').textContent = 'Novo Empreendimento';
    document.getElementById('btn-submit').innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px"><polyline points="20 6 9 17 4 12"/></svg>
    Salvar Empreendimento
  `;
    showView('add');
}

/* ---------- EDIT ---------- */
function openEdit(id) {
    const emp = empreendimentos.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('form-id').value = emp.id;
    document.getElementById('f-nome').value = emp.nome;
    document.getElementById('f-empreendedor').value = emp.empreendedor;
    document.getElementById('f-municipio').value = emp.municipio;
    document.getElementById('f-segmento').value = emp.segmento;
    document.getElementById('f-contato').value = emp.contato;

    if (emp.status === 'Ativo') {
        document.getElementById('status-ativo').checked = true;
    } else {
        document.getElementById('status-inativo').checked = true;
    }

    document.getElementById('form-title').textContent = 'Editar Empreendimento';
    document.getElementById('btn-submit').innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px"><polyline points="20 6 9 17 4 12"/></svg>
    Atualizar Empreendimento
  `;
    showView('add');
}

/* ---------- SUBMIT (create or update) ---------- */
function handleSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('form-id').value;
    const nome = document.getElementById('f-nome').value.trim();
    const empreendedor = document.getElementById('f-empreendedor').value.trim();
    const municipio = document.getElementById('f-municipio').value;
    const segmento = document.getElementById('f-segmento').value;
    const contato = document.getElementById('f-contato').value.trim();
    const status = document.querySelector('input[name="status"]:checked')?.value || 'Ativo';

    if (!nome || !empreendedor || !municipio || !segmento || !contato) {
        showToast('Preencha todos os campos obrigatórios.', 'error');
        return;
    }

    if (id) {
        // UPDATE
        const idx = empreendimentos.findIndex(e => e.id === id);
        if (idx >= 0) {
            empreendimentos[idx] = { ...empreendimentos[idx], nome, empreendedor, municipio, segmento, contato, status, updatedAt: new Date().toISOString() };
            saveData();
            showToast('Empreendimento atualizado com sucesso! ✔', 'success');
        }
    } else {
        // CREATE
        const novo = {
            id: genId(),
            nome,
            empreendedor,
            municipio,
            segmento,
            contato,
            status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        empreendimentos.unshift(novo);
        saveData();
        showToast('Empreendimento cadastrado com sucesso! 🎉', 'success');
    }

    updateStats();
    resetForm();
    showView('list');
}

/* ---------- DELETE ---------- */
function openDeleteModal(id) {
    deleteTargetId = id;
    const emp = empreendimentos.find(e => e.id === id);
    if (!emp) return;
    document.getElementById('modal-emp-name').textContent = emp.nome;
    document.getElementById('modal-delete').classList.add('open');
}

function closeDeleteModal() {
    deleteTargetId = null;
    document.getElementById('modal-delete').classList.remove('open');
}

function confirmDelete() {
    if (!deleteTargetId) return;
    const idx = empreendimentos.findIndex(e => e.id === deleteTargetId);
    if (idx >= 0) {
        empreendimentos.splice(idx, 1);
        saveData();
        updateStats();
        renderCards(getFiltered());
        showToast('Empreendimento removido.', 'info');
    }
    closeDeleteModal();
}

/* ---------- FORM HELPERS ---------- */
function resetForm() {
    document.getElementById('emp-form').reset();
    document.getElementById('form-id').value = '';
    document.getElementById('status-ativo').checked = true;
}

/* ---------- TOAST ---------- */
let toastTimer = null;

function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast toast-${type} show`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ---------- SIDEBAR (mobile) ---------- */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const isOpen = sidebar.classList.contains('open');
    sidebar.classList.toggle('open', !isOpen);
    overlay.classList.toggle('open', !isOpen);
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');
}

/* ---------- KEYBOARD SHORTCUTS ---------- */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeDeleteModal();
        if (currentView === 'add') showView('list');
    }
});

/* ---------- INIT ---------- */
function init() {
    // Restaurar tema salvo
    const savedTheme = localStorage.getItem(THEME_KEY);
    applyTheme(savedTheme === 'light');

    loadData();

    // Seed demo data if empty
    if (empreendimentos.length === 0) {
        empreendimentos = [
            {
                id: genId(),
                nome: 'Tech Floripa',
                empreendedor: 'Mariana Siqueira',
                municipio: 'Florianópolis',
                segmento: 'Tecnologia',
                contato: 'contato@techfloripa.com.br',
                status: 'Ativo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: genId(),
                nome: 'Agrodigital - Itajaí',
                empreendedor: 'Roberto Meira',
                municipio: 'Blumenau',
                segmento: 'Agronegócio',
                contato: '(47) 99812-4400',
                status: 'Ativo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: genId(),
                nome: 'Têxtil Modas',
                empreendedor: 'Cintia Hoffmann',
                municipio: 'Brusque',
                segmento: 'Indústria',
                contato: 'cintia@brusquemodas.com.br',
                status: 'Inativo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: genId(),
                nome: 'SG Serviços',
                empreendedor: 'André Becker',
                municipio: 'Joinville',
                segmento: 'Serviços',
                contato: '(47) 3344-5500',
                status: 'Ativo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: genId(),
                nome: 'Mercado São Joaquim',
                empreendedor: 'Patrícia Luz',
                municipio: 'São Joaquim',
                segmento: 'Comércio',
                contato: 'mercadosj@email.com',
                status: 'Ativo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
        saveData();
    }

    updateStats();
    renderCards(empreendimentos);
}

init();
