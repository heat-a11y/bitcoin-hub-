export interface QA {
  q: string
  a: string
}

export interface CuratedMeta {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  displayTitle: string
  qa: QA[]
  funFact?: string
}

export type Series = 'Newbies' | 'Intermediate' | 'Advanced'

export const SERIES: { key: Series; label: string; desc: string }[] = [
  { key: 'Newbies', label: 'Newbies Series', desc: 'Bitcoin fundamentals & getting started' },
  { key: 'Intermediate', label: 'Intermediate Series', desc: 'LN, multisig, nodes & Script' },
  { key: 'Advanced', label: 'Advanced Series', desc: 'Taproot, proofs, L2 & consensus' },
]

export const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  Intermediate: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  Advanced: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
}

export const CURATED: Record<string, CuratedMeta> = {
  /* ── Newbies ────────────────────────────────────────── */
  'bitcoin-for-newbies': {
    difficulty: 'Beginner',
    displayTitle: 'Intro to Bitcoin & the UTXO Model',
    qa: [
      {
        q: 'What is a UTXO (Unspent Transaction Output)?',
        a: "Bitcoin doesn't use accounts or balances like a bank. Instead, your wallet holds UTXOs — digital 'chunks' of Bitcoin. When you spend, you consume existing UTXOs as inputs and create new UTXOs as outputs. Think of it like cash: if you buy a $3 coffee with a $5 bill, you hand over the whole bill and get $2 change back as a new bill. Each UTXO can only be spent once — that's what makes Bitcoin's ledger secure and auditable.",
      },
      {
        q: 'How do Public and Private Keys work together?',
        a: 'Your Private Key is a secret 256-bit number — think of it as the key to a vault. It mathematically signs transactions to prove ownership. Your Public Key is derived from the private key and acts like a shared mailbox address where anyone can send you Bitcoin. The magic is elliptic curve cryptography (secp256k1): you can derive a public key from a private key, but you cannot reverse it. This one-way function is what makes Bitcoin ownership secure.',
      },
      {
        q: 'What is a BIP-39 Seed Phrase and why does it matter?',
        a: 'A BIP-39 seed phrase is 12 or 24 human-readable words that act as a master backup for your wallet. Every private key in your wallet is deterministically derived from this single seed using a hierarchical deterministic (HD) wallet structure (BIP-32). Lose your wallet? No problem — punch those words into any BIP-39-compatible wallet and all your funds are back. But if someone finds your seed phrase, they own everything. Store it offline, on steel or paper, never in a digital photo or cloud doc.',
      },
      {
        q: 'Walk through a standard P2PKH transaction step by step.',
        a: '1. Alice wants to send Bob 0.1 BTC. 2. Her wallet finds UTXOs she owns that sum to ≥0.1 BTC (say, one 0.15 BTC UTXO). 3. She creates a transaction: input = the 0.15 UTXO (signed with her private key), output 1 = 0.1 BTC locked to Bob\'s public key hash (P2PKH), output 2 = 0.049 BTC change back to herself (minus ~0.001 fee). 4. She broadcasts it to the network. 5. Miners include it in a block. 6. Bob\'s wallet sees the new UTXO and he can now spend it. Each step is verified by full nodes checking signatures and sums.',
      },
    ],
    funFact: 'The first real-world Bitcoin transaction was for two pizzas — 10,000 BTC for two Papa John\'s pizzas in 2010. At today\'s prices, those are the most expensive pizzas in history.',
  },

  'bitcoiner-travelling': {
    difficulty: 'Beginner',
    displayTitle: 'Bitcoin on the Go — Travel & Mobile Security',
    qa: [
      {
        q: 'What precautions should you take when travelling with Bitcoin?',
        a: 'Never carry your entire net worth in a hot wallet on your phone. Use a hardware wallet (Ledger, Trezor) as cold storage and only bring a small spending amount in a mobile wallet. Write down your seed phrase on fireproof steel — never take a photo, email it, or type it into any cloud service. Consider a "travel wallet" — a fresh wallet with just enough funds for the trip. If your phone is stolen at the airport, you lose only what\'s in that wallet, not your life savings.',
      },
      {
        q: 'Mobile wallets vs hardware wallets — which should you use?',
        a: 'Mobile wallets (like Muun, Blue Wallet) are convenient for daily spending — they are hot wallets because the private keys are on an internet-connected device. Hardware wallets keep keys on a dedicated offline chip — transactions are signed on the device itself and only the signed transaction touches the internet. Best practice: hardware wallet for savings (cold), mobile wallet for daily cash (hot). Never store more in a hot wallet than you\'re comfortable losing to a phone thief or malware.',
      },
      {
        q: 'How do you verify a Bitcoin transaction without internet?',
        a: 'You don\'t need internet to verify a transaction if you have a copy of the blockchain or use SPV (Simplified Payment Verification). Some mobile wallets like Muun let you "scan and sign" offline: build the transaction on an offline device, export it via QR code, then broadcast it from any internet-connected device. Satellite nodes (Blockstream Satellite) broadcast the blockchain from space — you can verify transactions with just a small antenna and a USB receiver, no internet required.',
      },
    ],
    funFact: 'Blockstream Satellite broadcasts the Bitcoin blockchain to the entire planet from geostationary orbit. Even if the internet goes down globally, Bitcoin could still function via space!',
  },

  /* ── Intermediate ───────────────────────────────────── */
  'intermediate-bitcoin': {
    difficulty: 'Intermediate',
    displayTitle: 'Lightning Network & Multisig Architecture',
    qa: [
      {
        q: 'How does a Lightning Network payment channel open, operate, and settle?',
        a: 'Two parties (Alice and Bob) create a 2-of-2 multisig funding transaction on the Bitcoin base chain — both deposit funds into a shared address. This is the only on-chain transaction to open the channel. Inside the channel, they update a "commitment transaction" that reflects the current balance — they can do this thousands of times, instantly and virtually free, without touching the blockchain. When either party decides to close, the latest signed commitment transaction is broadcast to the main chain. Only two on-chain transactions total: open and close — everything in between is off-chain magic.',
      },
      {
        q: 'What are HTLCs (Hashed Timelock Contracts)?',
        a: 'HTLCs are the backbone of multi-hop Lightning payments. They work like a cryptographic escrow: Alice pays Bob through routing node Carol. Alice creates an HTLC that says "Carol can claim this payment if she shows the secret preimage before 24 hours; otherwise it returns to Alice." Carol forwards the same deal to Bob. Bob reveals the preimage to claim his payment, which lets Carol claim hers from Alice. The hash lock ensures no intermediate node can steal funds, and the time lock prevents funds from being stuck forever. It\'s trustless routing without needing to trust any routing node.',
      },
      {
        q: 'What are commitment transactions and why do they need revocation keys?',
        a: 'Every time the channel balance changes, both parties sign a new commitment transaction reflecting the current split of funds. But what if one party broadcasts an old, outdated commitment that favors them (a "cheat attempt")? That\'s where revocation keys come in. Each commitment transaction has a unique revocation key held by the counterparty. If Alice tries to cheat by publishing an old state, Bob can use the revocation key to sweep ALL channel funds to himself — cheat and lose everything. This game-theoretic deterrent keeps both parties honest.',
      },
      {
        q: 'How does a multi-signature (m-of-n) configuration work?',
        a: 'A multisig wallet requires m out of n signatures to authorize a transaction — for example, 2-of-3. This means three key holders exist, but only two need to sign. Use cases: corporate treasuries (CFO + CEO must both approve), family inheritance (2 of 3 siblings), or security (keys on phone + laptop + hardware wallet — lose one and you\'re fine). Multisig eliminates the single point of failure that a single private key represents. With Schnorr signatures (Taproot), multisig transactions look identical to single-sig on-chain, enhancing privacy.',
      },
    ],
    funFact: 'The Lightning Network can theoretically handle millions of transactions per second globally — compared to Bitcoin\'s ~7 TPS and Visa\'s ~24,000 TPS. Lightning is the scaling layer that makes Bitcoin usable for everyday coffee purchases.',
  },

  /* ── Advanced ───────────────────────────────────────── */
  'advanced-bitcoiner': {
    difficulty: 'Advanced',
    displayTitle: 'Taproot, Schnorr & Advanced Script Mechanics',
    qa: [
      {
        q: 'How do Schnorr signatures (BIP-340) improve Bitcoin?',
        a: 'Schnorr signatures enable signature aggregation — a 15-of-15 multisig produces ONE signature, not fifteen. This is massive for privacy (complex contracts look like simple payments on-chain) and block space (one signature ≈ 64 bytes vs 15 × ~72 bytes). Schnorr also enables signature adaptors (used in Lightning atomic swaps), MuSig (key aggregation), and batch verification (verify n signatures in nearly the same time as one). Activated in the November 2021 Taproot soft fork, it\'s the biggest upgrade to Bitcoin\'s cryptography since its inception.',
      },
      {
        q: 'What is MAST (Merkelized Alternative Script Trees) and why does it matter?',
        a: 'MAST (BIP-341) lets you encode multiple spending conditions as leaves of a Merkle tree. For example: "Spend with Alice\'s key, OR after 30 days with Bob\'s key, OR with 2-of-3 of these directors." When spending, you reveal only the specific condition you used plus a Merkle proof — the other conditions stay hidden. Before MAST, all conditions were revealed on-chain, bloating the blockchain and leaking your entire contract logic to the world. MAST shrinks transaction size and keeps your financial privacy intact.',
      },
      {
        q: 'What\'s the difference between OP_CHECKSIG and OP_CHECKSIGADD?',
        a: 'Before Taproot, multisig used OP_CHECKMULTISIG — a cumbersome opcode with a known off-by-one bug (it consumed an extra dummy element from the stack, requiring a workaround). Taproot introduced OP_CHECKSIGADD: it takes a signature and a public key, and if the signature is valid, it adds 1 to a counter on the stack. To do n-of-m multisig, you loop through m public keys, run OP_CHECKSIGADD for each, and check the final count ≥ n. It\'s cleaner, less error-prone, and works naturally with Schnorr aggregation. No more dummy-element hack.',
      },
      {
        q: 'How do Taproot transactions achieve privacy and efficiency simultaneously?',
        a: 'Taproot (BIP-341) combines Schnorr + MAST with a key insight: the most common spend path (the "key path" — just one signature) is indistinguishable from any complex MAST tree. A Taproot address is just a 32-byte public key (not a script hash). When spending via the key path, the transaction looks like a simple single-signature payment. The script tree is only revealed if used. This means complex smart contracts and simple payments look identical to observers — full privacy for complex usage, and lower fees for everyone.',
      },
    ],
    funFact: 'Taproot\'s name comes from the analogy of a tree\'s taproot — a single, unified root that branches out. The "key path" spend is the taproot, and the script paths are the branching roots. The name also hints at Bitcoin "tapping into" new capabilities.',
  },

  /* ── Fallback for unrecognized repos ────────────────── */
}

export function getFallbackMeta(): CuratedMeta {
  return {
    difficulty: 'Beginner',
    displayTitle: 'Repository Overview',
    qa: [
      { q: 'What is the main purpose of this repository?', a: 'Explore the README and source code to understand the project\'s goals. Each repository in this hub is part of a broader Bitcoin education ecosystem.' },
      { q: 'What problem does this project solve?', a: 'Check the repository description, open issues, and documentation to discover the specific problem this project addresses in the Bitcoin space.' },
      { q: 'How can you get involved or contribute?', a: 'Fork the repo, open issues for bugs or feature requests, submit pull requests, or start a discussion in the GitHub community.' },
    ],
  }
}
