# Runtipi Dynamic Compose Specification v2 (YAML)

## Overview

A especificação do Dynamic Compose foi atualizada para usar **YAML com extensões`x-runtipi`** em vez do formato JSON legacy. 

**Mudança Principal:** De `docker-compose.json` (JSON) → `docker-compose.yml` (YAML com `x-runtipi`)

---

## Estrutura YAML com x-runtipi

### Formato Básico

```yaml
version: '3'
services:
  myapp:
    image: myimage:1.0.0
    ports:
      - "8080:3000"  # host:container
    environment:
      - FOO=bar
    volumes:
      - ${APP_DATA_DIR}/data:/app/data
    healthcheck:
      test: curl --fail http://localhost
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      myapp-db:
        condition: service_healthy
    x-runtipi:
      is_main: true
      internal_port: 3000

  myapp-db:
    image: postgres:16
    volumes:
      - ${APP_DATA_DIR}/db:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_PASSWORD=${MYAPP_DB_PASSWORD}
    healthcheck:
      test: pg_isready -U postgres
      interval: 10s
      timeout: 5s
      retries: 5

x-runtipi:
  schema_version: 2
```

---

## Principais Mudanças do JSON para YAML

| Aspecto | Antigo (JSON) | Novo (YAML) |
|--------|----------|---------|
| **Arquivo** | `docker-compose.json` | `docker-compose.yml` |
| **Root** | `{ "schemaVersion": 2, "services": [...] }` | `version: '3'` + `x-runtipi:` |
| **Services** | Array de objetos | YAML services com nomes-chave |
| **isMain** | `"isMain": true` | `x-runtipi.is_main: true` |
| **internalPort** | `"internalPort": 8080` | `x-runtipi.internal_port: 8080` |
| **Environmental** | `"environment": [{...}]` (array) | `environment:` (lista ou mapa) |
| **Volumes** | `"volumes": [{...}]` (array) | `volumes:` (lista YAML) |
| **healthCheck** | `"healthCheck": {...}` | `healthcheck:` |
| **dependsOn** | Objeto com condições | `depends_on: {service: {condition: ...}}` |

---

## Configuração de Serviços no YAML

### Campos Principais

```yaml
services:
  myservice:
    image: registry/image:tag  # OBRIGATÓRIO
    container_name: custom-name
    ports:
      - "8080:3000"            # hostPort:containerPort
    environment:
      - KEY=value
      - ANOTHER_VAR=${FROM_ENV}
    volumes:
      - ./data:/app/data
      - /host/path:/container/path:ro  # readonly
    command: /bin/sh -c "..."  # string ou array
    entrypoint: /app/start.sh   # string ou array
    working_dir: /app
    user: 1000:1000
    privileged: false
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0
    cap_add:
      - NET_ADMIN
    cap_drop:
      - ALL
    read_only: false
    stdin_open: true
    tty: false
    hostname: myhost
    dns:
      - 8.8.8.8
      - 1.1.1.1
    extra_hosts:
      - "host.docker.internal:host-gateway"
    networks:
      - default
    restart_policy:
      condition: unless-stopped
      max_retries: 5
    security_opt:
      - no-new-privileges:true
    sysctls:
      - net.ipv4.ip_forward=1
    ulimits:
      nofile:
        soft: 1024
        hard: 2048
    shm_size: 1gb
    stop_signal: SIGTERM
    stop_grace_period: 30s
    healthcheck:
      test: curl -f http://localhost || exit 1
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

### Extensão x-runtipi

```yaml
services:
  myservice:
    image: myimage:1.0.0
    # ... configurações normais do docker-compose ...
    
    x-runtipi:
      is_main: true              # true apenas no serviço principal
      internal_port: 8080        # porta dentro do container
      add_ports:                 # portas adicionais (além da principal)
        - host_port: 8081
          container_port: 9000
          protocol: tcp
          interface: "0.0.0.0"
      add_to_main_network: true  # se deve conectar à rede principal
```

---

## Overrides por Arquitetura

```yaml
version: '3'
services:
  app:
    image: myapp:generic
    x-runtipi:
      is_main: true
      internal_port: 3000

x-runtipi:
  schema_version: 2
  overrides:
    - architecture: arm64
      services:
        app:
          image: myapp:arm64-latest
          environment:
            - ARCH_SPECIFIC=arm64
    - architecture: amd64
      services:
        app:
          image: myapp:amd64-latest
          environment:
            - ARCH_SPECIFIC=amd64
          deploy:
            resources:
              reservations:
                devices:
                  - driver: nvidia
                    count: 1
                    capabilities: [gpu]
```

---

## Dependências Entre Serviços

### Formato CORRETO (com health check)

```yaml
services:
  myapp:
    image: myapp:1.0.0
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_healthy
    x-runtipi:
      is_main: true

  db:
    image: postgres:16
    healthcheck:
      test: pg_isready -U postgres
      interval: 10s

  cache:
    image: redis:7
    healthcheck:
      test: redis-cli ping
      interval: 10s
```

### Condições Suportadas

- `service_started`: Container iniciou (menos confiável)
- `service_healthy`: Health check passou (RECOMENDADO)
- `service_completed_successfully`: Serviço completion task

---

## Volumes Padrão no Runtipi

### Variáveis Disponíveis

```yaml
volumes:
  # Dados persistentes da app
  - ${APP_DATA_DIR}/data:/app/data

  # Dados compartilhados entre apps
  - ${RUNTIPI_MEDIA_DIR}:/media

  # Configuração por app
  - ${APP_DATA_DIR}/config:/etc/app
```

### Exemplo Completo

```yaml
volumes:
  # Volume nomeado (gerenciado pelo Docker)
  - db-data:/var/lib/postgresql/data
  
  # Bind mount (diretório host)
  - ${APP_DATA_DIR}/config:/etc/app:ro
  
  # Com propagação
  - ${APP_DATA_DIR}/data:/app/data:rprivate
```

---

## Variáveis de Ambiente Runtipi

```yaml
environment:
  # Variáveis do próprio Runtipi
  - APP_PORT=${APP_PORT}           # porta host (8000-8999)
  - APP_DOMAIN=${APP_DOMAIN}       # domínio da app  
  - APP_DATA_DIR=${APP_DATA_DIR}   # diretório de dados
  - TZ=${TZ}                       # timezone
  - RUNTIPI_MEDIA_DIR=${RUNTIPI_MEDIA_DIR}
  
  # Variáveis do config.json (form_fields)
  - ADMIN_USER=${ADMIN_USER}       # campo do formulário
  - ADMIN_PASS=${ADMIN_PASS}       # campo do formulário
```

---

## Compatibilidade

### Suporte Removido
- ❌ `docker-compose.json` (format antigo)
- ❌ `schemaVersion: 2` em JSON

### Suporte Mantido
- ✅ `docker-compose.yml` com `x-runtipi`

### Migration Path
Apps usando o formato JSON antigo precisam ser atualizadas para YAML com `x-runtipi`.

---

## Health Check Completo (Exemplo PostgreSQL)

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres -d mydb"]
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 30s    # tempo para começar a fazer checks
  start_interval: 5s   # intervalo inicial (mais frequente)
```

---

## Deploy com Limites de Recurso

```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 1024M
      pids_limit: 200
    reservations:
      cpus: '0.5'
      memory: 512M
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

---

## Exemplo Completo: Linkding em YAML

```yaml
version: '3'
services:
  linkding:
    image: sissbruecker/linkding:1.44.1
    container_name: linkding
    ports:
      - "8830:9090"
    volumes:
      - ${APP_DATA_DIR}/data:/etc/linkding/data
    environment:
      - LD_SUPERUSER_NAME=${LD_SUPERUSER_NAME}
      - LD_SUPERUSER_EMAIL=${LD_SUPERUSER_EMAIL}
      - LD_SUPERUSER_PASSWORD=${LD_SUPERUSER_PASSWORD}
      - LD_CSRF_TRUSTED_ORIGINS=http://${APP_DOMAIN}:${APP_PORT},https://${APP_DOMAIN}
    healthcheck:
      test: curl -f http://localhost:9090 || exit 1
      interval: 30s
      timeout: 10s
      retries: 3
    restart_policy:
      condition: unless-stopped
    x-runtipi:
      is_main: true
      internal_port: 9090

x-runtipi:
  schema_version: 2
```

---

## Exemplo Completo: Dawarich (Multi-serviço)

```yaml
version: '3'
services:
  dawarich-redis:
    image: redis:7.4-alpine
    command: redis-server
    volumes:
      - ${APP_DATA_DIR}/data/redis:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  dawarich-db:
    image: postgis/postgis:17-3.5-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=dawarich_development
    volumes:
      - ${APP_DATA_DIR}/data/db:/var/lib/postgresql/data
    healthcheck:
      test: pg_isready -U postgres
      interval: 10s
      timeout: 5s
      retries: 5
    shm_size: 1gb

  dawarich:
    image: freikin/dawarich:0.36.1
    depends_on:
      dawarich-redis:
        condition: service_healthy
      dawarich-db:
        condition: service_healthy
    environment:
      - REDIS_URL=redis://dawarich-redis:6379
      - DATABASE_HOST=dawarich-db
      - DATABASE_USERNAME=postgres
      - DATABASE_PASSWORD=password
      - DATABASE_NAME=dawarich_development
    volumes:
      - ${APP_DATA_DIR}/data/storage:/app/storage
    ports:
      - "8880:3000"
    command: ["bin/rails", "server", "-p", "3000", "-b", "::"]
    healthcheck:
      test: curl -f http://localhost:3000 || exit 1
      interval: 30s
      timeout: 10s
      retries: 3
    x-runtipi:
      is_main: true
      internal_port: 3000

x-runtipi:
  schema_version: 2
```

---

## Ferramentas de Conversão

A documentação fornece conversors:
- Docker Compose YAML → Legacy JSON (para referência)
- Validador de schema inline

---

## Resumo das Principais Diferenças

1. **Arquivo**: `.json` → `.yml`
2. **Root**: `schemaVersion` → `x-runtipi.schema_version`
3. **Services**: Array → Mapa YAML (por nome)
4. **Configuração Runtipi**: Objeto separado → Seção `x-runtipi` em cada serviço
5. **Array Environment**: array de objetos → lista YAML ou variáveis
6. **Volumes**: array de objetos → lista YAML
7. **Health Checks**: suporta mais opções (start_period, start_interval)
8. **Dependencies**: sempre use `condition: service_healthy`

---

**Status**: Documentação Official Runtipi - Dynamic Compose Reference
**Data**: April 2026
**Suporte**: Runtipi v3.0.0+
