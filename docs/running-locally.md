# Running Locally

## Prerequisites

- **Node.js 16+** — Check with `node --version`
- **npm** or **bun** — The project includes both lockfiles

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd pfppg

# Install dependencies
npm install
# or
bun install
```

This installs React, Vite, Tailwind CSS, shadcn-ui components, and `@huggingface/transformers` for local AI inference.

## Development Server

```bash
npm run dev
# or
bun run dev
```

The server starts at `http://localhost:8080`. Hot module replacement is enabled — your changes appear instantly without a full reload.

> **Note:** The HMR error overlay is disabled in `vite.config.ts` for a cleaner development experience.

## Production Build

```bash
npm run build
# or
bun run build
```

Output goes to the `dist/` directory. The build is fully static — you can deploy it to any static hosting service (Netlify, Vercel, GitHub Pages, S3, etc.) with no server required.

## Running Tests

```bash
# Run tests once
npm run test

# Watch mode (re-runs on file changes)
npm run test:watch
```

Tests use Vitest with jsdom for DOM simulation.
