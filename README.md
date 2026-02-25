# SCTEC — Sistema de Empreendedorismo de Santa Catarina

Aplicação web do tipo **CRUD** desenvolvida para o gerenciamento de empreendimentos do estado de Santa Catarina
O sistema permite cadastrar, consultar, editar e remover registros de empreendimentos e seus respectivos responsáveis de forma simples e estruturada.

---

## Descrição da Solução

A solução foi desenvolvida como uma **Single Page Application (SPA)** de front-end puro, sem necessidade de servidor ou banco de dados externo. 
Os dados são persistidos localmente no navegador por meio da Web API **`localStorage`**.

A interface apresenta um design moderno em **dark mode**, cards animados, filtros em tempo real e notificações visuais.

### Funcionalidades

| Operação | Descrição |
|---|---|
| **Create** | Cadastro de novos empreendimentos via formulário completo com validação |
| **Read** | Listagem em grade de cards com estatísticas no painel lateral |
| **Update** | Edição de registros existentes com formulário pré-preenchido automaticamente |
| **Delete** | Remoção de registros com modal de confirmação antes de excluir |
| **Filtros** | Busca textual em tempo real + filtro por segmento e por status |
| **Persistência** | Dados salvos no `localStorage` do navegador (sem necessidade de servidor) |

### Campos do Sistema

- **Nome do empreendimento** — texto livre, obrigatório
- **Nome do(a) empreendedor(a) responsável** — texto livre, obrigatório
- **Município de Santa Catarina** — seleção a partir de lista com todos os municípios do estado
- **Segmento de atuação** — Tecnologia · Comércio · Indústria · Serviços · Agronegócio
- **E-mail ou meio de contato** — texto livre, obrigatório
- **Status** — Ativo ou Inativo

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **HTML5** | — | Estrutura semântica da aplicação |
| **CSS3** | — | Estilização, animações e layout responsivo |
| **JavaScript** | — | Lógica CRUD, manipulação do DOM e persistência |
| **localStorage** (Web API) | — | Armazenamento local dos dados no navegador |
| **Google Fonts — Inter** | — | Tipografia moderna (carregada via CDN) |

> Nenhuma biblioteca ou framework externo foi utilizado. A aplicação é 100% vanilla — HTML, CSS e JavaScript puro.

---

## 📁 Estrutura do Projeto

```
CRUD/
├── index.html   # Estrutura HTML: sidebar, formulário, grid de cards e modal
├── style.css    # Sistema de design: dark mode, cores, animações e responsividade
├── app.js       # Lógica JavaScript: CRUD, filtros, validação e persistência
└── README.md    # Documentação do projeto
```

### Responsabilidade de cada arquivo

#### `index.html`
Define toda a estrutura visual da aplicação:
- **Sidebar** com navegação, estatísticas (total / ativos / inativos) e rodapé
- **Header mobile** com menu hambúrguer para telas pequenas
- **Seção de listagem** com barra de filtros e grade de cards
- **Seção de formulário** para cadastro e edição de empreendimentos
- **Modal de confirmação** para a operação de exclusão
- **Elemento toast** para notificações de feedback ao usuário

#### `style.css`
Implementa o sistema de design completo:
- Variáveis CSS (tokens de cor, espaçamento, sombras e transições)
- Layout com sidebar fixa + área de conteúdo principal
- Componentes: cards com hover/glow, formulário, botões, badges, modal, toast
- Animações: `fadeInUp` nos cards, `modalIn` no modal, transição do toast
- Design responsivo com breakpoints para tablet e mobile

#### `app.js`
Contém toda a lógica da aplicação:
- `loadData()` / `saveData()` — leitura e escrita no `localStorage`
- `renderCards()` — renderização dinâmica dos cards no DOM
- `handleSubmit()` — tratamento do formulário (criação e atualização)
- `openEdit()` — pré-preenchimento do formulário com dados existentes
- `openDeleteModal()` / `confirmDelete()` — fluxo de exclusão com confirmação
- `applyFilters()` / `getFiltered()` — busca textual e filtros combinados
- `showToast()` — notificações visuais de feedback
- `init()` — inicialização com dados de demonstração na primeira execução

---

## Instruções de Execução

### Pré-requisitos

Nenhuma instalação necessária. Apenas um **navegador moderno** (Exemplo: Google Chrome nas versões recentes).

### Passos

1. **Baixe ou clone** os arquivos do projeto para uma pasta local.

2. **Abra o arquivo `index.html`** diretamente no navegador:
   - Localize o arquivo `index.html` no explorador de arquivos

3. **Pronto!** A aplicação carregará com 5 registros de demonstração pré-cadastrados.

>  **Atenção:** Os dados ficam armazenados no `localStorage` do navegador utilizado. Ao limpar os dados de navegação ou usar outro navegador/perfil, os registros serão perdidos.

### Atalhos de Teclado

| Tecla | Ação |
|---|---|
| `Esc` | Fecha o modal de exclusão ou volta à listagem |

---

## Interface

A aplicação conta com:

- **Sidebar** fixa com logo, navegação e painel de estatísticas
- **Grade de cards** com ícone do segmento, badges coloridos de status e município
- **Barra de filtros** com busca textual + dropdowns de segmento e status
- **Formulário** em card elevado com grade de dois campos por linha
- **Modal** com backdrop blur para confirmação de exclusão
- **Toasts** no canto inferior direito para feedback de ações
- **Layout responsivo** adaptado para desktop, tablet e mobile

---

## Sobre o Projeto

Desenvolvido como protótipo funcional para avaliação SCTEC
