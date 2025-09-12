const fs = require('fs');
const path = require('path');

// Função para gerar proxy dinâmico baseado na variável de ambiente
function generateDynamicProxy() {
  const backendPort = process.env.BACKEND_PORT || '7201';
  
  // Gerar configuração do proxy
  const proxyConfig = {
    "/api/*": {
      "target": `http://localhost:${backendPort}`,
      "secure": false,
      "changeOrigin": true,
      "logLevel": "debug"
    }
  };

  const proxyPath = path.join(__dirname, '..', 'proxy.conf.dynamic.json');
  fs.writeFileSync(proxyPath, JSON.stringify(proxyConfig, null, 2));
  
  // Gerar configuração do environment
  const environmentContent = `export const environment = {
  production: false,
  apiUrl: 'http://localhost:${backendPort}/api',
  environmentName: 'dynamic'
};`;

  const environmentPath = path.join(__dirname, '..', 'src', 'environments', 'environment.dynamic.ts');
  fs.writeFileSync(environmentPath, environmentContent);
  
  console.log(`Proxy configurado para porta: ${backendPort}`);
  console.log(`Arquivo proxy gerado: ${proxyPath}`);
  console.log(`Arquivo environment gerado: ${environmentPath}`);
}

// Executa a função se o script for chamado diretamente
if (require.main === module) {
  generateDynamicProxy();
}

module.exports = { generateDynamicProxy };
