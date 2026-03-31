# Capital Core Dance Studio — Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-page static marketing website for Capital Core Dance Studio using React + Vite + Tailwind CSS with no backend.

**Architecture:** Single-page application shell with React Router v6 client-side routing. Three shared layout components (Navbar, PageHeader, Footer) are composed directly into each page component. All content is static placeholder data — no API calls or state management beyond the Navbar mobile toggle.

**Tech Stack:** React 19, Vite, Tailwind CSS v3, React Router v7 (library mode), Vitest, @testing-library/react, jsdom

---

## File Map

```
capitalcoredancewebsite/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .gitignore
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── test/
│   │   └── setup.js
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Footer.test.jsx
│   │   ├── PageHeader.jsx
│   │   ├── PageHeader.test.jsx
│   │   ├── Navbar.jsx
│   │   └── Navbar.test.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Home.test.jsx
│       ├── Classes.jsx
│       ├── Classes.test.jsx
│       ├── Camps.jsx
│       ├── Camps.test.jsx
│       ├── Birthdays.jsx
│       ├── Birthdays.test.jsx
│       ├── Contact.jsx
│       └── Contact.test.jsx
```

---

## Task 1: Scaffold the project

**Files:**
- Create: `package.json`, `index.html`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `.gitignore`

- [ ] **Step 1: Create the Vite + React project**

Run from `C:/Users/hicks/capitalcoredancewebsite`:
```bash
npm create vite@latest . -- --template react
```
When prompted "Current directory is not empty. Remove existing files and continue?" — choose **Yes**.
When prompted for project name — use `.` (current directory).

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Initialize Tailwind**

```bash
npx tailwindcss init -p
```

- [ ] **Step 4: Update `.gitignore` to exclude brainstorm files**

Replace the contents of `.gitignore` with:
```
# Logs
logs
*.log
npm-debug.log*

# Runtime
node_modules
dist
dist-ssr
*.local

# Editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Superpowers brainstorm sessions
.superpowers/
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json index.html vite.config.js .gitignore
git commit -m "feat: scaffold Vite + React project with dependencies"
```

---

## Task 2: Configure Tailwind, tests, and app entry point

**Files:**
- Modify: `tailwind.config.js`
- Modify: `vite.config.js`
- Create: `src/test/setup.js`
- Modify: `src/index.css`
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Configure Tailwind with brand colors**

Replace `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          dark: '#0d1b36',
          mid: '#1e3a6e',
        },
        brand: {
          red: '#c0392b',
        },
        surface: {
          light: '#f4f6fa',
          border: '#e0e6f0',
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Configure Vite for Vitest**

Replace `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

- [ ] **Step 3: Create test setup file**

Create `src/test/setup.js`:
```js
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add Tailwind directives to CSS**

Replace `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 5: Update main.jsx**

Replace `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 6: Create placeholder App.jsx with routing**

Replace `src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-8 text-navy-dark font-black">Home — coming soon</div>} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite dev server starts, browser shows "Home — coming soon" at `http://localhost:5173`

- [ ] **Step 8: Commit**

```bash
git add src/ tailwind.config.js vite.config.js
git commit -m "feat: configure Tailwind brand colors, Vitest, and app routing shell"
```

---

## Task 3: Footer component

**Files:**
- Create: `src/components/Footer.jsx`
- Create: `src/components/Footer.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Footer.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

test('renders studio name', () => {
  render(<Footer />)
  expect(screen.getByText('CAPITAL CORE DANCE STUDIO')).toBeInTheDocument()
})

test('renders location placeholder', () => {
  render(<Footer />)
  expect(screen.getByText(/Midlothian, Virginia/)).toBeInTheDocument()
})

test('renders copyright', () => {
  render(<Footer />)
  expect(screen.getByText(/© 2026 Capital Core Dance Studio/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- --run src/components/Footer.test.jsx
```
Expected: FAIL — `Cannot find module './Footer'`

- [ ] **Step 3: Implement Footer**

Create `src/components/Footer.jsx`:
```jsx
export default function Footer() {
  return (
    <footer className="bg-navy-dark py-7 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <div className="text-white font-black text-sm tracking-widest">
            CAPITAL CORE DANCE STUDIO
          </div>
          <div className="text-[#5a7aaa] text-xs mt-1">
            Midlothian, Virginia · Business info coming soon
          </div>
        </div>
        <div className="text-[#5a7aaa] text-xs">
          © 2026 Capital Core Dance Studio
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- --run src/components/Footer.test.jsx
```
Expected: PASS — 3 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.jsx src/components/Footer.test.jsx
git commit -m "feat: add Footer component"
```

---

## Task 4: PageHeader component

**Files:**
- Create: `src/components/PageHeader.jsx`
- Create: `src/components/PageHeader.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/PageHeader.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import PageHeader from './PageHeader'

test('renders eyebrow text', () => {
  render(<PageHeader eyebrow="Capital Core Dance" title="Classes" subtitle="Year-round instruction" />)
  expect(screen.getByText('Capital Core Dance')).toBeInTheDocument()
})

test('renders title', () => {
  render(<PageHeader eyebrow="Capital Core Dance" title="Classes" subtitle="Year-round instruction" />)
  expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument()
})

test('renders subtitle', () => {
  render(<PageHeader eyebrow="Capital Core Dance" title="Classes" subtitle="Year-round instruction" />)
  expect(screen.getByText('Year-round instruction')).toBeInTheDocument()
})

test('renders without subtitle', () => {
  render(<PageHeader eyebrow="Capital Core Dance" title="Classes" />)
  expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- --run src/components/PageHeader.test.jsx
```
Expected: FAIL — `Cannot find module './PageHeader'`

- [ ] **Step 3: Implement PageHeader**

Create `src/components/PageHeader.jsx`:
```jsx
export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0d1b36] via-[#1a1040] to-[#5a1020] py-16 px-6">
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-red opacity-10 rounded-full" />
      <div className="relative max-w-6xl mx-auto">
        <p className="text-[#b8d4f0] text-xs font-semibold tracking-[0.3em] uppercase mb-2">
          {eyebrow}
        </p>
        <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#b8d4f0] text-sm md:text-base max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- --run src/components/PageHeader.test.jsx
```
Expected: PASS — 4 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/components/PageHeader.jsx src/components/PageHeader.test.jsx
git commit -m "feat: add PageHeader component"
```

---

## Task 5: Navbar component

**Files:**
- Create: `src/components/Navbar.jsx`
- Create: `src/components/Navbar.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Navbar.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function renderNavbar(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  )
}

test('renders logo text', () => {
  renderNavbar()
  expect(screen.getByText('CAPITAL CORE')).toBeInTheDocument()
  expect(screen.getByText('DANCE STUDIO')).toBeInTheDocument()
})

test('renders all nav links', () => {
  renderNavbar()
  expect(screen.getAllByRole('link', { name: 'Classes' })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Camps' })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Birthdays' })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Contact Us' })[0]).toBeInTheDocument()
})

test('highlights active link on /classes', () => {
  renderNavbar('/classes')
  const classesLinks = screen.getAllByRole('link', { name: 'Classes' })
  expect(classesLinks[0].className).toContain('text-[#f4a8b4]')
})

test('mobile menu toggle shows and hides menu', () => {
  renderNavbar()
  const toggleBtn = screen.getByLabelText('Toggle menu')
  // Mobile menu links are duplicated in DOM when open
  expect(screen.getAllByRole('link', { name: 'Classes' })).toHaveLength(1)
  fireEvent.click(toggleBtn)
  expect(screen.getAllByRole('link', { name: 'Classes' })).toHaveLength(2)
  fireEvent.click(toggleBtn)
  expect(screen.getAllByRole('link', { name: 'Classes' })).toHaveLength(1)
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- --run src/components/Navbar.test.jsx
```
Expected: FAIL — `Cannot find module './Navbar'`

- [ ] **Step 3: Implement Navbar**

Create `src/components/Navbar.jsx`:
```jsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/classes', label: 'Classes' },
  { to: '/camps', label: 'Camps' },
  { to: '/birthdays', label: 'Birthdays' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function linkClass(to) {
    return pathname === to
      ? 'text-[#f4a8b4] border-b-2 border-[#f4a8b4] pb-0.5'
      : 'text-[#b8d4f0] hover:text-white'
  }

  return (
    <nav className="bg-navy-dark sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-navy-mid border-2 border-dashed border-[#4a6a9e] rounded-md flex items-center justify-center flex-shrink-0">
            <span className="text-[#7ab3e8] text-[10px] font-bold">LOGO</span>
          </div>
          <div>
            <div className="text-white font-black text-sm tracking-widest">CAPITAL CORE</div>
            <div className="text-[#7ab3e8] text-[10px] tracking-[0.3em]">DANCE STUDIO</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={`text-sm font-medium transition-colors ${linkClass(to)}`}>
              {label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="bg-brand-red text-white text-sm font-bold px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Hamburger button */}
        <button
          className="md:hidden text-white text-xl leading-none"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-navy-dark border-t border-navy-mid px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${pathname === to ? 'text-[#f4a8b4]' : 'text-[#b8d4f0]'}`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="bg-brand-red text-white text-sm font-bold px-5 py-2 rounded-md text-center"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- --run src/components/Navbar.test.jsx
```
Expected: PASS — 4 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.jsx src/components/Navbar.test.jsx
git commit -m "feat: add Navbar component with mobile menu and active link state"
```

---

## Task 6: App routing

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace App.jsx with full routing**

Replace `src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Classes from './pages/Classes'
import Camps from './pages/Camps'
import Birthdays from './pages/Birthdays'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/camps" element={<Camps />} />
        <Route path="/birthdays" element={<Birthdays />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Create stub page files so App.jsx doesn't error**

Create `src/pages/Home.jsx`:
```jsx
export default function Home() { return <div>Home</div> }
```

Create `src/pages/Classes.jsx`:
```jsx
export default function Classes() { return <div>Classes</div> }
```

Create `src/pages/Camps.jsx`:
```jsx
export default function Camps() { return <div>Camps</div> }
```

Create `src/pages/Birthdays.jsx`:
```jsx
export default function Birthdays() { return <div>Birthdays</div> }
```

Create `src/pages/Contact.jsx`:
```jsx
export default function Contact() { return <div>Contact</div> }
```

- [ ] **Step 3: Verify dev server still runs**

```bash
npm run dev
```
Expected: Dev server starts, navigating to `http://localhost:5173` shows "Home"

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/pages/
git commit -m "feat: wire up React Router routes for all 5 pages"
```

---

## Task 7: Home page

**Files:**
- Modify: `src/pages/Home.jsx`
- Create: `src/pages/Home.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/Home.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

function renderHome() {
  return render(<MemoryRouter><Home /></MemoryRouter>)
}

test('renders hero headline', () => {
  renderHome()
  expect(screen.getByText('MOVE WITH')).toBeInTheDocument()
  expect(screen.getByText('PURPOSE')).toBeInTheDocument()
})

test('renders hero subtext', () => {
  renderHome()
  expect(screen.getByText(/Classes, camps, and birthday parties/)).toBeInTheDocument()
})

test('renders all 4 section card titles', () => {
  renderHome()
  expect(screen.getByRole('link', { name: /Classes/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Camps/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Birthdays/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Contact Us/ })).toBeInTheDocument()
})

test('renders What We Offer section heading', () => {
  renderHome()
  expect(screen.getByText('Everything your dancer needs')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- --run src/pages/Home.test.jsx
```
Expected: FAIL — tests fail because Home renders `<div>Home</div>`

- [ ] **Step 3: Implement the Home page**

Replace `src/pages/Home.jsx`:
```jsx
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SECTION_CARDS = [
  {
    to: '/classes',
    icon: '💃',
    title: 'Classes',
    subtitle: 'Year-round instruction',
    gradient: 'from-[#0d1b36] to-[#1e3a6e]',
    accentColor: 'text-[#7ab3e8]',
    description:
      'Ballet, jazz, hip hop, and more for all ages and skill levels. Weekly sessions in a supportive, energetic environment.',
    linkLabel: 'View Classes',
  },
  {
    to: '/camps',
    icon: '☀️',
    title: 'Camps',
    subtitle: 'Summer & holiday',
    gradient: 'from-[#5a1020] to-[#8a1a30]',
    accentColor: 'text-[#f4d0b8]',
    description:
      'Immersive multi-day camps packed with dance, creativity, and fun. Perfect for school breaks and summer schedules.',
    linkLabel: 'View Camps',
  },
  {
    to: '/birthdays',
    icon: '🎂',
    title: 'Birthdays',
    subtitle: 'Party packages',
    gradient: 'from-[#1a1040] to-[#2a1a60]',
    accentColor: 'text-[#f4a8b4]',
    description:
      'Celebrate in style at the studio! Custom dance party packages for kids of all ages. Unforgettable memories guaranteed.',
    linkLabel: 'View Packages',
  },
  {
    to: '/contact',
    icon: '📬',
    title: 'Contact Us',
    subtitle: 'Get in touch',
    gradient: 'from-[#0d3020] to-[#1a5a3a]',
    accentColor: 'text-[#b8f0d4]',
    description:
      "Questions? Ready to enroll? Reach out and we'll get back to you quickly. We'd love to have your dancer join our family.",
    linkLabel: 'Contact Us',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1b36] via-[#1a1040] to-[#5a1020] py-24 px-6 text-center">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-red opacity-[0.08] rounded-full" />
        <div className="absolute -bottom-20 -left-16 w-80 h-80 bg-[#7ab3e8] opacity-[0.06] rounded-full" />
        <div className="absolute top-8 left-16 w-2 h-2 bg-[#f4a8b4] opacity-60 rounded-full" />
        <div className="absolute bottom-12 right-20 w-1.5 h-1.5 bg-[#f4d0b8] opacity-60 rounded-full" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-[#f4a8b4] text-xs font-semibold tracking-[0.4em] uppercase mb-3">
            Midlothian, Virginia
          </p>
          <h1 className="text-white text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4">
            MOVE WITH<br />
            <span className="text-[#f4a8b4]">PURPOSE</span>
          </h1>
          <p className="text-[#b8d4f0] text-base md:text-lg mb-10 leading-relaxed">
            Classes, camps, and birthday parties for dancers of all ages and skill levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/classes"
              className="bg-brand-red text-white font-bold px-8 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Explore Classes
            </Link>
            <Link
              to="/birthdays"
              className="border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-md hover:border-white/60 transition-colors"
            >
              Plan a Party
            </Link>
          </div>
        </div>
      </section>

      {/* Section intro */}
      <section className="bg-white py-12 px-6 text-center">
        <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
          What We Offer
        </p>
        <h2 className="text-navy-dark text-3xl font-black">Everything your dancer needs</h2>
        <p className="text-[#5a6a8a] text-sm mt-2">
          From weekly classes to summer camps and unforgettable birthday parties
        </p>
      </section>

      {/* Section cards */}
      <section className="bg-surface-light px-6 pb-16 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTION_CARDS.map(({ to, icon, title, subtitle, gradient, accentColor, description, linkLabel }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-xl overflow-hidden border border-surface-border hover:shadow-lg transition-shadow group"
            >
              <div className={`bg-gradient-to-br ${gradient} px-6 py-7 text-center`}>
                <div className="text-4xl mb-2">{icon}</div>
                <div className="text-white text-lg font-black tracking-wide">{title}</div>
                <div className={`${accentColor} text-xs mt-1`}>{subtitle}</div>
              </div>
              <div className="p-5">
                <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">{description}</p>
                <span className="text-brand-red text-xs font-bold group-hover:underline">
                  {linkLabel} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- --run src/pages/Home.test.jsx
```
Expected: PASS — 4 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.test.jsx
git commit -m "feat: implement Home page with hero and section cards"
```

---

## Task 8: Classes page

**Files:**
- Modify: `src/pages/Classes.jsx`
- Create: `src/pages/Classes.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/Classes.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Classes from './Classes'

function renderClasses() {
  return render(<MemoryRouter initialEntries={['/classes']}><Classes /></MemoryRouter>)
}

test('renders page title', () => {
  renderClasses()
  expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument()
})

test('renders class listing cards', () => {
  renderClasses()
  expect(screen.getByText('Ballet')).toBeInTheDocument()
  expect(screen.getByText('Hip Hop')).toBeInTheDocument()
  expect(screen.getByText('Jazz')).toBeInTheDocument()
})

test('renders Enroll Now CTA', () => {
  renderClasses()
  expect(screen.getByRole('link', { name: 'Enroll Now' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- --run src/pages/Classes.test.jsx
```
Expected: FAIL — Classes renders stub `<div>Classes</div>`

- [ ] **Step 3: Implement the Classes page**

Replace `src/pages/Classes.jsx`:
```jsx
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
]

const CLASSES = [
  { name: 'Ballet', ages: 'Ages 3+', level: 'All levels', days: 'Mon / Wed' },
  { name: 'Hip Hop', ages: 'Ages 6+', level: 'Beginner–Intermediate', days: 'Tue / Thu' },
  { name: 'Jazz', ages: 'Ages 5+', level: 'All levels', days: 'Saturday' },
  { name: 'Contemporary', ages: 'Ages 8+', level: 'Intermediate+', days: 'Thursday' },
]

export default function Classes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Classes"
        subtitle="Year-round dance instruction for all ages and skill levels in a supportive, energetic environment."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            What We Teach
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Find the right class for your dancer
          </h2>

          <div className="flex flex-col gap-4">
            {CLASSES.map(({ name, ages, level, days }, i) => (
              <div
                key={name}
                className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4 flex items-center justify-between`}
              >
                <div>
                  <div className="text-navy-dark font-bold text-base">{name}</div>
                  <div className="text-[#5a6a8a] text-sm mt-0.5">
                    {ages} · {level}
                  </div>
                </div>
                <div className="text-[#7ab3e8] text-sm font-medium">{days}</div>
              </div>
            ))}

            <div className="border border-dashed border-surface-border rounded-lg px-5 py-4 text-center">
              <p className="text-[#8a9aaa] text-sm">More classes coming soon</p>
            </div>
          </div>

          <Link
            to="/contact"
            className="mt-8 block w-full bg-navy-dark text-white text-center font-bold py-3 rounded-md hover:bg-navy-mid transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- --run src/pages/Classes.test.jsx
```
Expected: PASS — 3 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/pages/Classes.jsx src/pages/Classes.test.jsx
git commit -m "feat: implement Classes page"
```

---

## Task 9: Camps page

**Files:**
- Modify: `src/pages/Camps.jsx`
- Create: `src/pages/Camps.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/Camps.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Camps from './Camps'

function renderCamps() {
  return render(<MemoryRouter initialEntries={['/camps']}><Camps /></MemoryRouter>)
}

test('renders page title', () => {
  renderCamps()
  expect(screen.getByRole('heading', { name: 'Camps' })).toBeInTheDocument()
})

test('renders camp listing cards', () => {
  renderCamps()
  expect(screen.getByText('Summer Intensive')).toBeInTheDocument()
  expect(screen.getByText('Holiday Camp')).toBeInTheDocument()
  expect(screen.getByText('Spring Break Camp')).toBeInTheDocument()
})

test('renders Register CTA', () => {
  renderCamps()
  expect(screen.getByRole('link', { name: 'Register Now' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- --run src/pages/Camps.test.jsx
```
Expected: FAIL — Camps renders stub `<div>Camps</div>`

- [ ] **Step 3: Implement the Camps page**

Replace `src/pages/Camps.jsx`:
```jsx
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
]

const CAMPS = [
  {
    name: 'Summer Intensive',
    season: 'Summer',
    ages: 'Ages 6–16',
    description: 'A week-long deep dive into technique, choreography, and performance. Students work with instructors to prepare a showcase piece.',
  },
  {
    name: 'Holiday Camp',
    season: 'Winter Break',
    ages: 'Ages 4–12',
    description: 'Three days of festive dance fun during winter break. Holiday-themed routines, crafts, and a mini performance for parents.',
  },
  {
    name: 'Spring Break Camp',
    season: 'Spring Break',
    ages: 'Ages 5–14',
    description: 'Keep the momentum going over spring break. A mix of styles, games, and creative movement in a fun, relaxed setting.',
  },
]

export default function Camps() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Camps"
        subtitle="Immersive multi-day camps packed with dance, creativity, and fun. Perfect for school breaks and summer schedules."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Upcoming Camps
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Keep dancing all year long
          </h2>

          <div className="flex flex-col gap-4">
            {CAMPS.map(({ name, season, ages, description }, i) => (
              <div
                key={name}
                className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="font-bold text-navy-dark text-base">{name}</div>
                  <div className="text-[#7ab3e8] text-sm font-medium whitespace-nowrap">{season}</div>
                </div>
                <div className="text-[#5a6a8a] text-sm mt-0.5 mb-2">{ages}</div>
                <p className="text-[#3a4a6a] text-sm leading-relaxed">{description}</p>
              </div>
            ))}

            <div className="border border-dashed border-surface-border rounded-lg px-5 py-4 text-center">
              <p className="text-[#8a9aaa] text-sm">More camps added each season</p>
            </div>
          </div>

          <Link
            to="/contact"
            className="mt-8 block w-full bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Register Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- --run src/pages/Camps.test.jsx
```
Expected: PASS — 3 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/pages/Camps.jsx src/pages/Camps.test.jsx
git commit -m "feat: implement Camps page"
```

---

## Task 10: Birthdays page

**Files:**
- Modify: `src/pages/Birthdays.jsx`
- Create: `src/pages/Birthdays.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/Birthdays.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Birthdays from './Birthdays'

function renderBirthdays() {
  return render(<MemoryRouter initialEntries={['/birthdays']}><Birthdays /></MemoryRouter>)
}

test('renders page title', () => {
  renderBirthdays()
  expect(screen.getByRole('heading', { name: 'Birthdays' })).toBeInTheDocument()
})

test('renders party package cards', () => {
  renderBirthdays()
  expect(screen.getByText('Mini Dancer Party')).toBeInTheDocument()
  expect(screen.getByText('Studio Star Party')).toBeInTheDocument()
  expect(screen.getByText('VIP Dance Bash')).toBeInTheDocument()
})

test('renders Book a Party CTA', () => {
  renderBirthdays()
  expect(screen.getByRole('link', { name: 'Book a Party' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- --run src/pages/Birthdays.test.jsx
```
Expected: FAIL — Birthdays renders stub `<div>Birthdays</div>`

- [ ] **Step 3: Implement the Birthdays page**

Replace `src/pages/Birthdays.jsx`:
```jsx
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'

const PACKAGES = [
  {
    name: 'Mini Dancer Party',
    price: 'Starting at $TBD',
    ages: 'Ages 3–6',
    accent: 'border-[#f4a8b4]',
    includes: [
      '60-minute guided dance class for up to 10 guests',
      'Party host and music',
      'Studio decorated for the occasion',
    ],
  },
  {
    name: 'Studio Star Party',
    price: 'Starting at $TBD',
    ages: 'Ages 5–12',
    accent: 'border-[#f4a060]',
    includes: [
      '90-minute dance class for up to 15 guests',
      'Custom choreography routine',
      'Party host, music, and decorations',
      'Performance for parents at the end',
    ],
  },
  {
    name: 'VIP Dance Bash',
    price: 'Starting at $TBD',
    ages: 'All ages',
    accent: 'border-brand-red',
    includes: [
      '2-hour full studio rental for up to 20 guests',
      'Two instructors',
      'Custom routine + freestyle time',
      'Full decoration setup',
      'Parent showcase performance',
    ],
  },
]

export default function Birthdays() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Birthdays"
        subtitle="Celebrate in style at the studio! Custom dance party packages for kids of all ages. Unforgettable memories guaranteed."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Party Packages
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Celebrate at the studio
          </h2>

          <div className="flex flex-col gap-6">
            {PACKAGES.map(({ name, price, ages, accent, includes }) => (
              <div
                key={name}
                className={`border border-surface-border border-l-4 ${accent} rounded-lg px-5 py-5`}
              >
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div className="font-black text-navy-dark text-lg">{name}</div>
                  <div className="text-[#f4a8b4] text-sm font-semibold whitespace-nowrap">{price}</div>
                </div>
                <div className="text-[#5a6a8a] text-sm mb-3">{ages}</div>
                <ul className="flex flex-col gap-1">
                  {includes.map((item) => (
                    <li key={item} className="text-[#3a4a6a] text-sm flex gap-2">
                      <span className="text-[#f4a8b4] mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Link
            to="/contact"
            className="mt-8 block w-full bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Book a Party
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- --run src/pages/Birthdays.test.jsx
```
Expected: PASS — 3 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/pages/Birthdays.jsx src/pages/Birthdays.test.jsx
git commit -m "feat: implement Birthdays page with party packages"
```

---

## Task 11: Contact page

**Files:**
- Modify: `src/pages/Contact.jsx`
- Create: `src/pages/Contact.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/Contact.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Contact from './Contact'

function renderContact() {
  return render(<MemoryRouter initialEntries={['/contact']}><Contact /></MemoryRouter>)
}

test('renders page title', () => {
  renderContact()
  expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument()
})

test('renders first and last name fields', () => {
  renderContact()
  expect(screen.getByPlaceholderText('First name')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument()
})

test('renders email field', () => {
  renderContact()
  expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
})

test('renders phone field', () => {
  renderContact()
  expect(screen.getByPlaceholderText('(000) 000-0000')).toBeInTheDocument()
})

test('renders interest dropdown', () => {
  renderContact()
  expect(screen.getByRole('combobox')).toBeInTheDocument()
})

test('renders message textarea', () => {
  renderContact()
  expect(screen.getByPlaceholderText('How can we help?')).toBeInTheDocument()
})

test('renders submit button', () => {
  renderContact()
  expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- --run src/pages/Contact.test.jsx
```
Expected: FAIL — Contact renders stub `<div>Contact</div>`

- [ ] **Step 3: Implement the Contact page**

Replace `src/pages/Contact.jsx`:
```jsx
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader
        eyebrow="We'd love to hear from you"
        title="Contact Us"
        subtitle="Questions about enrollment, schedules, or parties? Reach out and we'll get back to you soon."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-xl mx-auto">
          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            {/* Name row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-navy-dark text-sm font-semibold" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8]"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-navy-dark text-sm font-semibold" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-navy-dark text-sm font-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8]"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-navy-dark text-sm font-semibold" htmlFor="phone">
                Phone{' '}
                <span className="text-[#8a9aaa] font-normal">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="(000) 000-0000"
                className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8]"
              />
            </div>

            {/* Interest */}
            <div className="flex flex-col gap-1.5">
              <label className="text-navy-dark text-sm font-semibold" htmlFor="interest">
                I'm interested in...
              </label>
              <select
                id="interest"
                className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8] text-[#3a4a6a]"
              >
                <option value="">Select an option</option>
                <option value="classes">Classes</option>
                <option value="camps">Camps</option>
                <option value="birthdays">Birthdays / Parties</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-navy-dark text-sm font-semibold" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="How can we help?"
                className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8] resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-brand-red text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- --run src/pages/Contact.test.jsx
```
Expected: PASS — 7 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/pages/Contact.jsx src/pages/Contact.test.jsx
git commit -m "feat: implement Contact page with UI-only form"
```

---

## Task 12: Full test run and build verification

- [ ] **Step 1: Run the full test suite**

```bash
npm run test -- --run
```
Expected: All tests pass across Footer, PageHeader, Navbar, Home, Classes, Camps, Birthdays, Contact (25+ tests total). Zero failures.

- [ ] **Step 2: Run the production build**

```bash
npm run build
```
Expected: Build succeeds, `dist/` directory created. No errors.

- [ ] **Step 3: Preview the production build**

```bash
npm run preview
```
Open `http://localhost:4173` and manually verify:
- Homepage hero renders with gradient
- All 4 section cards are visible and clickable
- Navigating to `/classes`, `/camps`, `/birthdays`, `/contact` each render correctly
- Navbar active link highlights on each page
- Mobile menu opens/closes (resize browser to < 768px)

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete base Capital Core Dance Studio website

All pages implemented: Home, Classes, Camps, Birthdays, Contact
Shared components: Navbar (with mobile menu), PageHeader, Footer
Full test suite passing
Production build verified"
```
