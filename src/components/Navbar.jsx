import { useEffect, useState } from 'react'
import { BRAND } from '../config.js'
import { useCurrency } from '../currency.jsx'

const LINKS = [
  { href: '#web', label: 'Web' },
  { href: '#bots', label: 'Bots' },
  { href: '#mods', label: 'Mods' },
  { href: '#lenguajes', label: 'Lenguajes' },
]

export function Logo({ compact = false }) {
  return (
    <a href="#top" className="group flex items-center gap-2.5" aria-label="KODEXAR inicio">
      <span className="relative grid size-8 place-items-center rounded-lg border border-line-strong bg-carbon">
        <svg viewBox="0 0 64 64" className="size-5" aria-hidden="true">
          <path d="M20 16v32M20 32l16-16M26 27l12 21" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="46" cy="44" r="5" fill="var(--accent, #8B5CF6)" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-display text-[15px] font-bold tracking-[0.18em] text-white">{BRAND.name}</span>
        {!compact && <span className="block font-mono text-[10px] text-mute">by {BRAND.owner}</span>}
      </span>
    </a>
  )
}

export default function Navbar() {
  const { currency, setCurrency } = useCurrency()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border px-3 py-2 backdrop-blur-xl transition sm:px-4 ${
          scrolled ? 'border-line-strong bg-obsidian/80 shadow-2xl shadow-black/50' : 'border-line bg-obsidian/40'
        }`}
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-lg px-3 py-1.5 text-sm text-mute transition hover:bg-white/5 hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-web/25 bg-web/10 px-3 py-1 text-xs text-emerald-300 md:inline-flex">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-web opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-web" />
            </span>
            🟢 {BRAND.owner} disponible para proyectos
          </span>

          <div role="group" aria-label="Moneda" className="flex rounded-xl border border-line bg-carbon p-0.5 font-mono text-xs">
            {[
              { id: 'MXN', flag: '🇲🇽' },
              { id: 'USD', flag: '🇺🇸' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCurrency(c.id)}
                aria-pressed={currency === c.id}
                className={`rounded-lg px-2.5 py-1.5 transition ${
                  currency === c.id ? 'bg-white text-obsidian' : 'text-mute hover:text-white'
                }`}
              >
                {c.flag} {c.id}
              </button>
            ))}
          </div>

          <a
            href="#cotizar"
            className="hidden rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-obsidian transition hover:bg-zinc-200 sm:inline-block"
          >
            Cotizar
          </a>
        </div>
      </nav>
    </header>
  )
}
