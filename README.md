# Curtinho — encurtador de links

Um encurtador de URLs full-stack, construído como um pequeno sistema de
microsserviços: autenticação com JWT, geração de links curtos com alias
personalizado e expiração, contagem de cliques e um painel com estatísticas —
tudo atrás de um frontend em Next.js com visual próprio.

![Landing page do Curtinho](docs/screenshots/landing.png)

## O que o projeto faz

- Encurta qualquer URL, com ou sem login (anônimo ou associado à conta).
- Permite escolher um apelido personalizado para o link (`/meu-link`) ou gera
  um código aleatório.
- Define data de expiração opcional para um link.
- Redireciona (`GET /:slug`) e registra cada clique (data, referrer, user-agent).
- Painel do usuário com a lista de links, cliques totais, gráfico dos últimos
  7 dias e os acessos mais recentes.
- Gera um QR code do link encurtado na hora.

![Dashboard com os links do usuário](docs/screenshots/dashboard.png)

## Arquitetura

O backend é dividido em dois serviços NestJS independentes, cada um com seu
próprio schema Prisma e migrations, compartilhando a mesma instância do
Postgres (schemas separados: `auth` e `url_shortener`):

```
apps/
├── auth/           # NestJS — cadastro, login, emissão/validação de JWT
├── url-shortener/  # NestJS — criação, redirecionamento e estatísticas de links
└── web/            # Next.js — frontend que consome os dois serviços
gateway/            # KrakenD — reservado para um API Gateway futuro (não ativo ainda)
docker-compose.yml  # sobe Postgres + os três serviços juntos
```

O frontend fala diretamente com cada serviço via `fetch` no navegador
(`NEXT_PUBLIC_AUTH_API_URL` / `NEXT_PUBLIC_URL_SHORTENER_API_URL`); o `auth`
assina o JWT e o `url-shortener` o valida com o mesmo segredo, sem precisar
de uma chamada entre os dois serviços.

## Stack

**Backend**
- [NestJS](https://nestjs.com/) + TypeScript
- [Prisma ORM](https://www.prisma.io/) + PostgreSQL
- Autenticação com JWT (`@nestjs/jwt`, `passport-jwt`) e senhas com `bcrypt`
- Validação de entrada com `class-validator`

**Frontend**
- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) com paleta e tipografia (Fraunces + Plus Jakarta Sans) personalizadas
- Geração de QR code no client (`qrcode`)

**Infra**
- Docker + docker-compose (Postgres, `auth`, `url-shortener` e `web` juntos)
- Cada serviço com testes unitários (Jest) e lint (ESLint/Prettier)

## Rodando localmente

Com Docker (sobe banco + os três serviços de uma vez):

```bash
cp .env.example .env
docker-compose up
```

- Frontend: http://localhost:3002
- API de autenticação: http://localhost:3000
- API de encurtamento: http://localhost:3001

Sem Docker, cada app em `apps/*` roda com `npm install && npm run start:dev`
(ou `npm run dev` no `web`), apontando `DATABASE_URL` para um Postgres local
e rodando `npx prisma migrate deploy` em `auth` e `url-shortener` antes de
subir.

## Principais endpoints da API

| Serviço | Endpoint | Descrição |
|---|---|---|
| `auth` | `POST /auth/register` | Cria uma conta |
| `auth` | `POST /auth/login` | Autentica e retorna um JWT |
| `auth` | `GET /auth/me` | Dados do usuário autenticado |
| `url-shortener` | `POST /api/urls` | Encurta uma URL (login opcional) |
| `url-shortener` | `GET /api/urls` | Lista os links do usuário logado |
| `url-shortener` | `GET /api/urls/:id/stats` | Estatísticas de um link (dono apenas) |
| `url-shortener` | `DELETE /api/urls/:id` | Remove um link (dono apenas) |
| `url-shortener` | `GET /:slug` | Redireciona e registra o clique |

## CI/CD e deploy no Render

O repositório já vem com:

- **`.github/workflows/ci.yml`** — a cada push/PR, roda lint + build + testes
  dos três apps (`auth`, `url-shortener`, `web`). Em push para `main`, se tudo
  passar, dispara o deploy no Render (job `deploy`).
- **`render.yaml`** — um [Blueprint do Render](https://render.com/docs/blueprint-spec)
  que descreve os 3 serviços (web, Node), prontos pra criar tudo de uma vez.
  O banco não é provisionado pelo Blueprint — este projeto usa um Postgres
  externo (ex: [Supabase](https://supabase.com)), com um schema por serviço.

Passo a passo pra colocar no ar:

1. No Render, **New +** → **Blueprint**, aponte para este repositório (branch
   `main`). O Render lê o `render.yaml`, mostra os 3 serviços que vai criar e
   só aplica quando você confirmar.
2. Crie um projeto Postgres (Supabase ou outro) e pegue a connection string
   dele (no Supabase: **Project Settings → Database → Connection string**).
   Em **Environment** de cada serviço no Render, preencha o `DATABASE_URL`
   que ficou marcado como "preencher manualmente" — **cole só o valor**, sem
   aspas e sem o `DATABASE_URL=` na frente:
   - `curtinho-auth`: a connection string + `?schema=auth` (ou `&schema=auth`
     se ela já tiver outros parâmetros, como `sslmode=require`)
   - `curtinho-url-shortener`: a mesma connection string + `?schema=url_shortener`
     (ou `&schema=url_shortener`)
3. O `JWT_SECRET` já é gerado automaticamente pelo Render e compartilhado
   entre `curtinho-auth` e `curtinho-url-shortener` — não precisa mexer.
4. (Opcional, pra liberar o deploy automático do CI) Em cada serviço,
   **Settings → Deploy Hook**, copie a URL e adicione como *secret* no GitHub
   (`Settings → Secrets and variables → Actions`):
   - `RENDER_DEPLOY_HOOK_AUTH`
   - `RENDER_DEPLOY_HOOK_URL_SHORTENER`
   - `RENDER_DEPLOY_HOOK_WEB`

   Sem esses secrets, o CI roda normalmente (lint/build/test) e só pula a
   etapa de deploy.
5. Os serviços já apontam uns para os outros pelos nomes definidos no
   `render.yaml` (`curtinho-auth.onrender.com`, etc). Se você renomear algum
   serviço no Render, atualize essas URLs no `render.yaml` também.

O plano `free` do Render "dorme" depois de um tempo sem tráfego — a primeira
requisição depois disso demora alguns segundos pra acordar o serviço. O banco
Postgres free do Render também **expira depois de 30 dias**, por isso este
projeto usa um Postgres externo (Supabase) em vez do banco gerenciado do
Render — assim o banco não desaparece.

## Próximos passos

- Ativar o API Gateway (KrakenD) em `gateway/`, hoje apenas reservado no `docker-compose.yml`.

---

Projeto de portfólio feito por Marouane.

- LinkedIn: [linkedin.com/in/marouane-pondikpa](https://www.linkedin.com/in/marouane-pondikpa)
- Repositório: [github.com/maxfortune93/url_shortener_challenge](https://github.com/maxfortune93/url_shortener_challenge)
