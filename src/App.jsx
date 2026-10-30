import { Mail } from 'lucide-react'
import { BRAND, PRICING } from './config.js'
import { CurrencyProvider } from './currency.jsx'
import Navbar, { Logo } from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import WebShowcase from './components/WebShowcase.jsx'
import DiscordSim from './components/DiscordSim.jsx'
import ModsLab from './components/ModsLab.jsx'
import PolyglotMatrix from './components/PolyglotMatrix.jsx'
import Checkout from './components/Checkout.jsx'
import { Reveal } from './components/ui.jsx'

function Footer() {
  return (
    <footer className="border-t border-line px-4 py-12 sm:px-6">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-mute">{BRAND.tagline}. Web, bots, mods y software en cualquier lenguaje.</p>
        </div>
        <div className="space-y-2 text-sm md:text-right">
          <a href={`mailto:${BRAND.email}`} className="inline-flex items-center gap-2 font-mono text-white hover:text-[var(--accent)]">
            <Mail className="size-4" /> {BRAND.email}
          </a>
          <p className="font-mono text-xs text-mute">🇲🇽 {PRICING.paymentNote}</p>
          <p className="font-mono text-xs text-mute">© {new Date().getFullYear()} {BRAND.name} · {BRAND.owner}</p>
        </div>
      </Reveal>
    </footer>
  )
}

export default function App() {
  return (
    <CurrencyProvider>
      <Navbar />
      <main>
        <Hero />
        <WebShowcase />
        <DiscordSim />
        <ModsLab />
        <PolyglotMatrix />
        <Checkout />
      </main>
      <Footer />
    </CurrencyProvider>
  )
}
