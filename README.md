<<<<<<< HEAD
# ResearchGPT 🔬🚀
### Next-Generation AI Research Assistant, Grounded Literature Synthesizer & Fake Citation Guard

> A production-ready scientific research ecosystem combining the best capabilities of **AnswerThis**, **Paperpal**, and **Jenni AI**. Built with **Next.js 15 (App Router)**, **Tailwind CSS**, **Express.js**, **Express Validator**, **REST APIs**, and **PWA** technology.

---

## 🌟 Overview & Key Features

ResearchGPT is an all-in-one research workstation engineered for scientists, academics, postgraduate researchers, and engineering leaders.

### 📚 1. Smart PDF Reader & Research Library
- **Upload & Read Manuscripts**: Drag & drop scientific PDF documents (arXiv, IEEE, ACM, Nature, PubMed) or input metadata manually.
- **Section Extraction & Outline Navigation**: Automatically indexes sections, abstracts, keywords, and citations.
- **Interactive Reader**: Zoom controls (70% - 150%), page jumping, dual view (Smart Reader & Raw PDF Embed), and APA/BibTeX one-click export.

### 💬 2. Multi-Paper Grounded Chat (AnswerThis Style)
- **Multi-Document Synthesis**: Select 1, 2, or 10+ papers from your workspace simultaneously.
- **Verifiable Citations**: Every answer includes grounded references specifying **exact page numbers**, **paper titles**, and **verbatim excerpted quotes**.
- **Consensus & Divergence**: Automatically synthesizes whether authors agree on empirical findings or represent competing paradigms.

### 🛡️ 3. Fake Citation & Hallucination Guard (Paperpal Style)
- **Detect Fabricated Citations**: Catches non-existent DOIs, synthesized LLM author combinations, and fabricated papers.
- **Live CrossRef & arXiv Verification**: Verifies DOIs against official global registries in real-time.
- **Hallucination Risk Meter (0–100%)**: Color-coded risk status (🟢 Verified Authentic, 🟡 Suspicious / Incomplete, 🔴 Hallucinated / Fabricated).
- **Suggested Authentic Replacements**: Suggests real, peer-reviewed publications that match the intended topic.

### ✍️ 4. Jenni AI Co-Writer & Paperpal Academic Tone Auditor
- **Ghost-Text Autocomplete**: Suggests intelligent scholarly sentence continuations as you write (Press **Tab** to accept).
- **Academic Paraphrasing**: 4 scholarly rewrite modes (**Academic**, **Expand**, **Condense**, **Simplify**).
- **Paperpal Language & Tone Audit**: Computes an **Academic Rigor Score (0–100)**, classifies tone (Objective vs. Informal vs. Speculative), calculates readability, and flags colloquialisms with one-click replacements.
- **Inline Citations**: Insert standardized parenthetical citations directly into drafts.

### ⚖️ 5. Methodology Comparison Matrix
- **Differential Matrix**: Side-by-side comparative table evaluating **Architectures**, **Benchmark Datasets**, **Empirical Metrics**, and **Documented Limitations**.
- **Consensus & Divergence Analysis**: Synthesized breakdowns of architectural alignment and compute trade-offs.
- **Export Matrix**: Download comparative tables as Markdown (`.md`).

### 🔎 6. Online Scholar & arXiv Search
- **Live Scientific Search**: Queries millions of scientific papers via the public arXiv API and curated seminal registries.
- **Google Scholar Style**: Displays citation metrics, author lists, publication venues, DOIs, and abstracts.
- **One-Click Workspace Import**: Instantly ingest search results into your ResearchGPT library.
- **BibTeX Generator**: Instant BibTeX modal with copy button.

### 📑 7. Structured Literature Review Generator
- **Publication-Ready Synthesis**: Formulates 7 standardized sections:
  1. Executive Summary & Scope
  2. Thematic Taxonomy & Categorization
  3. Methodological Landscape
  4. Synthesis of Findings & Cross-Paper Connections
  5. Critical Research Gaps in Existing Literature
  6. Future Research Directions
  7. Formatted Scientific References & Bibliographies
- **Export**: One-click Markdown download and clipboard copy.

### 🌐 8. Interactive Research Knowledge Graph
- **Topological Connection Map**: SVG force-directed network visualizing relationships between papers, methodology clusters, authors, and keywords.
- **Interactive Inspection**: Pan, zoom, and click nodes to view cross-citation connections and citation counts.

### 📱 9. Mobile-First Progressive Web App (PWA)
- **Installable**: One-click "Install App" banner on iOS, Android, and Desktop.
- **Offline Resilience**: Service worker caching and offline fallbacks.
- **Mobile Touch Controls**: Bottom navigation bar, collapsible sidebar drawers, and adaptive cards.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling & UI** | Tailwind CSS 3.4, Glassmorphism, Lucide React Icons |
| **Backend REST API** | Express.js 4.21, Multer (PDF uploads), CORS |
| **Validation Layer** | Express Validator (`body`, `query`, `validationResult`) |
| **Scientific Data & APIs** | CrossRef Global REST API, arXiv API, BibTeX |
| **PWA & Offline** | Web App Manifest (`manifest.json`), Service Worker (`sw.js`) |
| **State Management** | React Context (`LibraryContext`, `ThemeContext`, `ToastContext`) |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ / v22+
- **npm**: v9+ or v10+ / v11+

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/researchgpt.git
cd researchgpt
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Running the Application

You have three convenient ways to run the project:

#### Option A: Run Next.js 15 App Router (Frontend + Next.js API Routes)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option B: Run Standalone Express.js REST API Server
```bash
npm run server
```
Runs the Express REST server on port `5000` with all `express-validator` endpoints active at `http://localhost:5000/api/v1/...`.

#### Option C: Run Both Concurrently
```bash
npm run dev:all
```
Runs Next.js on `http://localhost:3000` and Express REST API on `http://localhost:5000` simultaneously.

---

## 📦 Steps to Push to GitHub

Follow these steps to publish the codebase to a new GitHub repository:

### Step 1: Initialize Git Repository (if not already done)
```bash
git init
```

### Step 2: Verify `.gitignore`
Make sure `node_modules/`, `.next/`, and `.env*.local` are ignored:
```bash
git status
```

### Step 3: Add and Commit Files
```bash
git add .
git commit -m "feat: initial commit of ResearchGPT AI research assistant"
```

### Step 4: Rename Branch to `main`
```bash
git branch -M main
```

### Step 5: Create a Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Set repository name to `researchgpt`.
3. Choose **Public** or **Private**.
4. **Do not** initialize with README or `.gitignore` (we already created them).
5. Click **Create repository**.

### Step 6: Link Remote and Push
Replace `your-username` with your GitHub username:
```bash
git remote add origin https://github.com/your-username/researchgpt.git
git push -u origin main
```

---

## ☁️ Steps to Deploy on Vercel

ResearchGPT is optimized for **zero-config deployment on Vercel** using Next.js 15 App Router.

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [https://vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** ➔ **"Project"**.
3. Import your `researchgpt` repository from GitHub.
4. Vercel automatically detects Next.js:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `next build` (or `npm run build`)
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
5. **Environment Variables**:
   Add the following optional variables (under Project Settings ➔ Environment Variables):
   - `NEXT_PUBLIC_APP_NAME`: `ResearchGPT`
   - `NODE_ENV`: `production`
6. Click **"Deploy"**.
7. In ~60 seconds, your application will be live at `https://researchgpt-xxxx.vercel.app`!

### Method 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. Run the deployment command from the project root:
   ```bash
   vercel
   ```
3. Follow the CLI prompts (Link to existing project: No, Project Name: researchgpt).
4. For production deployment:
   ```bash
   vercel --prod
   ```

---

## 📱 PWA Installation Instructions

ResearchGPT complies with W3C Progressive Web App standards:
- **Chrome / Edge / Desktop**: Click the **"Install"** button in the bottom-right corner or the install icon in your browser's address bar.
- **iOS (Safari)**: Tap the **Share** button (box with arrow pointing up) ➔ scroll down and select **"Add to Home Screen"**.
- **Android (Chrome)**: Tap the in-app **"Install ResearchGPT App"** toast or open the 3-dot menu ➔ **"Install app"**.

---

## 🧪 Testing Express REST API & Validator

To run the built-in validation test suite for Express and `express-validator`:
```bash
node -e "
const app = require('./server/index.js');
const server = app.listen(5099, async () => {
  const health = await fetch('http://localhost:5099/api/v1/health').then(r => r.json());
  console.log('Health:', health.status);
  const verify = await fetch('http://localhost:5099/api/v1/citations/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ citationText: 'Fake Author (2029). DOI: 10.9999/fake' })
  }).then(r => r.json());
  console.log('Fake Detector Result:', verify.result.status, 'Risk:', verify.result.hallucinationRisk);
  server.close();
  process.exit(0);
});
"
```

---

## 📄 License

MIT License © 2026 ResearchGPT Team.
=======
# MyRepository
>>>>>>> 7186370ecace84002666f64175f58eddeed6fdec
