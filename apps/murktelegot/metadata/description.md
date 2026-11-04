# MurkTelegot

Radar pessoal de ofertas do Telegram com painel web em português. Usa sua conta para acompanhar grupos e canais selecionados e destacar ofertas por palavras-chave, sem adicionar bots aos grupos.

## Primeiro acesso

1. Obtenha o **API ID** e o **API hash** em <https://my.telegram.org/apps> e preencha os campos da instalação.
2. Defina o usuário e uma senha exclusiva de pelo menos 12 caracteres para o painel. A porta de acesso local é **8804**.
3. Entre no painel, informe seu telefone com DDI e conclua o login com o código do Telegram e, se solicitado, a senha de verificação em duas etapas.
4. Selecione os grupos/canais e crie regras com palavras-chave separadas por vírgula.

## Funcionamento

Requer **AMD64**. Captura novas mensagens e edições; não importa histórico nem garante recuperação das mensagens recebidas enquanto estiver desligado. As regras valem para mensagens e edições futuras. Alertas aparecem no painel, sem notificações externas. Mídias não são baixadas.

O painel usa HTTP Basic: para acesso remoto, configure HTTPS no Runtipi ou use um túnel SSH. Execute apenas uma instância por sessão Telegram.

## Dados e backup

O diretório `${APP_DATA_DIR}/data/data` armazena `offers.db` e `telegram.session`. A integração prepara a propriedade da pasta para o usuário 10001 da imagem antes de iniciar o processo sem privilégios. Proteja essa pasta e seus backups como uma senha: a sessão permite acesso à sua conta Telegram. Você pode revogá-la em **Configurações → Dispositivos** no Telegram.

Faça backup com o app parado antes de atualizar e preserve o diretório de dados. Para voltar de versão, restaure a imagem e o backup correspondente. As mensagens ficam armazenadas até limpeza manual. O endpoint `/health` verifica o processo web, não a conexão Telegram.

<!-- Logo: https://raw.githubusercontent.com/rodrigomescua/MurkTelegot/main/assets/murktelegot-logo/logo-icon.png ; selfh.st consultado, sem ícone específico do MurkTelegot. -->

Projeto: <https://github.com/rodrigomescua/MurkTelegot>
