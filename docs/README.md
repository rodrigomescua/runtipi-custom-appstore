# 📚 Documentação - Runtipi Custom App Store

Bem-vindo à documentação atualizada do Runtipi Custom App Store! Este diretório contém guias e referências sobre o novo formato **Dynamic Compose v2 com YAML e x-runtipi**.

## 📖 Arquivos Principais

### 1. **DYNAMIC_COMPOSE_SPEC_v2.md** ⭐ START HERE
Especificação técnica completa da nova versão do Dynamic Compose.

**Inclui:**
- Overview da nova especificação
- Estrutura YAML com `x-runtipi`
- Principais mudanças do JSON legado
- Configuração completa de serviços
- Overrides por arquitetura
- Health checks e dependencies
- Variáveis de ambiente Runtipi
- Exemplos completos (Linkding + Dawarich)

**Para:** Desenvolvedores criando novos apps ou migrando existentes

---

### 2. **CONVERSION_EXAMPLES.md** 📝 BEST PRACTICES
Exemplos práticos de como converter apps de JSON para YAML.

**Inclui:**
- Lado-a-lado: JSON (antes) vs YAML (depois)
- Exemplo simples (Linkding - 1 serviço)
- Exemplo complexo (m3u-editor - multi-serviço)
- Mapeamento de todos os campos
- Padrões importantes (dependencies, health checks, etc.)
- Validation checklist
- Notas sobre compatibilidade

**Para:** Entender a migração e ver exemplos reais

---

### 3. **MIGRATION_SUMMARY_JSON_to_YAML.md** 📊 PROJECT STATUS
Resumo executivo da migração completa do projeto.

**Inclus:**
- Status da conversão (38 apps → ✅ COMPLETO)
- Categorias de apps (simples vs complexos)
- Transformações aplicadas
- Estatísticas e métricas
- Lista de todos os 38 apps convertidos
- Validações aplicadas
- Próximos passos e checklist

**Para:** Visão geral do projeto e status atual

---

## 🎯 Como Usar Esta Documentação

### Cenário 1: Sou novo por aqui, quero entender o novo formato
→ Leia em ordem:
1. `DYNAMIC_COMPOSE_SPEC_v2.md` (visão técnica)
2. `CONVERSION_EXAMPLES.md` (ver exemplos)
3. `.github/copilot-instructions.md` (diretrizes completas)

### Cenário 2: Preciso criar um novo app
→ Consulte:
1. `DYNAMIC_COMPOSE_SPEC_v2.md` - seção "Estrutura YAML com x-runtipi"
2. `.github/copilot-instructions.md` - seção "Practical Checklist"
3. `CONVERSION_EXAMPLES.md` - veja apps similares convertidos

### Cenário 3: Preciso converter um app existente (JSON → YAML)
→ Siga:
1. `CONVERSION_EXAMPLES.md` - entenda os padrões
2. Use como template o passo `Mapeamento de Campos`
3. Valide com o checklists no final

### Cenário 4: Estou corrigindo um bug em app existente
→ Abra:
1. `apps/<app-name>/docker-compose.yml` (novo arquivo YAML)
2. Compare com especificação se precisa fazer mudanças
3. Valide a sintaxe YAML após alterações

---

## 🔑 Conceitos-Chave

### Dynamic Compose v2
Novo formato de configuração de containers Runtipi que usa **YAML com extensões `x-runtipi`** em vez do JSON antigo.

### x-runtipi
Extensões custom para Docker Compose que permitem ao Runtipi configurar comportamentos específicos:
- `is_main`: Marca qual serviço é o principal (exposto)
- `internal_port`: Porta do container a expor
- `schema_version`: Versão da especificação (sempre 2)

### docker-compose.yml
Arquivo que define todos os serviços, volumes, networks e variáveis para a aplicação.

**Local:** `apps/<app-name>/docker-compose.yml`

---

## ✅ Checklist Rápido

Ao trabalhar com apps Runtipi, verifique:

**Estrutura:**
- [ ] Arquivo em `docker-compose.yml` (não `.json`)
- [ ] Começa com `version: '3'`
- [ ] Root tem `x-runtipi.schema_version: 2`

**Serviços:**
- [ ] Exatamente 1 `is_main: true`
- [ ] Cada serviço tem `image` com tag específico
- [ ] `internal_port` configurado

**Dependências:**
- [ ] Usa object format: `depends_on: {service: {condition: ...}}`
- [ ] Nunca usa array: `[service1, service2]`
- [ ] Health checks em serviços aguardados

**Variáveis:**
- [ ] Environment é lista: `- KEY=value`
- [ ] Nunca array de objetos: `[{key, value}]`
- [ ] Referencias mantidas: `${APP_DATA_DIR}`, `${VARIABLE}`

**Volumes:**
- [ ] Formato: `${APP_DATA_DIR}/data/lastpart:/container/path`
- [ ] Nunca caminho completo: `${APP_DATA_DIR}/data/full/path/here`

---

## 🔗 Arquivos Relacionados

No projeto raiz:

- `.github/copilot-instructions.md` - Guia completo para desenvolvedores
- `AGENTS.md` - Instruções para agentes AI mantendo o projeto
- `README.md` - Overview do projeto
- `renovate.json` - Configuração de atualizações automáticas
- `__tests__/apps.test.ts` - Testes de validação

---

## 📞 Dúvidas Comuns

**P: Qual é a diferença entre `port` e `internal_port`?**  
R: `port` (em config.json) é a porta exposta no host (8800-8999). `internal_port` (em docker-compose.yml) é a porta que o container fornece internamente.

**P: Por que não posso mais usar array em `dependsOn`?**  
R: Porque causa risco de "connection refused" - o Runtipi precisa saber se deve esperar o healthcheck passar.

**P: Posso manter o arquivo JSON antigo?**  
R: Sim, por enquanto. Ambos podem coexistir durante transição. Mas Runtipi usará o `.yml`.

**P: Quantos serviços posso ter?**  
R: Quantos quiser! Mas apenas 1 pode ter `is_main: true`.

**P: O que fazer se meu app tem múltiplas portas?**  
R: Use `ports:` com array. `is_main` expõe `internal_port` e outras portas ficam adicionais.

---

## 🚀 Próximos Passos

1. **Ler especificação:** `DYNAMIC_COMPOSE_SPEC_v2.md`
2. **Ver exemplos:** `CONVERSION_EXAMPLES.md`
3. **Consultar diretrizes:** `.github/copilot-instructions.md`
4. **Criar/atualizar app:** Siga o checklist acima
5. **Testar:** `bun test`

---

## 📝 Histórico de Atualizações

- **2026-04-01**: Migração completa de 38 apps de JSON para YAML + x-runtipi
  - Documentação criada
  - Todos os apps convertidos
  - Diretrizes atualizadas

---

**Última atualização:** 1º de Abril, 2026  
**Formato:** Dynamic Compose v2 YAML + x-runtipi  
**Apps Convertidos:** 38/38 ✅
