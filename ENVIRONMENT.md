# 🌍 Configuração de Ambientes

Este projeto foi configurado para trabalhar com diferentes ambientes (local, desenvolvimento e produção) de forma automática.

## 📁 Arquivos de Environment

### Estrutura de Arquivos
```
src/environments/
├── environment.ts              # Ambiente local (padrão)
├── environment.development.ts  # Ambiente de desenvolvimento
└── environment.production.ts   # Ambiente de produção
```

### Configurações por Ambiente

#### 🏠 Local (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:7205/api',
  environmentName: 'local'
};
```

#### 🚀 Desenvolvimento (environment.development.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api-dev.wedson.com/api',
  environmentName: 'development'
};
```

#### 🌐 Produção (environment.production.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.wedson.com/api',
  environmentName: 'production'
};
```

## 🚀 Scripts Disponíveis

### Desenvolvimento Local
```bash
npm start          # Inicia com proxy local (localhost:7205)
npm run start:local # Mesmo que npm start
```

### Desenvolvimento (Servidor Dev)
```bash
npm run start:dev  # Inicia com proxy para servidor de desenvolvimento
```

### Produção
```bash
npm run start:prod # Inicia em modo produção (sem proxy)
```

### Build
```bash
npm run build:dev  # Build para desenvolvimento
npm run build:prod # Build para produção
npm run build      # Build para produção (padrão)
```

## 🔧 Como Funciona

### 1. EnvironmentService
O `EnvironmentService` é injetado em todos os serviços e fornece:
- `apiUrl`: URL base da API
- `isProduction`: Se está em produção
- `environmentName`: Nome do ambiente atual
- `isDevelopment`: Se está em desenvolvimento
- `isLocal`: Se está em ambiente local

### 2. Configuração Automática
- **Local**: Usa `environment.ts` com proxy para `localhost:7205`
- **Development**: Usa `environment.development.ts` com proxy para servidor dev
- **Production**: Usa `environment.production.ts` sem proxy

### 3. Proxy Configuration
- `proxy.conf.local.json`: Proxy para ambiente local
- `proxy.conf.dev.json`: Proxy para ambiente de desenvolvimento
- `proxy.conf.json`: Proxy padrão (mantido para compatibilidade)

## 📝 Exemplo de Uso nos Serviços

```typescript
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class MeuService {
  private readonly API_URL: string;

  constructor(private environmentService: EnvironmentService) {
    this.API_URL = this.environmentService.apiUrl;
  }

  // Agora todas as requisições usam a URL correta automaticamente
  getData() {
    return this.http.get(`${this.API_URL}/data`);
  }
}
```

## 🔄 Mudança de Ambiente

Para mudar o ambiente, simplesmente execute o comando correspondente:

```bash
# Para desenvolvimento local
npm run start:local

# Para desenvolvimento (servidor dev)
npm run start:dev

# Para produção
npm run start:prod
```

## ⚙️ Personalização

Para adicionar novos ambientes ou modificar URLs:

1. Crie um novo arquivo `environment.novoambiente.ts`
2. Adicione a configuração no `angular.json`
3. Crie um novo script no `package.json`
4. Crie um novo arquivo de proxy se necessário

## 🎯 Benefícios

- ✅ **Automático**: Não precisa alterar código para mudar ambiente
- ✅ **Seguro**: URLs de produção não ficam expostas em desenvolvimento
- ✅ **Flexível**: Fácil de adicionar novos ambientes
- ✅ **Consistente**: Todos os serviços usam a mesma configuração
- ✅ **Debug**: Logs mostram qual ambiente está sendo usado
