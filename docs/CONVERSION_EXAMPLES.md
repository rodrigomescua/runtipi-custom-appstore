# Exemplos de Conversão: JSON → YAML com x-runtipi

## Exemplo 1: App Simples (Linkding - 1 serviço)

### ❌ Antes (JSON - DEPRECATED)
```json
{
  "$schema": "https://schemas.runtipi.io/v2/dynamic-compose.json",
  "schemaVersion": 2,
  "services": [
    {
      "name": "linkding",
      "image": "sissbruecker/linkding:1.45.0",
      "isMain": true,
      "internalPort": 9090,
      "environment": [
        {
          "key": "LD_SUPERUSER_NAME",
          "value": "${LD_SUPERUSER_NAME}"
        },
        {
          "key": "LD_SUPERUSER_EMAIL",
          "value": "${LD_SUPERUSER_EMAIL}"
        },
        {
          "key": "LD_SUPERUSER_PASSWORD",
          "value": "${LD_SUPERUSER_PASSWORD}"
        },
        {
          "key": "LD_CSRF_TRUSTED_ORIGINS",
          "value": "http://${APP_DOMAIN}:${APP_PORT},https://${APP_DOMAIN}"
        }
      ],
      "volumes": [
        {
          "hostPath": "${APP_DATA_DIR}/data/data",
          "containerPath": "/etc/linkding/data"
        }
      ]
    }
  ]
}
```

### ✅ Depois (YAML - NEW FORMAT)
```yaml
version: '3'

services:
  linkding:
    image: sissbruecker/linkding:1.45.0
    container_name: linkding
    ports:
      - "8830:9090"
    environment:
      - LD_SUPERUSER_NAME=${LD_SUPERUSER_NAME}
      - LD_SUPERUSER_EMAIL=${LD_SUPERUSER_EMAIL}
      - LD_SUPERUSER_PASSWORD=${LD_SUPERUSER_PASSWORD}
      - LD_CSRF_TRUSTED_ORIGINS=http://${APP_DOMAIN}:${APP_PORT},https://${APP_DOMAIN}
    volumes:
      - ${APP_DATA_DIR}/data/data:/etc/linkding/data
    x-runtipi:
      is_main: true
      internal_port: 9090

x-runtipi:
  schema_version: 2
```

---

## Exemplo 2: App Complexo (m3u-editor - 2+ serviços)

### ❌ Antes (JSON - DEPRECATED)
```json
{
  "$schema": "https://schemas.runtipi.io/v2/dynamic-compose.json",
  "schemaVersion": 2,
  "services": [
    {
      "name": "m3u-editor_redis",
      "image": "redis:alpine3.22",
      "command": [
        "redis-server",
        "--port", "6379",
        "--appendonly", "no",
        "--save", "",
        "--maxmemory", "256mb",
        "--maxmemory-policy", "allkeys-lru"
      ],
      "volumes": [
        {
          "hostPath": "${APP_DATA_DIR}/data/redis",
          "containerPath": "/data"
        }
      ],
      "healthCheck": {
        "test": "redis-cli -p 6379 ping",
        "interval": "10s",
        "timeout": "5s",
        "retries": 3
      }
    },
    {
      "name": "m3u-proxy",
      "image": "sparkison/m3u-proxy:latest",
      "environment": [
        {
          "key": "API_TOKEN",
          "value": "${M3U_PROXY_TOKEN}"
        },
        {
          "key": "PORT",
          "value": "38085"
        },
        {
          "key": "LOG_LEVEL",
          "value": "info"
        }
      ],
      "dependsOn": ["m3u-editor_redis"]
    },
    {
      "name": "m3u-editor",
      "image": "sparkison/m3u-editor:latest",
      "isMain": true,
      "internalPort": 3000,
      "ports": [...],
      "environment": [...],
      "dependsOn": {
        "m3u-proxy": { "condition": "service_started" },
        "m3u-editor_redis": { "condition": "service_healthy" }
      }
    }
  ]
}
```

### ✅ Depois (YAML - NEW FORMAT)
```yaml
version: '3'

services:
  m3u-editor_redis:
    image: redis:alpine3.22
    command:
      - redis-server
      - "--port"
      - "6379"
      - "--appendonly"
      - "no"
      - "--save"
      - ""
      - "--maxmemory"
      - "256mb"
      - "--maxmemory-policy"
      - "allkeys-lru"
    volumes:
      - ${APP_DATA_DIR}/data/redis:/data
    healthcheck:
      test: redis-cli -p 6379 ping
      interval: 10s
      timeout: 5s
      retries: 3

  m3u-proxy:
    image: sparkison/m3u-proxy:latest
    environment:
      - API_TOKEN=${M3U_PROXY_TOKEN}
      - PORT=38085
      - LOG_LEVEL=info
    depends_on:
      m3u-editor_redis:
        condition: service_healthy

  m3u-editor:
    image: sparkison/m3u-editor:latest
    ports:
      - "8880:3000"
    environment:
      - M3U_EDITOR_TOKEN=${M3U_EDITOR_TOKEN}
      - PROXY_HOST=m3u-proxy
      - PROXY_PORT=38085
    depends_on:
      m3u-proxy:
        condition: service_started
      m3u-editor_redis:
        condition: service_healthy
    x-runtipi:
      is_main: true
      internal_port: 3000

x-runtipi:
  schema_version: 2
```

---

## Mapeamento de Campos

| JSON (Deprecated) | YAML (New) | Descrição |
|------------------|-----------|-----------|
| `"$schema"` | *(removed)* | Schema validation é implícita no YAML |
| `"schemaVersion": 2` | `x-runtipi.schema_version: 2` | Versão especificação (root level) |
| `"services": [{...}]` | `services: {name: {...}}` | Array JSON → Object YAML |
| `"name": "service"` | Service key em `services:` | Nome é a chave YAML |
| `"isMain": true` | `x-runtipi.is_main: true` | Marca o serviço exposto |
| `"internalPort": 3000` | `x-runtipi.internal_port: 3000` | Porta do container |
| `"environment": [{key, value}]` | `environment: [KEY=value]` | Lista simples YAML |
| `"volumes": [{hostPath, containerPath}]` | `volumes: [/host:/container]` | Bind mounts YAML |
| `"healthCheck": {...}` | `healthcheck: {...}` | Health checks (minúscula) |
| `"dependsOn": [...]` (PERIGOSO!) | `depends_on: {service: {condition: ...}}` | **SEMPRE com condition agora** |

---

## Padrões Importantes

### ✅ Dependências SEMPRE com Conditions

**❌ WRONG (causes "connection refused"):**
```json
"dependsOn": ["postgres", "redis"]
```

```yaml
depends_on:
  - postgres
  - redis
```

**✅ CORRECT:**
```yaml
depends_on:
  postgres:
    condition: service_healthy
  redis:
    condition: service_healthy
```

### ✅ Health Checks em Serviços Críticos

```yaml
healthcheck:
  test: pg_isready -U postgres          # ou `curl`, `redis-cli ping`, etc.
  interval: 10s                          # frequência
  timeout: 5s                            # máximo por check
  retries: 5                             # tentativas antes de marcar como unhealthy
  start_period: 30s                      # tempo para app começar
  start_interval: 5s                     # intervalo inicial (mais agressivo)
```

### ✅ Environment Variables

```yaml
# Simples (valor direto)
environment:
  - LOG_LEVEL=info
  - NODE_ENV=production

# Com variáveis do sistema
environment:
  - DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}
  - APP_PORT=${APP_PORT}
  - REDIS_URL=redis://redis:6379/0

# Sem variáveis (deixar vazio se souber que vem de outro lugar)
# - IMPORTANTE: NUNCA deixar em branco um campo que Runtipi injeta!
```

### ✅ Volumes

```yaml
volumes:
  # Diretório persistente da app
  - ${APP_DATA_DIR}/data:/app/data

  # Read-only volumes
  - /etc/config:/app/config:ro

  # Shared volumes entre serviços
  - shared-data:/var/app/shared

  # Com propagação
  - ${APP_DATA_DIR}/db:/var/lib/postgresql/data:rprivate
```

### ✅ Ports (STRINGS, não numbers!)

```yaml
# ✅ CORRETO
ports:
  - "8830:3000"
  - "8831:9000"

# ❌ ERRADO
ports:
  - 8830:3000    # sem quotes
  - containerPort: 3000
    hostPort: 8830
```

---

## ✅ Validação Checklist

Ao converter um app:

- [ ] Arquivo é `docker-compose.yml` (não `.json`)
- [ ] Começa com `version: '3'`
- [ ] Tem `x-runtipi.schema_version: 2` no root
- [ ] Tem EXATAMENTE 1 `x-runtipi.is_main: true`
- [ ] Serviços estão como YAML objects (chaves), não arrays
- [ ] Environment é lista YAML (`- KEY=value`), não array de objetos
- [ ] Volumes são lista YAML (`- /host:/container`), não array
- [ ] `depends_on` usa object format com conditions
- [ ] Health checks presentes em serviços críticos
- [ ] Port format é string: `"8830:3000"`
- [ ] Image tag é específico (nunca `latest`)
- [ ] Ou apps que tinham JSON, ainda têm `.json` para compatibilidade

---

## 📝 Notas Importantes

### Versões Docker Compose
- O novo formato usa `version: '3'` (Docker Compose v3.x)
- Compatível com Docker 1.18+ e docker-compose 1.27+
- `x-runtipi` é extensão custom (ignorada por docker-compose padrão)

### Backward Compatibility
- Runtipi pode suportar ambos formatos durante transição
- JSON original não foi deletado (pode manter ambos)
- Planejar migração gradual quando necessário

### Migração de Projetos Existentes
Se precisarem converter um docker-compose.yml padrão para o formato Runtipi:
1. Converter JSON → YAML se necessário
2. Adicionar seção `x-runtipi` em cada serviço
3. Adicionar `x-runtipi.schema_version: 2` no root
4. Marcar serviço exposto com `is_main: true`
5. Adicionar health checks em serviços críticos
6. Garantir que `depends_on` usa conditions

---

## 🔗 Referências

- **Especificação Completa:** `docs/DYNAMIC_COMPOSE_SPEC_v2.md`
- **Diretrizes para Devs:** `.github/copilot-instructions.md`
- **Agent Guide:** `AGENTS.md`
- **Resumo Migração:** `docs/MIGRATION_SUMMARY_JSON_to_YAML.md`

---

**Última Atualização:** 1º de Abril, 2026  
**Formato:** Dynamic Compose v2 YAML + x-runtipi  
**Status:** ✅ Completo - 38/38 apps convertidos
