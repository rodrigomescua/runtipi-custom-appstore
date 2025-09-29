# Maxun - Plataforma Open-Source No-Code para Extração de Dados Web

Maxun é uma plataforma revolucionária que permite extrair dados da web sem código. Treine um robô em 2 minutos e deixe-o fazer a extração de dados no piloto automático.

## 🚀 Instalação ZERO Configuração

**NENHUM campo obrigatório!** Instale e use imediatamente! Todos os valores já vêm pré-configurados de forma segura.

### Campos Opcionais (apenas para integrações):
- Google Client ID/Secret (Google Sheets)
- Airtable Client ID (Airtable)

**Instalar e usar em segundos!**

## 🚀 Características Principais

- **✨ Extração de Dados Sem Código**: Interface intuitiva que não requer conhecimento de programação
- **✨ Paginação e Rolagem Automática**: Lida automaticamente com sites que carregam conteúdo dinamicamente
- **✨ Agendamento de Robôs**: Execute seus robôs em horários específicos automaticamente
- **✨ APIs Instantâneas**: Transforme qualquer site em uma API
- **✨ Integração com Planilhas**: Exporte dados diretamente para spreadsheets
- **✨ Adaptação a Mudanças**: Se adapta automaticamente a mudanças no layout dos sites
- **✨ Extração Protegida por Login**: Acesse dados que requerem autenticação
- **✨ Integrações**: Conecte com Google Sheets, Airtable e muito mais

## 🎯 Casos de Uso

- **E-commerce**: Monitore preços de produtos, estoque e avaliações
- **Leads**: Colete informações de contato e dados de prospects
- **Pesquisa de Mercado**: Analise concorrentes e tendências
- **Monitoramento de Conteúdo**: Acompanhe mudanças em sites e notícias
- **Dados Financeiros**: Colete informações de mercado e investimentos
- **Imóveis**: Monitore listagens e preços de propriedades

## 📖 Como Funciona

1. **Grave suas Ações**: Use o navegador integrado para navegar no site alvo
2. **Defina os Dados**: Marque os elementos que deseja extrair
3. **Configure o Robô**: Defina frequência e parâmetros de execução
4. **Execute e Monitore**: Deixe o robô trabalhar e acompanhe os resultados

## 🔧 Ações Disponíveis

### 1. Captura de Lista
Útil para extrair itens estruturados e em massa do site.
**Exemplo**: Extrair produtos do Amazon, listagens de imóveis, etc.

### 2. Captura de Texto
Útil para extrair conteúdo de texto individual do site.
**Exemplo**: Títulos, descrições, preços específicos.

### 3. Captura de Screenshot
Obtenha screenshots de página completa ou seção visível do site.
**Exemplo**: Documentação de estado do site, relatórios visuais.

## 🔒 BYOP (Bring Your Own Proxy)

O BYOP permite conectar proxies externos para contornar proteção anti-bot. Os proxies são configurados por usuário e em breve será possível configurar proxy por robô individual.

## 🌐 Integrações

- **Google Sheets**: Exporte dados diretamente para planilhas
- **Airtable**: Sincronize com suas bases de dados
- **APIs REST**: Acesse dados via endpoints personalizados
- **Webhooks**: Receba notificações em tempo real

## ⚙️ Configuração

### Variáveis Obrigatórias

- **JWT_SECRET**: Chave secreta para tokens JWT (mínimo 32 caracteres)
- **DB_PASSWORD**: Senha do banco PostgreSQL
- **ENCRYPTION_KEY**: Chave de 64 caracteres para criptografia
- **SESSION_SECRET**: Segredo para cookies de sessão
- **MINIO_SECRET_KEY**: Chave secreta do MinIO

### Variáveis Opcionais

- **Google OAuth**: Para integração com Google Sheets
- **Airtable**: Para integração com bases Airtable
- **Telemetria**: Ajuda no desenvolvimento (recomendado manter ativo)

## 📊 Telemetria

A telemetria coleta dados anônimos de uso que ajudam a entender como o produto é usado e avaliar o impacto de novas mudanças. É recomendado manter ativo para contribuir com o desenvolvimento.

## 🔧 Portas

- **Frontend**: 5173 (interface principal)
- **Backend**: 8080 (API)
- **MinIO**: 9000 (API), 9001 (WebUI)
- **PostgreSQL**: 5432

## 📝 Licença

Este projeto está licenciado sob a licença AGPLv3.

## 🆘 Suporte

- **Website**: https://www.maxun.dev
- **Documentação**: https://docs.maxun.dev
- **Discord**: https://discord.gg/5GbPjBUkws
- **GitHub**: https://github.com/getmaxun/maxun

---

*Maxun torna a extração de dados web mais fácil do que nunca. Comece hoje e automatize sua coleta de dados!*