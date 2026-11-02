# Sua Vitrine

Site da agência Sua Vitrine (https://suavitrine.net.br): home + ~27,8 mil páginas de SEO local. HTML/CSS/JS puro, hospedado na Vercel, banco no Supabase. O contexto completo (contas, regras de negócio, convenções) está no [CLAUDE.md](CLAUDE.md).

Resumo: `git push origin main` publica o site sozinho. Mudanças de banco **não** vão no push (ver CLAUDE.md, seção "Banco de dados").

## Continuar em outro computador

### 1. O que instalar

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org) 18 ou mais novo (a CLI da Vercel, o teste e o servidor local usam)
- [GitHub CLI](https://cli.github.com) (`gh`)
- [Claude Code](https://claude.com/claude-code) (opcional; o `CLAUDE.md` já dá o contexto)

### 2. Baixar o projeto

```bash
gh auth login --web      # GitHub.com, HTTPS, conta brayam777
git clone https://github.com/brayam777/sua-vitrine.git
cd sua-vitrine
git config user.name "Brayam"
git config user.email "brayamfelipe02@gmail.com"
```

No Windows, se o `gh` não estiver no PATH, use `& "C:\Program Files\GitHub CLI\gh.exe" auth login --web`.

### 3. Ligar as CLIs (só quando precisar)

```bash
npx vercel@latest login                                                  # conta brayam777
npx vercel@latest link --yes --project sua-vitrine --scope brayam-s-projects
```

Para o banco, veja "Banco de dados" no `CLAUDE.md` (`supabase login` + `link --project-ref svovabwkremtnnesuknj`, ou o SQL Editor do painel). O arquivo `SUPABASE_CREDENTIALS.local` **não** vem no clone: recrie só se precisar de chave secreta, e nunca o suba pro git.

### 4. Rodar e testar

```bash
node serve.cjs                 # abre em http://localhost:8085
node tests/check-site.js       # ~15 s, tem que terminar em "Tudo certo."
```

### 5. Publicar

```bash
git add <arquivos>
git commit -m "O que mudou e por quê"
git push origin main
npx vercel@latest ls sua-vitrine   # o deploy novo deve aparecer como Ready em ~1 min
```
