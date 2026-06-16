# lsxpartners.com

The deployable Astro site for LSX Partners — a static, AI-crawlable, personal-brand site built to get *cited* by AI engines. This repo is the **product**; the strategy/inventory/redirect "brain" lives in `lsx-claude/clients/lsx-partners/5-website/`.

- **Build spec:** `lsx-claude/_templates/ai-site-foundation.md`
- **Plan:** `lsx-claude/.claude/plans/lovely-mapping-pudding.md`
- **Voice:** `laura-public-voice` memory (two registers — punchy-personal vs. measured-pillar)
- **Positioning:** AI visibility + strategy ONLY; personal-brand-forward (`lsx-positioning` memory)

## Stack

Astro 6 (static) → markdown/MDX content → Git → **GitHub Pages** (auto-deploy on push to `main`). Custom domain `lsxpartners.com` via `public/CNAME`.

## Local dev

This machine runs a standalone Node 22 (no system install). Put it on PATH first:

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # add to ~/.zshrc to make permanent
npm install        # first time only
npm run dev        # local preview at http://localhost:4321
npm run build      # static build into dist/
npm run preview    # serve the built dist/ locally
```

## Deploy

Push to `main` → `.github/workflows/deploy.yml` builds and ships to GitHub Pages. No manual infra steps.

## One-time GitHub setup (needs Laura's GitHub account)

1. Create an empty GitHub repo (e.g. `lsxpartners-site`).
2. `git remote add origin <repo-url>` and push `main`.
3. Repo **Settings → Pages → Source: GitHub Actions**.
4. Repo **Settings → Pages → Custom domain: `lsxpartners.com`** (matches `public/CNAME`); add the DNS records GitHub shows at the registrar.
5. **Migration safety:** only point DNS at GitHub Pages at launch (A6), after the redirect map is verified — Squarespace stays live until then.
