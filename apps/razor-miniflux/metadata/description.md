# Razor Miniflux

Frontend Razor Pages para gerenciar entradas do FreshRSS com regras e históricos
independentes para Normal e Top, ativos simultaneamente na mesma instância.

Antes de iniciar esta versão, configure o domínio Top, o PIN e os proxies
confiáveis e prepare o banco Top conforme a seção de migração abaixo.

## Domínio e PIN

Configure o hostname exclusivo Top (sem https://, porta ou caminho) e um PIN de
6 a 128 dígitos. Qualquer outro hostname acessa Normal. Não existe seletor na tela.
O proxy deve preservar Host e encaminhar o esquema HTTPS e o IP do cliente.
Top exige HTTPS e PIN, inclusive pelo domínio dedicado. Cinco erros por IP
bloqueiam tentativas por cinco minutos. Após 15 minutos sem ação do usuário,
saída explícita ou reinício da aplicação, é necessário autenticar novamente.
Polling não renova a autorização.

## Exemplos de TRUSTED_PROXIES

Use os IPs do proxy vistos pelo container, sem URL ou porta e separados por vírgulas:

| Situação | Exemplo |
| --- | --- |
| Um proxy na LAN | `192.168.1.10` |
| Dois proxies confiáveis | `192.168.1.10,172.18.0.2` |
| Rede Docker dedicada e confiável | `172.18.0.0/24` |
| Um proxy IPv6 | `fd12:3456:789a::10` |

Substitua os exemplos pelos endereços reais. CIDR autoriza toda a rede indicada;
use apenas uma rede cujos membros sejam confiáveis. Não use os IPs dos clientes
nem redes universais como 0.0.0.0/0. Vazio não confia em cabeçalhos encaminhados.

## Bancos predefinidos no Compose

O volume permanece `${APP_DATA_DIR}/data/db:/app/db`, sem subpastas novas.
Os nomes estão fixados no Compose, sem novos campos para preencher no Runtipi:

```yaml
NORMAL_DATABASE_FILE: RazorMiniflux.db
TOP_DATABASE_FILE: RazorMiniflux-top.db
```

| Modo | Arquivo no volume do app principal |
| --- | --- |
| Normal (false) | `data/db/RazorMiniflux.db` (já existente) |
| Top (true) | `data/db/RazorMiniflux-top.db` (cópia do Restricted) |

## Migração por cópia

1. Pare os dois apps normalmente e faça backup dos dois diretórios data/db.
2. Mantenha o banco normal no lugar. Copie o RazorMiniflux.db do app Restricted
   para o diretório data/db do principal, renomeando a cópia para
   **RazorMiniflux-top.db**. Preserve as permissões do usuário app do container.
3. Se restar WAL com conteúdo na origem, copie também RazorMiniflux.db-wal como
   RazorMiniflux-top.db-wal. Um snapshot SQLite completo dispensa esse arquivo.
   Não copie nem sobrescreva bancos enquanto estiverem em uso.
4. Inicie apenas o principal atualizado e aponte também o domínio Top para ele.
   Valide regras e históricos nos dois modos. Mantenha Restricted parado e
   preserve seu volume original para retorno.

Não é necessário executar importação. O app valida os dois arquivos antes do
processamento e não cria bancos vazios silenciosamente. Backup e Restore são
por modo; Restore agenda aplicação no próximo reinício, com backup anterior.

Para retornar, pare o principal novo, restaure o backup normal anterior à
atualização e as imagens/configurações/rotas antigas, e reinicie os dois apps.
Preserve os bancos novos se houve alterações locais depois da migração.

[Guia completo de migração, proxy e retorno](https://github.com/rodrigomescua/RazorMiniflux/blob/master/docs/dual-mode-migration.md).
