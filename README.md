# Animes API

API de CRUD de animes em NestJS. O front em `../animes-web` lista, cria, edita e apaga esses registros.

O projeto começou com os dados numa lista em memória. Agora o registro fica no PostgreSQL, o front recebe `anime.created`, `anime.updated` e `anime.deleted` por WebSocket, e o mesmo evento segue para uma fila SQS. A capa do anime vai para um bucket S3.

## Como rodar

Pré-requisito: Node 20.

```bash
npm install
copy .env.example .env
```

### Com Docker

Sobe PostgreSQL 16, LocalStack (SQS e S3) e a API.

```bash
docker compose up --build
```

- API: http://localhost:8080
- Swagger: http://localhost:8080/docs
- Postgres no host: `localhost:5432` (usuário `animes`, senha `animes`, banco `animes`)
- LocalStack: http://localhost:4566

Neste computador a porta 5432 já está com o serviço Windows `postgresql-x64-17`. O compose também quer publicar o Postgres nessa porta. Se o `docker compose` reclamar de porta ocupada, pare o serviço do Windows ou troque o mapeamento para `"5433:5432"` e ajuste o `DATABASE_URL` de quem conecta de fora do compose. Dentro da rede do compose o host continua sendo `postgres`, não `localhost`.

Docker não estava instalado nesta máquina. O arquivo `docker-compose.yml` e o `Dockerfile` estão prontos; a verificação daqui rodou com o Postgres embutido descrito abaixo.

### Sem Docker

```bash
npm run db:embedded
```

Isso sobe um PostgreSQL em `127.0.0.1:5433`, com usuário e senha `animes`, e cria os bancos `animes` e `animes_test`. Os dados ficam em `.pgdata` (não vai para o git).

No `.env`:

```
DATABASE_URL=postgresql://animes:animes@127.0.0.1:5433/animes
```

Deixe `SQS_QUEUE_URL` e `S3_BUCKET` vazios se o LocalStack não estiver no ar. A API sobe do mesmo jeito: o CRUD e o WebSocket funcionam, a fila fica desligada e o upload de capa responde 503.

```bash
npm run start:dev
```

O front:

```bash
cd ../animes-web
npm install
npm run dev -- --host 127.0.0.1 --port 3000
```

http://127.0.0.1:3000

## Rotas

| Método | Caminho | O que faz |
| --- | --- | --- |
| GET | `/health` | Confere a API e o PostgreSQL |
| GET | `/catalog/anime?q=` | Busca no catálogo AniList (gratuito) |
| GET | `/anime` | Lista |
| GET | `/anime/:id` | Busca um |
| POST | `/anime` | Cria |
| PUT | `/anime/:id` | Atualiza |
| DELETE | `/anime/:id` | Remove |
| POST | `/anime/:id/cover` | Envia a capa (`file`, JPEG/PNG/WebP, até 2MB) |

O corpo de criação pede `title`, `description`, `completed`, `releaseDate` (`YYYY-MM-DD`) e `type` (`filme` ou `série`). `ranking` é opcional, de 0 a 10. O id é UUID. Id que não é UUID responde 404, para não virar erro 500 no Postgres.

`GET /docs` abre o Swagger.

## WebSocket

O front conecta em `http://localhost:8080` com Socket.IO. Os eventos são:

- `anime.created` — o anime criado
- `anime.updated` — o anime atualizado
- `anime.deleted` — `{ id }`

A lista não faz mais polling de 1 segundo. Ela busca uma vez ao abrir e, depois, reage a esses eventos.

## Testes

```bash
npm test
npm run test:e2e
```

`npm test` cobre o caso de uso com repositório, notifier e storage falsos. Não precisa de banco.

`npm run test:e2e` sobe um PostgreSQL só para o teste, aplica a migração, passa pelo HTTP de verdade e confere o evento `anime.created`.

## Organização

```
src/anime/domain            modelo, porta do repositório, evento e porta do storage
src/anime/application       caso de uso e DTOs
src/anime/infrastructure   MikroORM, HTTP, WebSocket, SQS e S3
src/database                config do MikroORM e migrações
```

O caso de uso não importa MikroORM, SQS nem S3. Ele pede um `AnimeRepository`, um `AnimeNotifier` e um `CoverStorage`. O módulo Nest entrega as implementações.

O notifier faz duas coisas: emite o evento no WebSocket (canal da tela) e publica o mesmo JSON na fila `anime-events` (canal para outro serviço). Se a fila estiver fora, o POST continua 201 e o log registra a falha. Um consumer na própria API lê a fila, registra a mensagem e apaga, para ela não acumular. Ele não redesenha a tela: isso já foi feito pelo WebSocket.

No LocalStack a API cria a fila e o bucket quando `SQS_ENDPOINT` / `S3_ENDPOINT` estão preenchidos. Na AWS de verdade esses recursos já existem e a task role não precisa de `CreateQueue`.

## Publicar de graça

1. Este repositório no GitHub.
2. No [Render](https://render.com), use o `render.yaml` (Blueprint): sobe a API e um PostgreSQL no plano free. O serviço pode dormir depois de um tempo sem acesso; o primeiro request demora um pouco.
3. O front em `animes-web` vai para a [Vercel](https://vercel.com). Em Environment Variables, defina `VITE_API_URL` com a URL da API no Render (ex.: `https://animes-back.onrender.com`), sem barra no final.
4. SQS e S3 ficam vazios no free. O CRUD, o WebSocket e a busca na AniList funcionam.

## Deploy

A imagem de produção está no `Dockerfile`: build com as devDependencies e runtime só com `npm ci --omit=dev`. O processo é `node dist/main.js`. Na subida, `setupApp` roda as migrações.

O desenho correspondente na AWS:

| Local | AWS |
| --- | --- |
| container `api` | ECS/Fargate ou App Runner, atrás de um load balancer |
| container `postgres` | RDS PostgreSQL. A task recebe `DATABASE_URL` |
| LocalStack SQS | fila SQS `anime-events`. Sem `SQS_ENDPOINT` o SDK usa a AWS |
| LocalStack S3 | bucket de capas. `S3_PUBLIC_BASE_URL` vira a URL pública ou o domínio do CloudFront |
| `GET /health` | health check do target group |

`GET /health` executa `select 1`. Migração entra no start do processo, não no health check.

Não use sincronização automática de schema em produção. A tabela nasce em `src/database/migrations/Migration20261027200000.ts`. Para gerar a próxima: `npm run migration:up` aplica as pendentes; o CLI do MikroORM está em `npm run migration:create` depois de mudar a entity, com o Postgres no ar.

## O que mudou, e por quê

1. **README.** O arquivo padrão do Nest não descrevia o CRUD. Este documento passa a ser o mapa do projeto.
2. **PostgreSQL e MikroORM.** A lista em memória sumia quando o processo caía. A entity e a migração `animes` guardam o registro. O id deixou de ser `1`, `2`, `3` e passou a ser UUID.
3. **Docker Compose.** Postgres, LocalStack e API sobem juntos, com a mesma variável `DATABASE_URL` que o processo local usa.
4. **Testes.** O unitário trava a regra (404, evento, capa inválida) sem banco. O e2e aplica a migração e percorre o HTTP, inclusive o WebSocket.
5. **WebSocket.** Polling de 1 segundo batia em `GET /anime` o tempo todo. O servidor avisa quando algo muda. O `animeContext.tsx` do front escuta os três eventos.
6. **DDD simples.** Controller, MikroORM, SQS e S3 saíram de dentro da regra. A regra ficou em `application` e fala com portas. SQS e S3 são adapters: localmente apontam para o LocalStack, na AWS para os serviços reais.
7. **Swagger.** `GET /docs` mostra as rotas e os DTOs. A validação continua no `ValidationPipe`; o Swagger só documenta.
8. **Deploy.** `Dockerfile`, `GET /health` e as variáveis de ambiente deixam o mesmo processo rodar no compose e numa task da AWS. A diferença entre LocalStack e AWS é o endpoint, não o código do caso de uso.

## Exemplo de body (POST /anime)

```json
{
  "title": "Meu Amigo Totoro",
  "description": "Duas irmãs se mudam para o campo e encontram criaturas mágicas.",
  "type": "filme",
  "completed": true,
  "releaseDate": "1988-04-16",
  "ranking": 9
}
```
