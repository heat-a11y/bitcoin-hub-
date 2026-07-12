<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="MIT License" />
</p>

# 🇲🇾 MALP — Malaysian English Lesson Plan Generator

> **M**alaysian **A**I **L**esson **P**lanner — Generate Daily, Weekly, and Monthly English lesson plans aligned with the official MOE DSKP curriculum, Scheme of Work, and standard textbooks (Superminds, Get Smart Plus, English Plus 1, Academy Stars) for Years 1–6.

MALP is a fully serverless, open-source web application purpose-built for Malaysian primary school English teachers. It combines an interactive timetable planner, a comprehensive built-in DSKP curriculum browser, and an AI-powered lesson plan generator — all running entirely in your browser with zero backend dependencies.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **⚡ One-Click Generation** | Generate a complete, structured daily/weekly/monthly lesson plan with a single button click. Powered by GPT-4o via the Vercel AI SDK. |
| **📚 Full DSKP Coverage** | All Content Standards (1.1–5.3) and Learning Standards for Years 1–6 across Listening, Speaking, Reading, Writing, and Language Arts, pre-loaded and browseable. |
| **📖 Textbook Mapping** | Every unit from Superminds (Y1–Y2), Get Smart Plus (Y3–Y4), English Plus 1 (Y5), and Academy Stars (Y6) mapped to its corresponding standards. |
| **📅 Interactive Timetable** | Visual grid with click-to-add/edit slots. Supports split sessions (Part 1 / Part 2) for scheduling two blocks on the same day. |
| **🎸 Creative Hooks with Chords** | Generated plans include unit-themed songs with guitar chords (e.g., Capo 2, G, D, Em, Cadd9) to make lessons engaging. |
| **🎯 Differentiated Activities** | Every plan includes tiered tasks labelled `[Differentiated Process]` or `[Differentiated Product]` for advanced, standard, and low-readiness groups. |
| **🔒 Local-First Privacy** | All data — timetables, lesson plans, settings — is stored in your browser's localStorage. Nothing is sent to any server unless you choose to use AI generation. |
| **📄 Export & Copy** | Each plan can be exported as a print-ready PDF, copied to clipboard as formatted text, or edited inline. |
| **📱 Fully Responsive** | Works beautifully on desktops, tablets, and phones. Built with Tailwind CSS and shadcn/ui. |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **AI SDK** | [Vercel AI SDK](https://sdk.vercel.ai/) (`ai`, `@ai-sdk/openai`) |
| **LLM** | OpenAI GPT-4o (configurable via env) |
| **State** | Browser localStorage (zero-dependency, serverless) |
| **Standards** | ESLint + Prettier + `prettier-plugin-tailwindcss` |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.18+ ([download](https://nodejs.org/))
- **npm** 9+ (ships with Node.js)

### Installation

```bash
git clone https://github.com/heat-a11y/erph-moe.git
cd erph-moe
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app is fully functional without an API key. The AI feature is only needed when you click "Generate".

### Production Build

```bash
npm run build
```

The static output is written to `out/`. You can serve it with any static host or deploy to Vercel with zero configuration (see [Deployment Guide](DEPLOYMENT.md)).

### AI Setup (Optional)

To enable AI-powered lesson plan generation:

```bash
cp .env.example .env.local
# Edit .env.local and add your OpenAI key:
#   OPENAI_API_KEY=sk-...
```

Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys). The app gracefully falls back to template-based plans when no key is configured.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout + dark sidebar
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Theme CSS variables
│   ├── dashboard/
│   │   └── page.tsx               # Lesson plan hub (daily/weekly/monthly)
│   ├── timetable/
│   │   └── page.tsx               # Weekly timetable editor
│   ├── lesson-plans/
│   │   ├── page.tsx               # Legacy plans view
│   │   ├── weekly/page.tsx
│   │   └── monthly/page.tsx
│   ├── curriculum/
│   │   └── page.tsx               # DSKP standards browser + SoW viewer
│   └── api/
│       └── generate/
│           └── route.ts           # POST /api/generate — AI generation
├── components/
│   ├── ui/                        # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── sidebar.tsx                # Navigation sidebar
│   └── timetable-grid.tsx         # Interactive weekly timetable grid
├── data/
│   └── moeCurriculum.ts           # Full DSKP + textbook + SoW seed data
├── lib/
│   ├── utils.ts                   # cn() classname utility
│   └── store.ts                   # localStorage persistence hook
└── types/
    ├── index.ts                   # App-wide types + re-exports
    └── curriculum.ts              # Curriculum data model interfaces
```

---

## 📖 Curriculum Data

The app ships with a comprehensive, pre-loaded dataset covering the entire Malaysian primary English curriculum:

| Year | Textbook | Units | Themes |
|------|----------|-------|--------|
| **Year 1** | Superminds 1 | 9 | Self/Family, Stories, Knowledge |
| **Year 2** | Superminds 2 | 8 | Self/Family, Stories, Knowledge |
| **Year 3** | Get Smart Plus 3 | 10 | Self/Family, Knowledge |
| **Year 4** | Get Smart Plus 4 | 10 | Self/Family, Knowledge |
| **Year 5** | English Plus 1 | 8 | Self/Family, Knowledge |
| **Year 6** | Academy Stars | 10 | Self/Family, Stories, Knowledge, Arts |

Each unit includes:
- Core vocabulary and language focus
- Topics mapped to specific Learning Standards
- Content Standard and Learning Standard codes with full descriptions
- Scheme of Work week ranges

---

## 🤖 API Reference

### `POST /api/generate`

Generates a lesson plan using AI (requires `OPENAI_API_KEY`).

**Request body:**

```json
{
  "yearGroup": "Year 3",
  "theme": "World of Self, Family and Friends",
  "topic": "My New House",
  "skillArea": ["Reading", "Writing"],
  "mode": "daily",
  "weekNumber": 14,
  "timetableSlots": [
    {
      "day": "Monday",
      "period": 2,
      "part": 1,
      "startTime": "08:15",
      "endTime": "09:15",
      "yearGroup": "Year 3",
      "subject": "English"
    }
  ]
}
```

**Response:**

```json
{
  "markdown": "# MINGGU: 14 | TAHUN: 3 | ..."
}
```

Returns a structured Markdown lesson plan following the format specified in the system prompt, including objectives, differentiated activities, creative hooks, and closure activities.

**Error responses:**

| Status | Meaning |
|--------|---------|
| `400` | Missing required fields (`yearGroup`) or invalid JSON |
| `500` | Missing `OPENAI_API_KEY` or LLM failure |

---

## 🌐 Deployment

Deploy MALP to production in minutes. See the [full deployment guide](DEPLOYMENT.md) for Vercel, Netlify, GitHub Pages, and Docker options.

### One-Click Vercel Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheat-a11y%2Ferph-moe)

1. Click the button above.
2. Import the repository.
3. (Optional) Add `OPENAI_API_KEY` in Environment Variables.
4. Deploy — that's it.

---

## 🤝 Contributing

Contributions are welcome and encouraged! Whether it's fixing a bug, adding a new feature, improving the curriculum data, or writing documentation — every bit helps.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/amazing-idea`
3. Commit your changes: `git commit -m "feat: add amazing idea"`
4. Push: `git push origin feat/amazing-idea`
5. Open a Pull Request.

Please run `npm run lint` and `npm run build` before submitting.

---

## 📄 License

[MIT](LICENSE) — Free for personal, educational, and commercial use.

---

<p align="center">
  Built with ❤️ for Malaysian educators.<br>
  <sub>Not affiliated with the Malaysian Ministry of Education.</sub>
</p>
