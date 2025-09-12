# Configuração de Porta Dinâmica

Este projeto agora suporta configuração dinâmica de porta para o backend através de variáveis de ambiente.

## Como Usar

### 1. Usar Porta Padrão (7201)
```bash
npm run start:dynamic
```

### 2. Usar Porta Personalizada (Windows PowerShell)
```powershell
# Definir porta via variável de ambiente
$env:BACKEND_PORT="7202"; npm run start:custom-port

# Ou usar o script pré-configurado para porta 7202
npm run start:custom
```

### 3. Usar Porta Personalizada (Windows CMD)
```cmd
# Definir porta via variável de ambiente
set BACKEND_PORT=7202 && npm run start:custom-port
```

### 4. Usar Porta Personalizada (Linux/Mac)
```bash
# Definir porta via variável de ambiente
BACKEND_PORT=7202 npm run start:custom-port
```

## Scripts Disponíveis

- `npm run start:dynamic` - Usa configuração dinâmica com porta padrão (7201)
- `npm run start:custom` - Usa porta 7202 (pré-configurado)
- `npm run start:custom-port` - Gera proxy dinamicamente baseado na variável BACKEND_PORT

## Arquivos Criados/Modificados

- `src/environments/environment.dynamic.ts` - Configuração dinâmica
- `proxy.conf.dynamic.json` - Proxy dinâmico
- `scripts/generate-proxy.js` - Script para gerar proxy dinamicamente
- `src/app/services/environment.service.ts` - Métodos para porta dinâmica
- `angular.json` - Configuração dinâmica adicionada
- `package.json` - Novos scripts adicionados

## Funcionalidades Adicionadas

- `environmentService.isDynamic` - Verifica se está em modo dinâmico
- `environmentService.backendPort` - Retorna a porta do backend
- `environmentService.backendHost` - Retorna o host do backend

## Exemplo de Uso no Código

```typescript
constructor(private environmentService: EnvironmentService) {}

ngOnInit() {
  if (this.environmentService.isDynamic) {
    console.log(`Backend rodando na porta: ${this.environmentService.backendPort}`);
  }
}
```
