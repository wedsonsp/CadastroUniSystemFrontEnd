# Projeto Wedson Front

Sistema de gerenciamento de usuários desenvolvido em Angular 19 com Angular Material.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de login com JWT
- **Gerenciamento de Usuários**: 
  - Listagem de usuários
  - Criação de novos usuários
  - Visualização de detalhes do usuário
  - Busca de usuário por ID
- **Interface Moderna**: Design responsivo com Angular Material
- **Interceptors e Guards**: Proteção de rotas e tratamento de erros

## 🛠️ Tecnologias Utilizadas

- **Angular 19.2.14** - Framework principal
- **Angular Material 19.2.19** - Componentes de UI
- **Angular CDK 19.2.19** - Component Development Kit
- **TypeScript 5.5.4** - Linguagem de programação
- **RxJS 7.8.0** - Programação reativa
- **SCSS** - Pré-processador CSS
- **Zone.js 0.15.1** - Change detection

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   └── interceptors/
│   │       ├── auth.interceptor.ts
│   │       └── error.interceptor.ts
│   ├── features/
│   │   └── usuario/
│   │       ├── login/
│   │       │   └── login.component.ts
│   │       ├── usuario-detail/
│   │       │   └── usuario-detail.component.ts
│   │       ├── usuario-form/
│   │       │   └── usuario-form.component.ts
│   │       └── usuario-list/
│   │           └── usuario-list.component.ts
│   ├── models/
│   │   ├── base-entity.ts
│   │   └── user.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── app.component.ts
│   └── app.routes.ts
├── styles.scss
└── main.ts
```

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd ProjetoWedsonFront
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto**
   ```bash
   npm start
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:4200
   ```

## 🌐 Endpoints da API

O projeto consome os seguintes endpoints:

- **POST** `http://localhost:7205/api/auth/login` - Login
- **POST** `http://localhost:7205/api/users` - Criar usuário
- **GET** `http://localhost:7205/api/users` - Listar usuários
- **GET** `http://localhost:7205/api/users/{id}` - Buscar usuário por ID

## 📱 Funcionalidades Detalhadas

### 🔐 Autenticação
- Tela de login com validação de formulário
- Armazenamento seguro do token JWT
- Redirecionamento automático após login
- Logout com limpeza de dados

### 👥 Gerenciamento de Usuários

#### Lista de Usuários
- Tabela responsiva com Angular Material
- Busca por ID do usuário
- Indicadores visuais de status (ativo/inativo)
- Ações para visualizar detalhes

#### Criação de Usuário
- Formulário com validação completa
- Confirmação de senha
- Feedback visual de sucesso/erro
- Redirecionamento automático após criação

#### Detalhes do Usuário
- Visualização completa das informações
- Layout organizado em seções
- Informações de auditoria (criado/atualizado por)

## 🎨 Design System

O projeto utiliza Angular Material com tema personalizado:
- **Cores Primárias**: Azul (#2196F3)
- **Cores de Acento**: Âmbar (#FFC107)
- **Cores de Aviso**: Vermelho (#F44336)
- **Tipografia**: Roboto

## 🔒 Segurança

- **Guards**: Proteção de rotas autenticadas
- **Interceptors**: 
  - Adição automática do token de autorização
  - Tratamento centralizado de erros
  - Redirecionamento em caso de token expirado

## 🚀 Scripts Disponíveis

### Desenvolvimento
- `npm start` - Inicia o servidor de desenvolvimento (ambiente **local** - localhost:7201)
- `npm run start:local` - Inicia com ambiente **local** (localhost:7201)
- `npm run start:dev` - Inicia com ambiente de **desenvolvimento** (api-dev.wedson.com)
- `npm run start:prod` - Inicia em modo **produção** (api.wedson.com)
- `npm run start:no-proxy` - Inicia sem proxy (ambiente local)

### Build
- `npm run build` - Compila o projeto para produção
- `npm run build:dev` - Compila para desenvolvimento
- `npm run build:local` - Compila para ambiente local
- `npm run build:prod` - Compila para produção
- `npm run watch` - Compila e observa mudanças (ambiente local)

### Testes
- `npm test` - Executa os testes

## 🔧 Comandos ng serve por Ambiente

> **Nota**: Todos os comandos `npm run start:*` já incluem as configurações de proxy e ambiente necessárias.

### Ambiente Local (Backend em localhost:7201)
```bash
ng serve --configuration local
# ou
npm start
# ou
npm run start:local
```
**URL da API**: `http://localhost:7201/api`

### Ambiente de Desenvolvimento
```bash
ng serve --proxy-config proxy.conf.dev.json --configuration development
# ou
npm run start:dev
```
**URL da API**: `https://api-dev.wedson.com/api`

### Ambiente de Produção
```bash
ng serve --configuration production
# ou
npm run start:prod
```
**URL da API**: `https://api.wedson.com/api`

## 🐛 Debug de Requisições da API

Para verificar as requisições enviadas e recebidas da API durante o desenvolvimento:

### 1. Abrir o Console do Navegador
- **Chrome/Edge**: Pressione `Ctrl + Shift + I` (Windows) ou `Cmd + Option + I` (Mac)
- **Firefox**: Pressione `Ctrl + Shift + K` (Windows) ou `Cmd + Option + K` (Mac)
- **Alternativa**: Clique com botão direito na página → "Inspecionar" → Aba "Console"

### 2. Verificar Requisições na Aba Network
1. Abra o console (`Ctrl + Shift + I`)
2. Vá para a aba **"Network"** (Rede)
3. Faça login na aplicação
4. Observe as requisições para `/api/auth/authenticate`
5. Clique na requisição para ver:
   - **Headers**: Cabeçalhos enviados e recebidos
   - **Payload**: Dados enviados no corpo da requisição
   - **Response**: Resposta recebida da API

### 3. Logs do Interceptor
O projeto possui interceptors que fazem log das requisições. No console você verá:
```
Interceptor - URL: http://localhost:7201/api/auth/authenticate
Interceptor - Token presente: false
Interceptor - Headers originais: Array(2)
```

### 4. Verificar Erros de CORS
Se houver problemas de CORS, você verá erros como:
```
Access to XMLHttpRequest at 'http://localhost:7201/api/auth/authenticate' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

### 5. Status das Requisições
- **Status 200**: Sucesso
- **Status 401**: Não autorizado (credenciais inválidas)
- **Status 0**: Erro de rede/CORS
- **Status 500**: Erro interno do servidor

## 🌍 Ambientes Configurados

O projeto suporta múltiplos ambientes com configuração automática:

- **Local**: `http://localhost:7201/api` (desenvolvimento local - backend Azure Functions)
- **Development**: `https://api-dev.wedson.com/api` (servidor de desenvolvimento)
- **Production**: `https://api.wedson.com/api` (servidor de produção)

Para mais detalhes sobre configuração de ambientes, consulte o arquivo [ENVIRONMENT.md](./ENVIRONMENT.md).

## 🔄 Atualização para Angular 19

Este projeto foi atualizado com sucesso para **Angular 19.2.14** em setembro de 2024. A atualização incluiu:

### ✅ Componentes Atualizados
- **Angular Core**: 18.2.13 → 19.2.14
- **Angular CLI**: 18.2.20 → 19.2.15
- **Angular Material**: 17.3.10 → 19.2.19
- **Angular CDK**: 17.3.10 → 19.2.19
- **Zone.js**: 0.14.10 → 0.15.1

### 🚀 Novas Funcionalidades do Angular 19
- Melhorias na performance e otimização
- Novos recursos de desenvolvimento
- Atualizações de segurança
- Compatibilidade aprimorada com ferramentas modernas

### 📝 Processo de Atualização
A atualização foi realizada usando os comandos oficiais do Angular:
```bash
# Instalação do Angular CLI 19
npm install -g @angular/cli@19

# Atualização das dependências principais
ng update @angular/core@19 @angular/cli@19

# Atualização do Angular Material (em etapas)
ng update @angular/material@18
ng update @angular/material@19
```

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (versão 9 ou superior)
- Angular CLI 19.2.15 (instalado globalmente)
- Backend da API rodando na porta 7205

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos canais oficiais do projeto.
