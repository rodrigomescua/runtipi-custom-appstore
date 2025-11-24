
# Diretrizes para o Copilot

- Cada aplicativo em `apps` deve conter pelo menos:
  - `config.json`
  - `docker-compose.json` (formato dynamic compose)
  - uma pasta `metadata` com:
    - `description.md`
    - `logo.jpg` (obrigatório, JPG, resolução 512x512)

**Importante:** Cada app deve ter **apenas** o arquivo `docker-compose.json` (formato dynamic compose). Os arquivos `docker-compose.yml` ou `docker-compose.yaml` **não devem existir** na pasta do app.

---

## Padrão para `config.json` de cada app

### Campos obrigatórios

- `name` (string): Nome do app. Exemplo: "Nginx"
- `id` (string): Deve ser igual ao nome da pasta do app. Exemplo: "nginx"
- `available` (boolean): true/false. Indica se o app está disponível na loja.
- `short_desc` (string): Descrição curta do app. Exemplo: "Servidor web de alto desempenho"
- `author` (string): Nome do autor ou organização. Exemplo: "nginx" ou "https://nextcloud.com"
- `port` (number): Porta pública no host onde o app será acessível. Exemplo: 8754
- `categories` (array de string): Categorias do app. Veja lista completa abaixo.
- `description` (string): Descrição longa do app.
- `tipi_version` (number): Versão do app para o Runtipi. Sempre 1 para novo app, incremente ao atualizar.
- `version` (string): Versão do app, siga semver. Exemplo: "1.25.3"
- `source` (string): URL do repositório do app. Exemplo: "https://github.com/nginx/nginx"
- `exposable` (boolean): true/false. Permite expor o app por domínio.
- `form_fields` (array): Campos de formulário para configuração. Pode ser vazio ([]). Veja seção detalhada abaixo.
- `supported_architectures` (array de string): Arquiteturas suportadas. Exemplo: ["arm64", "amd64"]
- `dynamic` (boolean): **SEMPRE true para este repositório.** Todos os apps devem usar o novo formato `docker-compose.json` dinâmico. Esta é uma diretriz do projeto para manter consistência e aproveitar recursos modernos do Runtipi.

### Padrão detalhado para o campo `form_fields`

O campo `form_fields` é um array de objetos que definem campos de configuração exibidos ao usuário durante a instalação:

**Propriedades de cada campo:**

- **Obrigatórias:**
  - `type` (string): Tipo do campo. Valores aceitos:
    - `"text"`: Texto simples
    - `"password"`: Senha (oculta na entrada)
    - `"email"`: E-mail com validação
    - `"number"`: Número
    - `"fqdn"`: Fully Qualified Domain Name
    - `"ip"`: Endereço IPv4
    - `"fqdnip"`: FQDN ou IPv4
    - `"random"`: Valor gerado automaticamente
    - `"boolean"`: Caixa de seleção (true/false)
  - `label` (string): Texto exibido ao usuário
  - `required` (boolean): Se o campo é obrigatório
  - `env_variable` (string): Nome da variável de ambiente para o docker-compose

- **Opcionais:**
  - `hint` (string): Dica exibida ao usuário
  - `placeholder` (string): Texto de exemplo no campo
  - `default` (string/number/boolean): Valor padrão se não preenchido (só válido se `required: false`)
  - `min` (number): Tamanho/valor mínimo:
    - Para texto/password: tamanho mínimo de caracteres
    - Para `random`: tamanho da string gerada (padrão: 32 caracteres)
    - Para `number`: valor mínimo
  - `max` (number): Tamanho/valor máximo:
    - Para texto/password: tamanho máximo de caracteres
    - Para `number`: valor máximo
  - `regex` (string): Expressão regular para validação do input
  - `pattern_error` (string): Mensagem de erro se regex falhar
  - `options` (array de objetos): Valores pré-definidos com `label` (string) e `value` (string)
  - `encoding` (string): Para campos `random`, especifica encoding: `"base64"` ou `"hex"`

**Nota importante sobre `options`:** Use apenas quando há valores pré-definidos específicos. Se o usuário puder usar valores customizados, use um campo texto normal com exemplos na label.

**Exemplo de campo simples:**
```json
{
  "type": "text",
  "label": "Usuário",
  "required": true,
  "env_variable": "APP_USER",
  "min": 3,
  "max": 50,
  "hint": "Nome de usuário (3-50 caracteres)"
}
```

**Exemplo com opções (multi-select):**
```json
{
  "type": "text",
  "label": "Escolha uma fruta",
  "required": true,
  "env_variable": "FRUIT",
  "options": [
    { "label": "Maçã", "value": "apple" },
    { "label": "Banana", "value": "banana" },
    { "label": "Laranja", "value": "orange" }
  ]
}
```

**Exemplo de campo password:**
```json
{
  "type": "password",
  "label": "Senha do admin",
  "required": true,
  "env_variable": "ADMIN_PASSWORD",
  "min": 8,
  "max": 100
}
```

**Exemplo de campo random (gerar chave secreta):**
```json
{
  "type": "random",
  "label": "Chave secreta",
  "required": false,
  "env_variable": "SECRET_KEY",
  "min": 32,
  "encoding": "hex"
}
```

**Exemplo de campo email:**
```json
{
  "type": "email",
  "label": "E-mail do administrador",
  "required": true,
  "env_variable": "ADMIN_EMAIL",
  "placeholder": "admin@example.com"
}
```

**Exemplo de campo FQDN:**
```json
{
  "type": "fqdn",
  "label": "Domínio da aplicação",
  "required": true,
  "env_variable": "APP_DOMAIN",
  "placeholder": "myapp.example.com"
}
```

**Exemplo de campo boolean:**
```json
{
  "type": "boolean",
  "label": "Ativar modo debug?",
  "required": false,
  "env_variable": "DEBUG_MODE",
  "default": false
}
```

**Exemplo com validação regex:**
```json
{
  "type": "text",
  "label": "Versão (ex: 1.2.3)",
  "required": true,
  "env_variable": "APP_VERSION",
  "regex": "^[0-9]+\\.[0-9]+\\.[0-9]+$",
  "pattern_error": "Versão deve estar no formato X.Y.Z"
}
```

### Campos opcionais

- `$schema` (string): Link para validação do config. Recomendado usar: `"https://schemas.runtipi.io/v2/app-info.json"`
- `website` (string): URL do site oficial. Exemplo: "https://www.nginx.com/"
- `force_expose` (boolean): true/false. Se true, exige que o app seja exposto por domínio (user não pode escolher apenas porta).
- `generate_vapid_keys` (boolean): true/false. Se true, o app gerará VAPID keys para web push. As variáveis `VAPID_PUBLIC_KEY` e `VAPID_PRIVATE_KEY` estarão disponíveis.
- `url_suffix` (string): Sufixo de URL para acesso ao app. Exemplo: "myapp". App será acessível em `https://<seu-dominio>/myapp`
- `https` (boolean): true/false. Se true, acessível apenas via HTTPS (inseguro tentar HTTP).
- `no_gui` (boolean): true/false. true para apps sem interface gráfica (não mostra botão "Abrir").
- `uid`, `gid` (number): Permissões para pasta de dados do app. Runtipi fará `chown` automaticamente. **Ambos devem ser especificados** para aplicar.
- `deprecated` (boolean): true/false. Se true, o app não aparecerá na loja e notificará usuários que não é mais mantido.
- `min_tipi_version` (string): Versão mínima do Runtipi exigida. Exemplo: "v3.0.0"
- `created_at` (number): Timestamp (ms) de quando o app foi criado. Gere com `Date.now()` no console do browser.
- `updated_at` (number): Timestamp (ms) da última atualização do app. Gere com `Date.now()` no console do browser.
- `dynamic` (boolean): Se false, não usa o novo formato `docker-compose.json` dinâmico. Padrão: false. **Recomendamos sempre usar true** e o formato dynamic compose.

### Categorias disponíveis

featured, utilities, automation, network, media, productivity, security, monitoring, backup, development, dashboard, cloud, database, social, tools, home, entertainment, storage, communication

### Padrões e boas práticas para config.json

- **Sempre use `supported_architectures`** se o app tem limitações. Deixe vazio ([]) se suporta todas.
- **`form_fields` deve ser um array válido**, mesmo que vazio. Não omita o campo.
- **Use `dynamic: true`** para todos os apps novos - é o padrão moderno do Runtipi.
- **`port` é a porta que será exposta** no host, não a porta interna do container (essa fica em `docker-compose.json` em `internalPort`).
- **`tipi_version` serve para versionamento** dentro do Runtipi. Use 1 para novo app, incremente ao atualizar a configuração.
- **Não repita campos** na lista de opcionais.
- **Use `$schema`** para validação automática em editores JSON:
  ```json
  "$schema": "https://schemas.runtipi.io/v2/app-info.json"
  ```
- **`force_expose` vs `exposable`:**
  - `exposable: true, force_expose: false`: Usuário escolhe entre porta ou domínio
  - `exposable: true, force_expose: true`: Obriga uso de domínio
  - `exposable: false`: Apenas porta interna, sem exposição
- **Para `uid`/`gid`**, especifique ambos ou nenhum. Exemplo: `"uid": 1000, "gid": 1000`
- **Timestamps (`created_at`, `updated_at`)** são em milissegundos. Gere com `Date.now()`.
- **Para senhas/secrets em `random`:**
  - Sempre use `"min": 32` ou maior
  - Use `"encoding": "base64"` ou `"encoding": "hex"`
  - Use `"required": true`

### Exemplo completo de `config.json`

```json
{
  "$schema": "https://schemas.runtipi.io/v2/app-info.json",
  "name": "Nextcloud",
  "id": "nextcloud",
  "available": true,
  "short_desc": "Plataforma de compartilhamento de arquivos self-hosted",
  "author": "Nextcloud",
  "port": 8100,
  "version": "29.0.1",
  "tipi_version": 1,
  "source": "https://github.com/nextcloud/docker",
  "website": "https://nextcloud.com",
  "description": "Nextcloud é uma suite de cliente-servidor para criar e usar serviços de hospedagem de arquivos. Nextcloud é gratuito e open-source, permitindo instalação e operação em seus próprios servidores.",
  "categories": ["productivity", "storage", "cloud"],
  "supported_architectures": ["amd64", "arm64"],
  "exposable": true,
  "force_expose": false,
  "https": true,
  "dynamic": true,
  "form_fields": [
    {
      "type": "text",
      "label": "Usuário admin",
      "required": true,
      "env_variable": "NEXTCLOUD_ADMIN_USER",
      "min": 3,
      "max": 50,
      "hint": "Nome de usuário para o administrador"
    },
    {
      "type": "password",
      "label": "Senha admin",
      "required": true,
      "env_variable": "NEXTCLOUD_ADMIN_PASSWORD",
      "min": 8,
      "max": 100,
      "hint": "Senha para o administrador (mín. 8 caracteres)"
    },
    {
      "type": "email",
      "label": "E-mail admin",
      "required": true,
      "env_variable": "NEXTCLOUD_ADMIN_EMAIL",
      "placeholder": "admin@example.com"
    },
    {
      "type": "random",
      "label": "Chave de secret",
      "required": false,
      "env_variable": "NEXTCLOUD_SECRET",
      "min": 32,
      "encoding": "hex"
    }
  ],
  "uid": 1000,
  "gid": 1000,
  "created_at": 1724134938430,
  "updated_at": 1724134938430
}
```

---

## Diretrizes para o uso de dynamic compose (`docker-compose.json`)

- Todos os apps devem usar o formato dynamic compose (`dynamic = true` no `config.json`).
- O arquivo obrigatório é `docker-compose.json` (não `docker-compose.yml`).
- Estrutura top-level:
  - `schemaVersion` (number, obrigatório): Sempre `2`
  - `services` (array, obrigatório): Array de serviços
  - `overrides` (array, opcional): Configurações específicas por arquitetura (arm64, amd64)

**Campos obrigatórios por serviço:**
- `name`: nome do serviço (ex: "nginx")
- `image`: nome e tag da imagem Docker (evite `latest`)
- `internalPort`: porta interna do container

**Campos opcionais importantes por serviço:**
- `isMain`: booleano, **true apenas no serviço principal** que será exposto (onde o Traefik aplicará labels). Para outros serviços, este campo é opcional e pode ser omitido.
- Demais campos opcionais detalhados abaixo.

**Múltiplos serviços:** Apps podem ter múltiplos serviços (ex: banco de dados, cache, fila). Apenas o serviço principal que será acessado deve ter `"isMain": true`. Os serviços de suporte (banco de dados, cache, etc) não devem ter este campo ou devem tê-lo como `false`.

**`healthCheck`:** Use para monitorar o estado do serviço. Exemplo:
```json
"healthCheck": {
  "test": "curl --fail http://localhost/health",
  "interval": "30s",
  "timeout": "10s",
  "retries": 3,
  "startPeriod": "40s"
}
```

**Variáveis de ambiente especiais:**
- `${APP_DATA_DIR}`: Diretório de dados do app (ex: `/app-data/myapp`)
- `${TZ}`: Timezone do host (ex: `America/Sao_Paulo`)
- `${RUNTIPI_MEDIA_DIR}`: Diretório de mídia do Runtipi (se aplicável)
- Variáveis de `form_fields` são referenciadas como `${FIELD_NAME}` (ex: se houver um field com `env_variable: "DB_HOST"`, use `${DB_HOST}`)

Exemplo com volumes:
```json
"volumes": [
  {
    "hostPath": "${APP_DATA_DIR}/data",
    "containerPath": "/app/data"
  }
]
```

### Documentação detalhada dos campos opcionais

#### `environment` (array de objetos)
Define variáveis de ambiente para o container.

**Estrutura:**
```json
"environment": [
  {
    "key": "DATABASE_URL",
    "value": "postgres://user:pass@db:5432/myapp"
  },
  {
    "key": "DEBUG",
    "value": "false"
  }
]
```

**Campos:**
- `key` (string, obrigatório): Nome da variável de ambiente
- `value` (string/number/boolean, obrigatório): Valor da variável (pode ser string, número ou booleano)

**Boas práticas:**
- Use referências de `form_fields` para valores dinâmicos do usuário: `${ENV_VARIABLE_NAME}`
- Não exponha senhas ou tokens diretamente (use `form_fields` com `type: "password"`)
- Use variáveis em UPPERCASE_SNAKE_CASE
- Documente todas as variáveis necessárias

#### `volumes` (array de objetos)
Define volumes para persistência de dados e compartilhamento de arquivos.

**Estrutura:**
```json
"volumes": [
  {
    "hostPath": "${APP_DATA_DIR}/config",
    "containerPath": "/etc/app",
    "readOnly": true,
    "shared": false,
    "private": false
  },
  {
    "hostPath": "${APP_DATA_DIR}/data",
    "containerPath": "/data",
    "readOnly": false
  }
]
```

**Campos:**
- `hostPath` (string, obrigatório): Caminho no host. Use `${APP_DATA_DIR}` para dados do app
  - **⚠️ IMPORTANTE - Padrão obrigatório:** Todos os `hostPath` **DEVEM** começar com `${APP_DATA_DIR}/data/` ou ser caminho relativo dentro deste diretório
  - Exemplos corretos: `${APP_DATA_DIR}/data/postgres`, `${APP_DATA_DIR}/data/config`, `${APP_DATA_DIR}/data/uploads`
  - Exceção: Apenas para caminhos do sistema como `/var/run/dbus` (raro)
- `containerPath` (string, obrigatório): Caminho dentro do container
- `readOnly` (boolean, opcional): Se true, volume é somente leitura. Padrão: `false`
- `shared` (boolean, opcional): Se true, permite compartilhamento entre múltiplos containers. Padrão: `false`
- `private` (boolean, opcional): Se true, o volume é privado. Padrão: `false`
- `bind` (object, opcional): Configuração de propagação de bind mounting:
  - `propagation` (string): Valores possíveis: `rprivate`, `private`, `rshared`, `shared`, `rslave`, `slave`. Padrão: `rprivate`

**Exemplos comuns:**
```json
// Banco de dados com persistência (leitura/escrita)
{
  "hostPath": "${APP_DATA_DIR}/postgres",
  "containerPath": "/var/lib/postgresql/data"
}

// Config read-only
{
  "hostPath": "${APP_DATA_DIR}/config.yml",
  "containerPath": "/etc/app/config.yml",
  "readOnly": true
}

// Volume compartilhado entre múltiplos serviços
{
  "hostPath": "${APP_DATA_DIR}/shared",
  "containerPath": "/app/shared",
  "shared": true
}

// Volume com bind propagation
{
  "hostPath": "${APP_DATA_DIR}/data",
  "containerPath": "/data",
  "bind": {
    "propagation": "rprivate"
  }
}
```

#### `addPorts` (array de objetos)
Define portas adicionais além de `internalPort`.

**Estrutura:**
```json
"addPorts": [
  {
    "containerPort": 8080,
    "hostPort": 8080,
    "tcp": true,
    "udp": false,
    "interface": "127.0.0.1"
  }
]
```

**Campos:**
- `containerPort` (number, obrigatório): Porta no container
- `hostPort` (number, obrigatório): Porta no host
- `tcp` (boolean, opcional): Expor TCP. Padrão: `true`
- `udp` (boolean, opcional): Expor UDP. Padrão: `false`
- `interface` (string, opcional): Interface de rede (ex: `"127.0.0.1"` para localhost, `"0.0.0.0"` para todas)

**Exemplos:**
```json
// Expor porta Prometheus
{
  "containerPort": 9090,
  "hostPort": 9090
}

// Expor apenas em localhost
{
  "containerPort": 3000,
  "hostPort": 3000,
  "interface": "127.0.0.1"
}

// UDP (ex: DNS)
{
  "containerPort": 53,
  "hostPort": 53,
  "udp": true,
  "tcp": false
}
```

#### `networkMode` (string)
Define o modo de rede do container.

**Valores possíveis:**
- `"bridge"`: Bridge network (padrão)
- `"host"`: Usa network stack do host (útil para scanning de rede, etc)
- `"none"`: Sem conectividade de rede

**Exemplo:**
```json
"networkMode": "host"
```

#### `addToMainNetwork` (boolean)
Adiciona o container à rede principal do Runtipi.

**Exemplo:**
```json
"addToMainNetwork": true
```

#### `extraHosts` (array de strings)
Adiciona entradas customizadas ao `/etc/hosts` do container.

**Estrutura:**
```json
"extraHosts": ["host1:192.168.1.100", "host2:10.0.0.1"]
```

#### `hostname` (string)
Define o hostname do container.

**Exemplo:**
```json
"hostname": "mycontainer"
```

#### `dns` (string ou array de strings)
Define servidores DNS customizados.

**Exemplos:**
```json
// String única
"dns": "8.8.8.8"

// Array
"dns": ["8.8.8.8", "1.1.1.1"]
```

#### `dependsOn` (array ou objeto)
Define dependências entre serviços. Garante que o serviço é iniciado após suas dependências.

**Formato array simples (espera apenas que os serviços iniciem):**
```json
"dependsOn": ["database", "redis"]
```

**Formato objeto com condições:**
```json
"dependsOn": {
  "database": {
    "condition": "service_healthy"
  },
  "redis": {
    "condition": "service_started"
  }
}
```

**Condições disponíveis:**
- `"service_healthy"`: Aguarda até que o healthCheck seja bem-sucedido
- `"service_started"`: Aguarda apenas que o container inicie
- `"service_completed_successfully"`: Aguarda que o container termine com sucesso

**Exemplos:**
```json
// App web depende de banco de dados
{
  "name": "app",
  "image": "myapp:1.0",
  "dependsOn": ["postgres"]
}

// Com condições
{
  "name": "app",
  "image": "myapp:1.0",
  "dependsOn": {
    "postgres": {
      "condition": "service_healthy"
    }
  }
}
```

#### `command` (string ou array)
Sobrescreve o comando padrão executado no container.

**Exemplos:**
```json
// Como string
"command": "python app.py --port 8080"

// Como array (recomendado)
"command": ["python", "app.py", "--port", "8080"]

// Executar shell script
"command": "/bin/sh -c 'npm install && npm start'"

// Banco de dados com flags específicas
"command": ["postgres", "-c", "max_connections=200"]
```

#### `entrypoint` (string ou array)
Sobrescreve o ENTRYPOINT da imagem Docker. Use raramente; `command` é mais flexível.

**Exemplo:**
```json
// Usar um script customizado como ponto de entrada
"entrypoint": ["/app/docker-entrypoint.sh"]
```

#### `entrypoint` (string ou array)
Sobrescreve o ENTRYPOINT da imagem Docker. Use raramente; `command` é mais flexível.

**Exemplo:**
```json
// Usar um script customizado como ponto de entrada
"entrypoint": ["/app/docker-entrypoint.sh"]
```

#### `workingDir` (string)
Define o diretório de trabalho dentro do container.

**Exemplo:**
```json
"workingDir": "/app"
```

#### `tty` (boolean)
Aloca um pseudo-TTY para o container. Útil para aplicações interativas.

**Exemplo:**
```json
"tty": true
```

#### `stdinOpen` (boolean)
Mantém STDIN aberto mesmo sem anexação (attach).

**Exemplo:**
```json
"stdinOpen": true
```

#### `stopSignal` (string)
Define o sinal a ser enviado para parar o container.

**Valores comuns:**
- `"SIGTERM"`: Termination signal (padrão)
- `"SIGKILL"`: Kill signal (forceful)
- `"SIGHUP"`: Hangup signal
- Outros sinais POSIX

**Exemplo:**
```json
"stopSignal": "SIGTERM"
```

#### `stopGracePeriod` (string)
Tempo para aguardar o container parar gracefully antes de matar.

**Exemplo:**
```json
"stopGracePeriod": "10s"
```

#### `pid` (string)
Define o namespace PID do container.

**Valores possíveis:**
- `"host"`: Usa o namespace PID do host
- `"service:name"`: Compartilha namespace com outro serviço

**Exemplo:**
```json
"pid": "host"
```

#### `sysctls` (object)
Define configurações sysctl no container.

**Estrutura:**
```json
"sysctls": {
  "net.core.somaxconn": 1024,
  "net.ipv4.ip_forward": 1
}
```

**Nota:** Valores devem ser números.

#### `healthCheck` (objeto)
Monitora a saúde do container. Docker pode reiniciar containers com status "unhealthy".

**Estrutura completa:**
```json
"healthCheck": {
  "test": "curl --fail http://localhost:8080/health",
  "interval": "30s",
  "timeout": "10s",
  "retries": 3,
  "startPeriod": "40s",
  "startInterval": "5s"
}
```

**Campos:**
- `test` (string): Comando de teste (ex: `curl --fail http://localhost/health`)
- `interval` (string): Intervalo entre checks (padrão: `30s`)
- `timeout` (string): Timeout para cada check (padrão: `5s`)
- `retries` (number): Falhas consecutivas até marcar "unhealthy" (padrão: 3)
- `startPeriod` (string): Tempo para aguardar antes de começar checks (padrão: `0s`)
- `startInterval` (string): Intervalo entre checks durante `startPeriod` (padrão: `5s`)

**Exemplos por tipo de serviço:**

```json
// App web com endpoint /health
{
  "test": "curl --fail http://localhost:8080/health",
  "interval": "30s",
  "timeout": "10s",
  "retries": 3,
  "startPeriod": "40s"
}

// PostgreSQL
{
  "test": "pg_isready -U postgres",
  "interval": "10s",
  "timeout": "5s",
  "retries": 5
}

// Redis
{
  "test": "redis-cli ping",
  "interval": "10s",
  "timeout": "5s",
  "retries": 5
}

// MySQL
{
  "test": "mysqladmin ping -h localhost",
  "interval": "10s",
  "timeout": "5s",
  "retries": 5
}
```

#### `deploy` (object)
Configurações de recursos e deployment.

**Estrutura:**
```json
"deploy": {
  "resources": {
    "limits": {
      "cpus": "0.5",
      "memory": "512M",
      "pids": 100
    },
    "reservations": {
      "cpus": "0.25",
      "memory": "256M"
    }
  }
}
```

**Campos:**
- `limits`: Limites máximos de recursos
  - `cpus` (string): Limite de CPU (ex: `"0.5"` = 50% de 1 CPU)
  - `memory` (string): Limite de memória (ex: `"512M"`, `"1G"`)
  - `pids` (number): Limite de PIDs
- `reservations`: Reserva de recursos (soft limits)
  - `cpus` (string): CPUs reservadas
  - `memory` (string): Memória reservada
  - `devices` (array): Dispositivos GPU, etc.

**Exemplo com GPU:**
```json
"deploy": {
  "resources": {
    "reservations": {
      "devices": [
        {
          "capabilities": ["gpu"],
          "driver": "nvidia",
          "count": 1
        }
      ]
    }
  }
}
```

#### `ulimits` (object)
Define limites de recursos do sistema operacional.

**Estrutura:**
```json
"ulimits": {
  "nproc": {
    "soft": 10,
    "hard": 20
  },
  "nofile": {
    "soft": 20,
    "hard": 30
  },
  "core": 1024,
  "memlock": {
    "soft": 512,
    "hard": 1024
  }
}
```

**Tipos suportados:**
- `nproc`: Número máximo de processos
- `nofile`: Número máximo de arquivos abertos
- `core`: Tamanho máximo do core dump
- `memlock`: Memória máxima lockable

**Nota:** Valores podem ser números simples ou objetos com `soft` e `hard`.

#### `shmSize` (string)
Define o tamanho de `/dev/shm` (memória compartilhada).

**Exemplo:**
```json
"shmSize": "2gb"
```

#### `logging` (object)
Configuração de logs do container.

**Estrutura:**
```json
"logging": {
  "driver": "json-file",
  "options": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

**Drivers comuns:**
- `"json-file"`: Padrão do Docker (JSON)
- `"syslog"`: Enviar para syslog
- `"awslogs"`: Amazon CloudWatch
- `"splunk"`: Splunk
- `"gcplogs"`: Google Cloud Logging

#### `devices` (array de strings)
Mapear dispositivos do host para o container.

**Exemplo:**
```json
"devices": ["/dev/ttyUSB0:/dev/ttyUSB0", "/dev/video0:/dev/video0"]
```

#### `extraLabels` (object)
Adicionar labels customizados ao container.

**Estrutura:**
```json
"extraLabels": {
  "com.example.key": "value",
  "org.custom.label": "123"
}
```

**Nota:** Valores podem ser strings ou booleanos.

#### `readOnly` (boolean)
Monta o filesystem raiz como read-only.

**Exemplo:**
```json
"readOnly": true
```

#### `user` (string)
Define o usuário para executar o container.

**Exemplos:**
```json
// Username
"user": "www-data"

// UID:GID
"user": "1000:1000"
```

#### `capAdd` (array de strings)
Adiciona Linux capabilities ao container.

**Exemplos comuns:**
```json
"capAdd": ["NET_ADMIN", "SYS_TIME"]
```

**Capabilities comuns:**
- `NET_ADMIN`: Administração de rede
- `SYS_TIME`: Mudar hora do sistema
- `SYS_ADMIN`: Operações administrativas do sistema
- `NET_RAW`: Raw sockets (network)
- `IPC_LOCK`: Bloquear memória

**⚠️ Cuidado:** Use apenas se necessário, pois reduzem segurança.

#### `capDrop` (array de strings)
Remove Linux capabilities do container.

**Exemplo:**
```json
"capDrop": ["NET_RAW", "SYS_ADMIN"]
```

#### `securityOpt` (array de strings)
Opções de segurança customizadas.

**Exemplos:**
```json
"securityOpt": ["no-new-privileges:true"]
```

### Arquitetura Overrides (`overrides`)

Permitem diferentes configurações para arquiteturas específicas (arm64, amd64).

**Estrutura:**
```json
{
  "schemaVersion": 2,
  "services": [
    {
      "name": "app",
      "image": "myapp:latest",
      "isMain": true,
      "internalPort": 8080
    }
  ],
  "overrides": [
    {
      "architecture": "arm64",
      "services": [
        {
          "name": "app",
          "image": "myapp:arm64-latest"
        }
      ]
    },
    {
      "architecture": "amd64",
      "services": [
        {
          "name": "app",
          "image": "myapp:amd64-latest",
          "deploy": {
            "resources": {
              "reservations": {
                "devices": [
                  {
                    "capabilities": ["gpu"]
                  }
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
```

**Arquiteturas suportadas:**
- `"arm64"`: ARM 64-bit (aarch64)
- `"amd64"`: x86 64-bit (x86_64)

**Importante:**
- Sempre inclua o campo `name` no override para identificar o serviço
- Especifique apenas as propriedades que mudam
- Arrays em overrides substituem completamente (não append)
- Properties são deep-merged com a config base

### Recomendações gerais

- Sempre defina explicitamente as portas e variáveis de ambiente necessárias.
- **Volumes - PADRÃO OBRIGATÓRIO:** Todos os `hostPath` nos volumes **DEVEM começar com `${APP_DATA_DIR}/data/`**
  - Exemplo correto: `"hostPath": "${APP_DATA_DIR}/data/postgres"`, `"${APP_DATA_DIR}/data/config"`
  - Exceção rara: Caminhos do sistema como `/var/run/dbus` (documentar o por quê)
- Utilize `dependsOn` para garantir ordem de inicialização entre serviços.
- Adicione `healthCheck` para monitorar o estado dos serviços principais.
- Prefira imagens oficiais e tags específicas.
- Documente configurações customizadas no `description.md`.
- **NÃO use** `networks`, `labels`, `restart`, ou campos não-documentados aqui.

### Exemplo mínimo de `docker-compose.json`

```json
{
  "schemaVersion": 2,
  "services": [
    {
      "name": "nginx",
      "image": "nginx:1.25.3",
      "isMain": true,
      "internalPort": 80
    }
  ]
}
```

### Exemplo completo com múltiplos serviços

```json
{
  "schemaVersion": 2,
  "services": [
    {
      "name": "app",
      "image": "myapp:1.0.0",
      "isMain": true,
      "internalPort": 8080,
      "environment": [
        {
          "key": "DATABASE_URL",
          "value": "${DB_HOST}"
        },
        {
          "key": "REDIS_URL",
          "value": "redis://redis:6379"
        }
      ],
      "volumes": [
        {
          "hostPath": "${APP_DATA_DIR}/config",
          "containerPath": "/app/config"
        }
      ],
      "dependsOn": {
        "postgres": {
          "condition": "service_healthy"
        },
        "redis": {
          "condition": "service_started"
        }
      },
      "healthCheck": {
        "test": "curl --fail http://localhost:8080/health",
        "interval": "30s",
        "timeout": "10s",
        "retries": 3,
        "startPeriod": "40s"
      }
    },
    {
      "name": "postgres",
      "image": "postgres:15-alpine",
      "internalPort": 5432,
      "environment": [
        {
          "key": "POSTGRES_PASSWORD",
          "value": "${POSTGRES_PASSWORD}"
        },
        {
          "key": "POSTGRES_DB",
          "value": "myapp"
        }
      ],
      "volumes": [
        {
          "hostPath": "${APP_DATA_DIR}/postgres",
          "containerPath": "/var/lib/postgresql/data"
        }
      ],
      "healthCheck": {
        "test": "pg_isready -U postgres",
        "interval": "10s",
        "timeout": "5s",
        "retries": 5
      }
    },
    {
      "name": "redis",
      "image": "redis:7-alpine",
      "internalPort": 6379,
      "volumes": [
        {
          "hostPath": "${APP_DATA_DIR}/redis",
          "containerPath": "/data"
        }
      ],
      "healthCheck": {
        "test": "redis-cli ping",
        "interval": "10s",
        "timeout": "5s",
        "retries": 5
      }
    }
  ]
}
```

### Exemplo com Architecture Overrides

```json
{
  "schemaVersion": 2,
  "services": [
    {
      "name": "media-server",
      "image": "mediaserver:latest",
      "isMain": true,
      "internalPort": 8096,
      "volumes": [
        {
          "hostPath": "${APP_DATA_DIR}/config",
          "containerPath": "/config"
        },
        {
          "hostPath": "${RUNTIPI_MEDIA_DIR}",
          "containerPath": "/media"
        }
      ],
      "environment": [
        {
          "key": "TZ",
          "value": "${TZ}"
        }
      ]
    }
  ],
  "overrides": [
    {
      "architecture": "arm64",
      "services": [
        {
          "name": "media-server",
          "image": "mediaserver:arm64-latest"
        }
      ]
    },
    {
      "architecture": "amd64",
      "services": [
        {
          "name": "media-server",
          "image": "mediaserver:amd64-latest",
          "deploy": {
            "resources": {
              "reservations": {
                "devices": [
                  {
                    "capabilities": ["gpu"]
                  }
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
```
