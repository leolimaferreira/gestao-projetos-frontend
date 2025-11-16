# 🚀 Gestão de Projetos - Frontend

Sistema completo de gestão de projetos e tarefas desenvolvido com Angular 20.3.9, inspirado no Jira.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Configuração](#configuração)
- [Design System](#design-system)

## 🎯 Sobre o Projeto

Sistema web moderno para gerenciamento de projetos e tarefas, oferecendo uma interface intuitiva e profissional para equipes organizarem seu trabalho de forma eficiente.

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- **Login e Registro** de usuários
- **Recuperação de senha** via e-mail (com template HTML profissional)
- **Reset de senha** com token de segurança
- **Guard de autenticação** protegendo rotas privadas
- **Interceptor JWT** para requisições autenticadas
- **Prevenção de user enumeration** em mensagens de erro
- **Tradução automática** de mensagens de erro (EN → PT)

### 📊 Dashboard
- Visão geral com estatísticas de projetos e tarefas
- Cards informativos com dados em tempo real
- Links rápidos para ações principais
- Design limpo e profissional

### 📁 Gestão de Projetos
- **Listagem de projetos** com paginação e busca
- **Criação e edição** de projetos
- **Detalhes do projeto** com informações completas
- **Exclusão** de projetos com confirmação
- **Quadro Kanban** personalizado por projeto
- **Navegação inteligente** que lembra origem do usuário

### ✅ Gestão de Tarefas
- **Listagem de tarefas** com filtros avançados
- **Criação e edição** de tarefas
- **Detalhes da tarefa** com todas as informações
- **Sistema de prioridades** (Baixa, Média, Alta)
- **Estados da tarefa** (A Fazer, Em Progresso, Concluída)
- **Atribuição de responsáveis**
- **Datas de vencimento**
- **Associação a projetos**

### 📋 Kanban Board
- **Quadro visual** com 3 colunas (A Fazer, Em Progresso, Concluída)
- **Drag & Drop** para mover tarefas entre colunas
- **Atualização automática** de status
- **Contador de tarefas** por coluna
- **Cards informativos** com prioridade, responsável e data
- **Criação rápida** de tarefas pré-preenchidas com o projeto
- **Navegação contextual** para detalhes e edição

### 🧭 Sistema de Navegação
- **Navegação dinâmica** que lembra a origem do usuário
- **Botão "Voltar" inteligente**:
  - Kanban → Detalhes → Edição → Volta ao Kanban
  - Lista → Detalhes → Edição → Volta à Lista
- **Query parameters** para manter contexto de navegação
- **Histórico de navegação** com fallback automático

### 🎨 Interface e UX
- **Design System** completo inspirado no Jira
- **Paleta de cores profissional** com variáveis CSS
- **Componentes reutilizáveis** e consistentes
- **Feedback visual** (loading, erros, sucesso)
- **Tratamento de erros** com componente de serviço indisponível
- **Mensagens amigáveis** traduzidas para português
- **Layout responsivo** e moderno

## 🛠 Tecnologias

- **Angular 20.3.9** - Framework principal
- **TypeScript 5.9.2** - Linguagem de programação
- **RxJS** - Programação reativa
- **Angular Router** - Roteamento e navegação
- **Reactive Forms** - Formulários reativos
- **CSS Variables** - Design system
- **Standalone Components** - Arquitetura moderna
- **Signals** - Gerenciamento de estado

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                          
│   │   ├── guards/
│   │   │   └── auth.guard.ts          
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts    
│   │   └── services/
│   │       ├── auth.service.ts        
│   │       ├── navigation.service.ts  
│   │       ├── project.service.ts     
│   │       ├── task.service.ts        
│   │       ├── translation.service.ts 
│   │       └── user.service.ts        
│   │
│   ├── features/                      
│   │   ├── auth/
│   │   │   ├── login/                 
│   │   │   ├── register/              
│   │   │   ├── forgot-password/       
│   │   │   └── reset-password/        
│   │   │
│   │   ├── dashboard/                 
│   │   │
│   │   ├── projects/
│   │   │   ├── project-list/          
│   │   │   ├── project-detail/        
│   │   │   ├── project-form/          
│   │   │   └── project-kanban/        
│   │   │
│   │   └── tasks/
│   │       ├── task-list/             
│   │       ├── task-detail/           
│   │       └── task-form/             
│   │
│   ├── shared/                        
│   │   ├── components/
│   │   │   └── service-unavailable/   
│   │   ├── enums/
│   │   │   ├── priority.enum.ts       
│   │   │   ├── role.enum.ts           
│   │   │   └── status.enum.ts         
│   │   └── models/
│   │       ├── auth.model.ts
│   │       ├── error.model.ts         
│   │       ├── page.model.ts          
│   │       ├── project.model.ts       
│   │       ├── task.model.ts          
│   │       └── user.model.ts          
│   │
│   ├── app.routes.ts                  
│   ├── app.config.ts                  
│   └── app.ts                         
│
├── environments/                      
│   ├── environment.ts                 
│   └── environment.prod.ts            
│
└── styles.css                         
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18+)
- Angular CLI 20.3.9

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/leolimaferreira/gestao-projetos-frontend.git
cd gestao-projetos-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Edite src/environments/environment.ts
# Defina a URL da API backend
```

4. Inicie o servidor de desenvolvimento:
```bash
ng serve
```

5. Acesse a aplicação:
```
http://localhost:4200/
```

## ⚙️ Configuração

### Variáveis de Ambiente

Configure a URL da API em `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:
- Token armazenado no localStorage
- Interceptor adiciona token automaticamente nas requisições
- Guard protege rotas que requerem autenticação

## 🎨 Design System

O projeto utiliza um Design System completo baseado no Jira:

### Cores Principais
- **Primary Blue**: `#0052CC` - Ações principais e links
- **Neutral Scale**: Do branco (`#FFFFFF`) ao preto (`#091E42`)
- **Success**: `#36B37E` - Feedback positivo
- **Warning**: `#FFAB00` - Avisos
- **Error**: `#DE350B` - Erros

### Espaçamento
Sistema consistente de 4px base (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px)

### Tipografia
- **Heading 1**: 32px / Bold
- **Heading 2**: 24px / Semibold
- **Heading 3**: 20px / Semibold
- **Body**: 14px / Regular
- **Small**: 12px / Regular

### Componentes
Todos os componentes seguem o Design System com:
- Cores consistentes usando variáveis CSS
- Espaçamentos padronizados
- Sombras e bordas uniformes
- Estados visuais (hover, active, disabled)

## 📝 Scripts Disponíveis

```bash
# Servidor de desenvolvimento
ng serve

# Build de produção
ng build

# Gerar novo componente
ng generate component nome-do-componente

# Ajuda do Angular CLI
ng help
```

## 🔒 Segurança

- Proteção contra user enumeration
- Tokens JWT com expiração
- Guards de autenticação
- Sanitização de inputs
- Tratamento seguro de erros
- Headers de segurança

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Leonardo Lima Ferreira**
- GitHub: [@leolimaferreira](https://github.com/leolimaferreira)

## 📞 Suporte

Para suporte e dúvidas, abra uma issue no GitHub.

---

Desenvolvido com ❤️ usando Angular
