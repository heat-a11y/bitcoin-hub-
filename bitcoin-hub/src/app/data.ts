export interface QA {
  q: string
  a: string
}

export interface GlossaryEntry {
  term: string
  definition: string
}

export interface CuratedMeta {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  displayTitle: string
  qa: QA[]
  glossary: GlossaryEntry[]
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
  'bitcoin-for-newbies': {
    difficulty: 'Beginner',
    displayTitle: 'Intro to Bitcoin & the UTXO Model',
    qa: [
      { q: 'What is a UTXO (Unspent Transaction Output)?', a: "Bitcoin doesn't use accounts or balances. Your wallet holds UTXOs — digital 'chunks' of Bitcoin. When you spend, you consume UTXOs as inputs and create new UTXOs as outputs. Each UTXO can only be spent once." },
      { q: 'How do Public and Private Keys work together?', a: 'Your Private Key is a secret 256-bit number that signs transactions. Your Public Key is derived from it — like a mailbox address. The one-way function (elliptic curve cryptography) makes it secure: you can derive public from private, but never the reverse.' },
      { q: 'What is a BIP-39 Seed Phrase?', a: '12 or 24 human-readable words that back up your entire wallet. Every private key is deterministically derived from this seed (BIP-32). Lose your wallet? Restore with the seed. But if anyone finds it, they own everything — store it on steel, offline.' },
      { q: 'Walk through a standard P2PKH transaction step by step.', a: '1. Alice wants to send Bob 0.1 BTC. 2. Her wallet finds UTXOs she owns (say, one 0.15 BTC UTXO). 3. She creates a transaction: input = 0.15 UTXO, output 1 = 0.1 BTC to Bob, output 2 = 0.049 BTC change to herself. 4. She broadcasts. 5. Miners include it in a block. 6. Bob can now spend.' },
    ],
    glossary: [
      { term: 'UTXO', definition: 'Unspent Transaction Output — a "chunk" of Bitcoin you own.' },
      { term: 'Private Key', definition: 'A secret 256-bit number that proves you own Bitcoin.' },
      { term: 'Public Key', definition: 'Derived from private key, used to receive Bitcoin.' },
      { term: 'BIP-39', definition: 'Standard for mnemonic seed phrases (12-24 words).' },
      { term: 'P2PKH', definition: 'Pay to Public Key Hash — the most common transaction type.' },
      { term: 'HD Wallet', definition: 'Hierarchical Deterministic wallet — derives keys from one seed.' },
      { term: 'Elliptic Curve', definition: 'The cryptography (secp256k1) securing Bitcoin keys.' },
    ],
    funFact: 'The first real-world Bitcoin transaction bought two pizzas for 10,000 BTC in 2010 — the most expensive pizzas in history.',
  },

  'bitcoiner-travelling': {
    difficulty: 'Beginner',
    displayTitle: 'Bitcoin on the Go — Travel & Mobile Security',
    qa: [
      { q: 'What precautions should you take when travelling with Bitcoin?', a: 'Never carry your entire net worth on your phone. Use a hardware wallet for cold storage and bring only a small spending amount in a mobile wallet. Write your seed phrase on fireproof steel — never photograph it or upload it to any cloud service.' },
      { q: 'Mobile wallets vs hardware wallets — which should you use?', a: 'Mobile wallets (Muun, Blue Wallet) are hot wallets — convenient but keys are on an internet-connected device. Hardware wallets keep keys on a dedicated offline chip. Best practice: hardware wallet for savings, mobile wallet for daily spending.' },
      { q: 'How do you verify a Bitcoin transaction without internet?', a: 'Using SPV (Simplified Payment Verification). Satoshi Nakamoto designed Bitcoin so you only need block headers to verify. Satellite nodes broadcast the blockchain from space — Blockstream Satellite covers the entire planet.' },
    ],
    glossary: [
      { term: 'Hot Wallet', definition: 'A wallet with private keys on an internet-connected device.' },
      { term: 'Cold Wallet', definition: 'A wallet with private keys stored offline.' },
      { term: 'Hardware Wallet', definition: 'A dedicated device that stores keys offline (e.g. Ledger, Trezor).' },
      { term: 'SPV', definition: 'Simplified Payment Verification — lightweight block verification.' },
      { term: 'Blockstream Satellite', definition: 'Bitcoin blockchain broadcast from space via satellite.' },
      { term: 'Seed Phrase', definition: '12-24 words that recover your wallet. Never digitize it.' },
    ],
    funFact: 'Blockstream Satellite broadcasts the Bitcoin blockchain from geostationary orbit. Even with no internet, Bitcoin still works via space!',
  },

  'intermediate-bitcoin': {
    difficulty: 'Intermediate',
    displayTitle: 'Lightning Network & Multisig Architecture',
    qa: [
      { q: 'How does a Lightning Network payment channel work?', a: 'Two parties create a 2-of-2 multisig funding transaction on the base chain. Inside the channel, they update commitment transactions reflecting the balance — thousands of times, instantly, without touching the blockchain. Closing broadcasts the final state.' },
      { q: 'What are HTLCs (Hashed Timelock Contracts)?', a: 'HTLCs enable multi-hop payments. Alice pays Bob through Carol: funds are locked with a hash. Bob reveals the secret to claim, which lets Carol claim from Alice. Hash locks prevent theft, time locks prevent stuck funds.' },
      { q: 'What are commitment transactions and revocation keys?', a: 'Every channel balance update creates a new commitment transaction. Each has a unique revocation key held by the counterparty. If Alice cheats by broadcasting old state, Bob sweeps ALL funds — cheat and lose everything.' },
      { q: 'How does multi-signature (m-of-n) work?', a: 'Requires m out of n signatures. Example: 2-of-3 means 3 key holders, 2 must sign. Used for corporate treasuries, inheritance, or security. With Schnorr (Taproot), multisig looks like single-sig on-chain.' },
    ],
    glossary: [
      { term: 'Lightning Network', definition: 'Layer-2 payment protocol for instant, cheap Bitcoin transactions.' },
      { term: 'HTLC', definition: 'Hashed Timelock Contract — conditional payment that expires.' },
      { term: 'Commitment Transaction', definition: 'Updated channel state reflecting current balance.' },
      { term: 'Revocation Key', definition: 'Key that lets a party punish cheaters by taking all funds.' },
      { term: 'Multisig', definition: 'Multi-signature — requires multiple keys to authorize.' },
      { term: '2-of-3', definition: 'A multisig where 2 out of 3 key holders must sign.' },
      { term: 'Routing Node', definition: 'A Lightning node that forwards payments for a small fee.' },
    ],
    funFact: 'The Lightning Network can theoretically handle millions of transactions per second globally — making Bitcoin usable for everyday coffee purchases.',
  },

  'advanced-bitcoiner': {
    difficulty: 'Advanced',
    displayTitle: 'Taproot, Schnorr & Advanced Script Mechanics',
    qa: [
      { q: 'How do Schnorr signatures (BIP-340) improve Bitcoin?', a: 'Schnorr enables signature aggregation — a 15-of-15 multisig produces ONE signature. This improves privacy (complex contracts look simple) and saves block space. Also enables MuSig key aggregation and batch verification.' },
      { q: 'What is MAST (Merkelized Alternative Script Trees)?', a: 'MAST (BIP-341) encodes multiple spending conditions as Merkle tree leaves. Spending reveals only the used condition + proof — others stay hidden. Before MAST, all conditions were revealed on-chain, leaking your contract logic.' },
      { q: "What's the difference between OP_CHECKSIG and OP_CHECKSIGADD?", a: 'OP_CHECKMULTISIG had a known off-by-one bug requiring a dummy element workaround. Taproot introduced OP_CHECKSIGADD: it adds 1 to a counter per valid signature. Cleaner, less error-prone, works with Schnorr aggregation.' },
      { q: 'How do Taproot transactions achieve privacy and efficiency?', a: 'Taproot combines Schnorr + MAST: the most common spend (key path — one signature) is indistinguishable from complex script trees. A Taproot address is just a 32-byte public key. Script tree only revealed if used.' },
    ],
    glossary: [
      { term: 'Taproot', definition: 'Bitcoin upgrade (2021) improving privacy and smart contracts.' },
      { term: 'Schnorr Signature', definition: 'Aggregatable signature scheme (BIP-340).' },
      { term: 'MAST', definition: 'Merkelized Alternative Script Trees — hides unused spending conditions.' },
      { term: 'OP_CHECKSIGADD', definition: 'Taproot opcode for cleaner multisig verification.' },
      { term: 'MuSig', definition: 'Protocol for Schnorr key aggregation across multiple parties.' },
      { term: 'BIP-340', definition: 'The Bitcoin Improvement Proposal for Schnorr signatures.' },
      { term: 'Key Path', definition: 'The simplest Taproot spend — just one signature.' },
    ],
    funFact: "Taproot's name comes from a tree's taproot — a single unified root that branches out. The key path is the taproot, script paths are the branching roots.",
  },
}

export function getFallbackMeta(): CuratedMeta {
  return {
    difficulty: 'Beginner',
    displayTitle: 'Repository Overview',
    qa: [
      { q: 'What is the main purpose of this repository?', a: 'Explore the README and source code to understand the project\'s goals. Each repository in this hub is part of a broader Bitcoin education ecosystem.' },
      { q: 'What problem does this project solve?', a: 'Check the repository description, open issues, and documentation to discover the specific problem this project addresses in the Bitcoin space.' },
    ],
    glossary: [
      { term: 'Repository', definition: 'A code project hosted on GitHub.' },
      { term: 'Bitcoin Ecosystem', definition: 'The network of developers, miners, nodes, and users.' },
    ],
  }
}

export interface QuestQuestion {
  question: string
  options: string[]
  correct: number
}

export interface QuestLevel {
  name: string
  boss: string
  zone: string
  questions: QuestQuestion[]
}

export const QUEST_LEVELS: QuestLevel[] = [
  {
    name: 'First Block',
    boss: 'NOOB Smasher',
    zone: 'Fiat Plains',
    questions: [
      { question: 'What is the smallest unit of Bitcoin?', options: ['Satoshi', 'Wei', 'Gwei', 'Finney'], correct: 0 },
      { question: 'Who created Bitcoin?', options: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Hal Finney', 'Nick Szabo'], correct: 1 },
      { question: 'What year was Bitcoin launched?', options: ['2008', '2009', '2010', '2011'], correct: 1 },
      { question: "What is Bitcoin's maximum supply?", options: ['21 million', '18 million', '25 million', 'Unlimited'], correct: 0 },
      { question: 'What technology is Bitcoin built on?', options: ['Cloud computing', 'Blockchain', 'AI', 'Quantum computing'], correct: 1 },
    ],
  },
  {
    name: 'Key Quest',
    boss: 'Pump & Dump King',
    zone: 'Altcoin Swamp',
    questions: [
      { question: 'What does a private key prove?', options: ['Your identity', 'Ownership of Bitcoin', 'Your location', 'Your email'], correct: 1 },
      { question: 'How long is a typical seed phrase?', options: ['6 words', '12 or 24 words', '32 words', '3 words'], correct: 1 },
      { question: 'What is a hardware wallet?', options: ['A physical Bitcoin coin', 'Offline key storage device', 'A type of exchange', 'A mining rig'], correct: 1 },
      { question: 'What is derived from a private key?', options: ['Seed phrase', 'Public key', 'Password', 'Username'], correct: 1 },
      { question: 'What does BIP stand for?', options: ['Bitcoin Internal Protocol', 'Bitcoin Improvement Proposal', 'Blockchain Integration Plan', 'Base Input Process'], correct: 1 },
    ],
  },
  {
    name: 'Transaction Trail',
    boss: 'Fiat Overlord',
    zone: 'Bankers Canyon',
    questions: [
      { question: 'What does UTXO stand for?', options: ['Universal Transaction Output', 'Unspent Transaction Output', 'Unique Transaction Origin', 'Unified Transfer Object'], correct: 1 },
      { question: 'How long does a Bitcoin block take on average?', options: ['1 minute', '5 minutes', '10 minutes', '30 minutes'], correct: 2 },
      { question: 'What are transaction fees paid to?', options: ['The exchange', 'Miners', 'The government', 'Node operators'], correct: 1 },
      { question: 'What is a mempool?', options: ['A mining pool', 'Pool of unconfirmed transactions', 'A wallet backup', 'A type of smart contract'], correct: 1 },
      { question: 'What does P2PKH mean?', options: ['Peer to Peer Key Hash', 'Pay to Public Key Hash', 'Protocol to Private Key Hash', 'Point to Point Key Handling'], correct: 1 },
    ],
  },
  {
    name: 'Proof of Work',
    boss: 'Hash Tyrant',
    zone: 'Mining Mountains',
    questions: [
      { question: 'What do miners compete to solve?', options: ['A Sudoku puzzle', 'A cryptographic hash', 'A math equation', 'A crossword'], correct: 1 },
      { question: 'What is the block reward?', options: ['Newly minted BTC + fees', 'Only fees', 'Stock options', 'Gold coins'], correct: 0 },
      { question: 'How often does difficulty adjust?', options: ['Every block', 'Every 2016 blocks', 'Every year', 'Never'], correct: 1 },
      { question: 'What is a nonce?', options: ['A transaction type', 'Number used once in mining', 'A wallet address', 'A digital signature'], correct: 1 },
      { question: 'What happens when miners find a valid block?', options: ['They get nothing', 'They earn the block reward', 'They pay a penalty', 'They lose their hash power'], correct: 1 },
    ],
  },
  {
    name: 'Fortress Bitcoin',
    boss: 'Security Breach',
    zone: 'Firewall Forest',
    questions: [
      { question: 'What is a 51% attack?', options: ['Controlling majority of hash power', 'Stealing 51% of coins', 'A virus', 'A phishing scam'], correct: 0 },
      { question: 'What is the safest way to store Bitcoin?', options: ['On an exchange', 'In a cold wallet', 'In a bank', 'In a cloud backup'], correct: 1 },
      { question: 'What does multisig require?', options: ['Multiple passwords', 'Multiple signatures to authorize', 'Multiple emails', 'Multiple phones'], correct: 1 },
      { question: 'What is the biggest risk to your Bitcoin?', options: ['Price dropping', 'Losing your private keys', 'Hackers on the network', 'Government ban'], correct: 1 },
      { question: 'Why is address reuse bad?', options: ['It costs more fees', 'It hurts privacy', 'It slows the network', 'It reduces supply'], correct: 1 },
    ],
  },
  {
    name: 'Lightning Strike',
    boss: 'Slow Chain',
    zone: 'Layer 2 Sky',
    questions: [
      { question: 'What layer does Lightning Network operate on?', options: ['Layer 0', 'Layer 1', 'Layer 2', 'Layer 3'], correct: 2 },
      { question: 'What opens a Lightning payment channel?', options: ['A credit card', 'A funding transaction on-chain', 'A bank transfer', 'A smart contract'], correct: 1 },
      { question: 'What does HTLC prevent?', options: ['Double spending', 'Theft by routing nodes', 'High fees', 'Slow blocks'], correct: 1 },
      { question: 'How are Lightning transactions settled?', options: ['On-chain when channel closes', 'Instantly in the channel', 'Via email', 'Through a bank'], correct: 0 },
      { question: 'What do routing nodes earn?', options: ['Block rewards', 'Routing fees', 'Interest', 'Staking rewards'], correct: 1 },
    ],
  },
  {
    name: 'Tech Upgrade',
    boss: 'Script Wizard',
    zone: 'Code Citadel',
    questions: [
      { question: 'What year was Taproot activated?', options: ['2019', '2020', '2021', '2022'], correct: 2 },
      { question: 'What does Schnorr allow aggregation of?', options: ['Blocks', 'Signatures', 'Transactions', 'Fees'], correct: 1 },
      { question: 'What does MAST hide?', options: ['Transaction amounts', 'Unused spending conditions', 'Block times', 'Wallet balances'], correct: 1 },
      { question: 'What is a timelock?', options: ['A smart lock for hardware wallets', 'A transaction locked until a time', 'A mining timer', 'A password timeout'], correct: 1 },
      { question: 'What does RBF stand for?', options: ['Rapid Block Finality', 'Replace-by-Fee', 'Recursive Block Format', 'Random Block Finder'], correct: 1 },
    ],
  },
  {
    name: 'Economic Warfare',
    boss: 'Inflation Monster',
    zone: 'Central Bank Dungeon',
    questions: [
      { question: 'What happens at a Bitcoin halving?', options: ['Price doubles', 'Block reward halves', 'Supply caps', 'Fees increase'], correct: 1 },
      { question: 'What was the first block reward?', options: ['25 BTC', '50 BTC', '100 BTC', '10 BTC'], correct: 1 },
      { question: 'What is the current block reward?', options: ['6.25 BTC', '3.125 BTC', '1.5625 BTC', '12.5 BTC'], correct: 1 },
      { question: 'When is the next halving expected?', options: ['2026', '2027', '2028', '2029'], correct: 2 },
      { question: 'What is the total number of Bitcoin that will ever exist?', options: ['18 million', '21 million', '25 million', 'Infinite'], correct: 1 },
    ],
  },
  {
    name: 'Privacy & Culture',
    boss: 'Surveillance Bot',
    zone: 'Dark Forest',
    questions: [
      { question: 'What is coinjoin?', options: ['A new cryptocurrency', 'A privacy technique mixing coins', 'A mining method', 'A wallet type'], correct: 1 },
      { question: 'What does KYC stand for?', options: ['Keep Your Coins', 'Know Your Customer', 'Key Your Crypto', 'Keep Your Credit'], correct: 1 },
      { question: 'What does HODL mean?', options: ['Hold On for Dear Life', 'High Order Digital Ledger', 'Half On-chain Deposit Limit', 'Hardened Offline Device Layer'], correct: 0 },
      { question: 'What does "not your keys, not your crypto" mean?', options: ['You must self-custody', 'You need a password', 'Keys are optional', 'Use a bank'], correct: 0 },
      { question: 'What does a Bitcoin node do?', options: ['Mines new blocks', 'Validates transactions and blocks', 'Creates new Bitcoin', 'Manages exchanges'], correct: 1 },
    ],
  },
  {
    name: 'Final Stand',
    boss: 'Satoshi Specter',
    zone: 'Genesis Chamber',
    questions: [
      { question: 'What is the Genesis Block?', options: ['The first Bitcoin block ever mined', 'The largest block', 'A test block', 'An empty block'], correct: 0 },
      { question: 'What message is encoded in the Genesis Block?', options: ['"Hello World"', '"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"', '"Bitcoin is money"', '"Freedom"'], correct: 1 },
      { question: 'What is OP_RETURN used for?', options: ['Returning change', 'Storing data on-chain', 'Reversing transactions', 'Cancelling payments'], correct: 1 },
      { question: 'What makes Bitcoin different from altcoins?', options: ['Faster transactions', 'True decentralization & fixed supply', 'Lower fees', 'More features'], correct: 1 },
      { question: 'Why is Bitcoin called "sound money"?', options: ['It makes noise when spent', 'Fixed supply, decentralized, secure', 'It is backed by gold', 'It is legal tender everywhere'], correct: 1 },
    ],
  },
]

export const GLOSSARY_ALL: GlossaryEntry[] = [
  { term: 'UTXO', definition: 'Unspent Transaction Output — a "chunk" of Bitcoin you own.' },
  { term: 'Private Key', definition: 'A secret 256-bit number that proves you own Bitcoin.' },
  { term: 'Public Key', definition: 'Derived from private key, used to receive Bitcoin.' },
  { term: 'BIP', definition: 'Bitcoin Improvement Proposal — standards for protocol changes.' },
  { term: 'HD Wallet', definition: 'Hierarchical Deterministic wallet — derives keys from one seed.' },
  { term: 'Lightning Network', definition: 'Layer-2 protocol for instant, cheap Bitcoin payments.' },
  { term: 'HTLC', definition: 'Hashed Timelock Contract — conditional payment that can expire.' },
  { term: 'Multisig', definition: 'Requires multiple signatures to authorize a transaction.' },
  { term: 'Taproot', definition: '2021 Bitcoin upgrade for privacy and smart contract efficiency.' },
  { term: 'Schnorr', definition: 'Signature scheme enabling aggregation for privacy and savings.' },
  { term: 'MAST', definition: 'Merkelized Alternative Script Trees — hides unused spending conditions.' },
  { term: 'Mempool', definition: 'Pool of unconfirmed transactions waiting for block inclusion.' },
  { term: 'Halving', definition: 'Block reward cut in half every 210,000 blocks (~4 years).' },
  { term: 'Nonce', definition: 'A number used once by miners to try to solve a block.' },
  { term: 'HODL', definition: '"Hold On for Dear Life" — never sell through the cycles.' },
  { term: 'KYC', definition: 'Know Your Customer — identity verification required by exchanges.' },
  { term: 'Coinjoin', definition: 'Privacy technique that mixes multiple users\' coins together.' },
  { term: 'RBF', definition: 'Replace-by-Fee — replace an unconfirmed tx with a higher fee one.' },
  { term: 'SPV', definition: 'Simplified Payment Verification — lightweight transaction verification.' },
  { term: 'P2PKH', definition: 'Pay to Public Key Hash — the classic Bitcoin transaction type.' },
]
