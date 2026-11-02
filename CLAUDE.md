# Sua Vitrine — contexto do projeto

Site de marketing da **Sua Vitrine**, agência do Brayam que cria vitrines/catálogos online sob medida para lojas pequenas (a partir de **R$ 499,90**, sem mensalidade). Público: donos de loja (joalheria, hortifruti, suplementos etc.) que chegam por anúncio da Meta ou pelo Google e fecham pelo **WhatsApp**. O site em si é a vitrine da agência: home + ~27,8 mil páginas de SEO local ("vitrine online em <cidade>").

## Onde está cada coisa em produção

| O quê | Onde |
|---|---|
| Site | https://suavitrine.net.br |
| Repositório | https://github.com/brayam777/sua-vitrine (conta GitHub `brayam777`; **PÚBLICO**, por decisão do Brayam em 02/11/2026: `img/lojas/` e `media/` mostram lojas de clientes, e nada secreto deve entrar aqui) |
| Hospedagem | Vercel, projeto `sua-vitrine` (`prj_xiHBCVWQHRBwLtEHSMVJHbc5zs5m`), time `brayam-s-projects`, login `brayam777`. Ligado ao GitHub: **push na `main` = deploy de produção** |
| Banco | Supabase, ref `svovabwkremtnnesuknj` (https://svovabwkremtnnesuknj.supabase.co). Conta própria do Brayam; a CLI do Supabase da máquina antiga (`barayamgamer@gmail.com`) NÃO tinha acesso a ele |
| Pixel/anúncios | Meta Pixel `1112554241637257`, conta de anúncios `act_2090716864869534` (`js/pixel.js`) |
| Contato | WhatsApp `5562986057981`, Instagram @brayaamgomes |

**Não usar / não mexer:** o app `mecanicsafe` e os projetos Supabase dos clientes (ex.: Luanne `ietooopjzlnzmguubrrv`, Wellness `vxeokiiwdsbwodlriadm`). O `supabase-config.js` diz que este banco é separado de propósito. Os sites dos clientes (`romano.suavitrine.net.br`, `luanne-pratas…`, `wellness-fit-store…`, `mimo3d…`, `verdurao-imperio…`, `infinitybrilhojoias.com.br` etc.) são outros projetos: aqui só aparecem como prova no portfólio.

## Stack e convenções

- HTML/CSS/JS puro, **sem build e sem `package.json`**. A Vercel serve a raiz (`vercel.json`: `cleanUrls`, sem barra final).
- `css/style.css` e `js/main.js` são **compartilhados por todas as páginas**: qualquer mudança vale para as ~27,8 mil. Para recurso novo, use classes novas em vez de reaproveitar as existentes.
- A home (`index.html`) tem o JS inline (WhatsApp, `?nicho=`, vídeo, "ver mais lojas") e carrega `js/pixel.js` por `<script>`. As demais páginas carregam `js/main.js` como módulo, que importa `pixel.js` e `supabase-config.js`.
- Paleta e tipografia seguem o Romano Joias: preto `#0b0b0b`, creme `#f6f1e7`, dourado `#c6a15b`; títulos em Fraunces, texto em Inter. Cliente rejeitou visual "com cara de IA", então evite gradientes e cara de template.
- Páginas de SEO: `vitrine-online-*`, `loja-online-*`, `catalogo-online-*`, `portfolio-online-*`, `e-commerce-*` × 5.561 cidades do IBGE (+ páginas feitas à mão da região de Goiânia e 5 genéricas). **O gerador original dessas páginas foi perdido** (ficava numa pasta temporária). As páginas versionadas são a fonte da verdade e foram alteradas em massa por scripts descartáveis de busca-e-troca. O texto do `hero-desc` varia por cidade (20 variantes em `vitrine-online`, 4 nas outras), por regra que não está documentada.
- Rollout de SEO: concluído, as 27.805 URLs estão liberadas. `seo-rollout/fila-liberacao.json` é a ordem por população; `revelar-proximo-lote.js` não tem mais o que fazer; `sitemap-liberado.xml` lista tudo.
- Commits em português, uma mudança por commit, mensagem explicando o porquê.

## Regras de negócio e onde moram (mudar junto!)

- **Preço "a partir de R$ 499,90"**: texto em `index.html` e em todas as páginas de cidade (title, description, JSON-LD). O Pixel usa `value: 497` em `js/pixel.js`.
- **Número do WhatsApp**: em 3 lugares. Script inline da `index.html`, `WHATSAPP_NUMBER` em `js/main.js`, e `"telephone"` no JSON-LD de cada página (o teste confere o último).
- **Mensagem do WhatsApp e nicho**: a mensagem é "Eu vendo ________"; `?nicho=pratas` preenche o ramo. O mapa `NICHOS` fica só na `index.html`; o pixel lê o mesmo parâmetro e marca os eventos com o nicho. Navegador interno do Instagram/Facebook usa `whatsapp://` com fallback para `wa.me`: essa lógica existe duplicada na home e no `main.js`.
- **Portfólio** existe em 3 versões: cards fixos na `index.html` (8 lojas, imagens em `img/lojas/`), `FALLBACK_PROJECTS` em `js/main.js` e a tabela `public.portfolio_projects` (semeada pelas migrações). Ao adicionar loja nova, atualize os três e crie uma migração. O teste confere os domínios do fallback contra as migrações.
- **Pixel só dispara em `suavitrine.net.br`/`www`**, nunca em localhost nem em prévias da Vercel.
- **Contratos com cliente**: 50% na entrada + 50% na entrega, ou boleto em 3x; sem mensalidade; 15 dias de ajustes simples grátis; mudança estrutural é cobrada à parte.

## Como rodar local

```bash
node serve.cjs          # http://localhost:8085 (porta via variável PORT)
```

No app Claude Code, o `.claude/launch.json` já tem a configuração `sua-vitrine`.

## Testes

```bash
node tests/check-site.js
```

Confere nas ~27,8 mil páginas: pixel carregado, links/assets existentes, canonical, preço, telefone, ausência de segredos, e a coerência entre sitemap, `release-state.json`, fila, `robots.txt` e migrações. Leva uns 15 s. Rode antes de todo push que mexa em `css/`, `js/` ou em páginas em massa.

## Banco de dados (Supabase)

- Tabela `public.portfolio_projects` (leitura pública com a chave anon/publishable em `js/supabase-config.js`, que pode ficar no código). Há também uma rotina diária `pg_cron`+`pg_net` que faz ping para o projeto não pausar (plano gratuito).
- **Migrações NÃO vão com o push.** Estão em `supabase/migrations/` e precisam ser aplicadas à mão, de um destes jeitos:
  1. Painel do Supabase → SQL Editor → colar o `.sql` e rodar (mais simples).
  2. CLI: `npx supabase@latest login`, `npx supabase@latest link --project-ref svovabwkremtnnesuknj`, `npx supabase@latest db push` (a conta logada precisa de acesso ao projeto).
- Depois de criar tabela/coluna, rode `NOTIFY pgrst, 'reload schema';` para o PostgREST enxergar. RLS sozinha não basta: a tabela também precisa de `GRANT` para `anon`.
- Chaves secretas (a chave de serviço do Supabase, token de acesso, senha do Postgres) **nunca** entram no repositório. Ficam em `SUPABASE_CREDENTIALS.local` (ignorado pelo git e pela Vercel) ou no gerenciador de senhas.

## Deploy

- `git push origin main` → a Vercel publica sozinha (~1 min). Conferir: `npx vercel@latest ls sua-vitrine`.
- `.vercelignore` deixa de fora do site: `seo-rollout`, `supabase`, `tests`, `.claude`, `serve.cjs`, `CLAUDE.md`, `README.md`, `*.local`.
- Deploy manual de emergência: o site passa de 15 mil arquivos, então use `npx vercel@latest deploy --prod --archive=tgz`.

## Pendências em aberto

- Pedir indexação manual no Search Console para Guarulhos, Campinas, São Luís e Maceió (a cota diária de ~10 pedidos esgotou).
- Conferir se a tarefa agendada de liberação diária de SEO ainda existe; ela não tem mais função e pode ser apagada.
- Checar se `loadPortfolioProjects`/`buildPortfolioGrid` em `js/main.js` ainda são usados em alguma página (a home agora usa cards fixos).
- Se as páginas de cidade precisarem ser regeneradas em massa, será preciso reconstruir um gerador (ver acima).
