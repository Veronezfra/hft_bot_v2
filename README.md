# NEURAL/BOT — HFT Intelligence Terminal

React + TypeScript + Vite + Tailwind CSS + D3 + Lightweight Charts.

## GitHub → Vercel

Upload the **contents of this folder** directly into the root of your GitHub repository.

The repository root must contain:
- `package.json`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `src/`

Vercel:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

No `node_modules` folder should be committed.

## Important

The login is demo-only and uses `sessionStorage`. It is not real authentication.

The trading engine and returns are simulated. The +96% base return is a hypothetical demo assumption, not a forecast or guarantee. No real orders are sent.
