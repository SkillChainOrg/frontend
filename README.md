# SkillChain — Frontend

> Blockchain-backed provenance infrastructure for artisan and cultural assets.

 **Live:** [frontend-rho-eight-42.vercel.app](https://frontend-rho-eight-42.vercel.app/)

&nbsp;·&nbsp; **Backend API:** [skillchain-dcyr.onrender.com](https://skillchain-dcyr.onrender.com)

&nbsp;·&nbsp; **Backend Repo:** [SkillChainOrg/backend](https://github.com/SkillChainOrg/backend)

&nbsp;·&nbsp; **Vault Service:** [SkillChainOrg/skillchain-vault](https://github.com/SkillChainOrg/skillchain-vault)


---

## What This Is

This repository is the React frontend for SkillChain — a provenance and ownership platform for artisan artifacts. It handles:

- Artisan identity via W3C DIDs (decentralized identifier resolution + registration gating)
- Artwork provenance visualization and QR-based verification
- Wallet-connected acquisition flows using Pera Wallet + Algorand
- x402 challenge-response acquisition with grouped transaction UX
- A moderated artisan approval system with live DID visibility
- Multilingual interface (i18n, with Hindi/English bilingual support)
- Admin panel for artisan moderation and on-chain approval

It communicates with a Flask backend for provenance APIs and submits signed grouped transactions directly to the Algorand testnet.

---

## On-Chain Proof

The acquisition flow is live and verifiable on Algorand testnet.

| Item | Link |
|------|------|
| Deployed Smart Contract | [Application 762870187](https://testnet.explorer.perawallet.app/application/762870187/) |
| Successful x402 Acquisition | [Transaction Q6LAKG…](https://testnet.explorer.perawallet.app/tx/Q6LAKG4U3FQWIPQM6Q42HETXOT3VK3AQ6OWBVZODCUHOGIVXZESQ/) |

The transaction confirms:
- Smart contract is deployed and callable
- Grouped transaction (payment + app call) executes atomically
- Box references resolve correctly against registered artwork keys
- Wallet signing via Pera Wallet works end-to-end
- Ownership transfer is explorer-verifiable

---

## Architecture

```
User Browser
│
├── React + Vite Frontend
│   ├── Pera Wallet SDK        (wallet connection, tx signing)
│   ├── i18n (react-i18next)   (multilingual UI)
│   └── Framer Motion          (animations)
│
├── Backend API (Flask)
│   ├── /register-artisan      (DID-gated registration)
│   ├── /verify-artwork        (provenance lookup)
│   ├── /acquire-artwork       (x402 challenge issuance)
│   └── /approve-artisan       (admin moderation)
│
└── Algorand Testnet
    ├── Smart Contract (ARC-4 App)
    └── Grouped Transaction: [PaymentTxn + AppCallTxn]
```

---

## Key Features

### Marketplace & Provenance UI
- Responsive artwork marketplace with real asset images
- Provenance visualization per artifact, linked to on-chain records
- Explorer-linked acquisition confirmation (Pera Wallet testnet explorer)
- QR code generation for provenance verification of registered artifacts

### x402 Acquisition Flow
The x402 challenge modal handles the full acquisition UX:
1. User selects an artwork and clicks acquire
2. Frontend requests an x402 challenge from the backend (`/acquire-artwork`)
3. Challenge modal displays: price, artwork metadata, transaction preview
4. User confirms → Pera Wallet signs a **grouped transaction** (PaymentTxn + AppCallTxn)
5. App call encodes box references aligned to the on-chain artwork registry keys
6. Post-settlement: frontend polls verification and shows explorer links

### DID-Aware Artisan Flow
- Artisans enter their DID before registration; the frontend resolves the DID document via the backend
- Artifact registration is gated behind a verified and admin-approved DID identity
- Artisan dashboard shows live approval status, DID document, and registered artifacts

### Wallet Integration
- Pera Wallet connect/disconnect with session persistence
- Algorand transaction construction and signing in-browser
- `Buffer` / Node.js global polyfills configured in Vite for Algorand SDK compatibility

### Multilingual Support
- `react-i18next` with JSON translation files
- Hindi and English supported; brand name rendered in Devanagari where appropriate
- Adaptive theming across language contexts

### Admin Panel
- Artisan approval queue with DID visibility
- One-click moderation (approve/reject) with live state feedback
- Error logging surfaced in UI for easier debugging

### Prototype Integrations *(architecture only, not production)*
- **Razorpay**: Payment UI components exist; not wired to live Razorpay API
- **DigiLocker**: Identity flow architecture is present; currently mocked

---

## Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- A [Pera Wallet](https://perawallet.app/) account (testnet)
- Access to a running SkillChain backend instance

### Clone and Install

```bash
git clone https://github.com/SkillChainOrg/frontend.git
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_BACKEND_URL=https://skillchain-dcyr.onrender.com
VITE_ALGORAND_APP_ID=762870187
VITE_ALGORAND_NETWORK=testnet
```

| Variable | Purpose |
|---|---|
| `VITE_BACKEND_URL` | Base URL for the Flask provenance API. Use `http://localhost:5000` for local backend development. |
| `VITE_ALGORAND_APP_ID` | On-chain application ID for the SkillChain smart contract. |
| `VITE_ALGORAND_NETWORK` | Algorand network (`testnet` or `mainnet`). Affects explorer links and wallet config. |

> **Note:** All env variables must be prefixed with `VITE_` to be accessible in the Vite build.

### Run Locally

```bash
npm run dev
```

Vite starts a dev server at `http://localhost:5173` with HMR enabled.

### Build for Production

```bash
npm run build
```

Output is in `dist/`. Preview the production build locally with:

```bash
npm run preview
```

---

## Wallet Setup (Testnet)

1. Install [Pera Wallet](https://perawallet.app/) on mobile or use [Pera Web](https://web.perawallet.app/)
2. Switch to **Algorand Testnet**
3. Fund your testnet account via the [Algorand Dispenser](https://testnet.algoexplorer.io/dispenser)
4. Connect wallet on the frontend via the wallet button in the navbar

The frontend uses `@perawallet/connect` to request account access and sign grouped transactions. No private keys are ever handled server-side.

---

## Deployment

This frontend is deployed on **Vercel**.

### SPA Routing

React Router requires all routes to return `index.html`. A `vercel.json` rewrite rule handles this:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Deploy Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**. Match the `.env` keys exactly.

---

## Project Structure (Abbreviated)

```
src/
├── components/
│   ├── X402ChallengeModal.jsx    # x402 acquisition UX
│   ├── ProvenanceCard.jsx        # per-artifact provenance display
│   ├── ArtisanDashboard.jsx      # DID-gated artisan view
│   └── AdminPanel.jsx            # moderation queue
├── pages/
│   ├── Marketplace.jsx
│   ├── VerifyArtwork.jsx
│   └── ArtisanIdentity.jsx
├── i18n/
│   ├── en.json
│   └── hi.json
├── utils/
│   └── algorand.js               # tx construction + box reference encoding
└── main.jsx
```

---

## Related Repositories

| Repository | Description |
|---|---|
| [SkillChainOrg/backend](https://github.com/SkillChainOrg/backend) | Flask API — provenance, DID registry, x402 challenge layer |
| [SkillChainOrg/skillchain-vault](https://github.com/SkillChainOrg/skillchain-vault) | HashiCorp Vault-backed key management service |

---

## License

MIT
