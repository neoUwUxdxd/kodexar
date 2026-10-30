import { useEffect, useState } from 'react'
import { ArrowRight, Bot, Code2, Gamepad2, Globe, Play } from 'lucide-react'
import { BRAND, DIVISIONS, LANGUAGES, PRICING, STATS } from '../config.js'
import { Panel, Reveal } from './ui.jsx'

const TABS = [
  { n: '01', div: DIVISIONS.web, icon: Globe, title: 'Desarrollo Web', desc: 'Sitios de alta conversión, e-commerce y SaaS.' },
  { n: '02', div: DIVISIONS.bots, icon: Bot, title: 'Discord Bots', desc: 'Bots a medida con cualquier función.' },
  { n: '03', div: DIVISIONS.mods, icon: Gamepad2, title: 'Mods Multi-Juego', desc: 'Para cualquier juego y motor.' },
  { n: '04', div: DIVISIONS.core, icon: Code2, title: 'Ingeniería Políglota', desc: 'Todos los lenguajes, cero límites.' },
]

function useTick(ms) {
  const [t, setT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), ms)
    return () => clearInterval(id)
  }, [ms])
  return t
}

function Ring({ value, label }) {
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-16">
        <svg viewBox="0 0 56 56" className="size-16 -rotate-90">
          <circle cx="28" cy="28" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
          <circle
            cx="28" cy="28" r={r} stroke="var(--accent)" strokeWidth="5" fill="none" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: 'stroke-dashoffset 1.2s ease' }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-mono text-sm font-bold text-white">{value}</span>
      </div>
      <span className="text-[11px] text-mute">{label}</span>
    </div>
  )
}

function WebLive() {
  const [score, setScore] = useState(0)
  const t = useTick(1800)
  useEffect(() => {
    const id = setTimeout(() => setScore(100), 80)
    return () => clearTimeout(id)
  }, [])
  const conv = [24, 31, 38, 42][t % 4]
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-2 rounded-lg border border-line bg-obsidian px-3 py-2 font-mono text-xs text-mute">
        <span className="size-2 rounded-full bg-web" /> https://tu-negocio.mx <span className="ml-auto text-web">200 OK · 0.4s</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {['Rendimiento', 'Accesib.', 'Prácticas', 'SEO'].map((l) => <Ring key={l} value={score} label={l} />)}
      </div>
      <div className="mt-auto grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-obsidian p-4">
          <p className="text-xs text-mute">Conversión</p>
          <p className="font-mono text-2xl font-bold text-white">+{conv}%</p>
        </div>
        <div className="rounded-xl border border-line bg-obsidian p-4">
          <p className="text-xs text-mute">Core Web Vitals</p>
          <p className="font-mono text-2xl font-bold text-[var(--accent)]">PASS</p>
        </div>
      </div>
    </div>
  )
}

const BOT_LOG = [
  ['gateway', 'Conectado a 128 servidores · 42ms'],
  ['slash', '/tickets-ventas por @cliente_mx'],
  ['ticket', 'Canal #venta-0142 creado'],
  ['economia', '@nova ganó 2,400 🪙 en /casino'],
  ['ia', 'Mensaje tóxico bloqueado (97%)'],
  ['puente', 'FiveM → Discord: 64/64 jugadores'],
]

function BotLive() {
  const t = useTick(900)
  const start = Math.max(0, t - 5)
  const lines = Array.from({ length: Math.min(t + 1, 6) }, (_, i) => [start + i, ...BOT_LOG[(start + i) % BOT_LOG.length]])
  return (
    <div className="flex h-full flex-col rounded-xl border border-line bg-obsidian p-4 font-mono text-xs">
      <p className="mb-3 text-mute">$ node kodexar-bot.js <span className="text-[var(--accent)]">--prod</span></p>
      <ul className="space-y-2">
        {lines.map(([n, tag, msg]) => (
          <li key={n} className="flex gap-2 animate-fade-up">
            <span className="text-[var(--accent)]">[{tag}]</span>
            <span className="text-zinc-300">{msg}</span>
          </li>
        ))}
      </ul>
      <span className="mt-2 inline-block h-4 w-2 animate-blink bg-[var(--accent)]" />
    </div>
  )
}

function ModLive() {
  const t = useTick(400)
  const fps = 238 + ((t * 37) % 19)
  const bars = Array.from({ length: 28 }, (_, i) => 30 + (((i + t) * 53) % 40))
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {[
          ['FPS', fps],
          ['CPU', '0.01ms'],
          ['Δ FPS', '+144'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-line bg-obsidian p-3">
            <p className="text-[11px] text-mute">{k}</p>
            <p className="font-mono text-xl font-bold text-white">{v}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-1 rounded-xl border border-line bg-obsidian p-3">
        {bars.map((h, i) => (
          <span key={i} className="flex-1 rounded-sm bg-[var(--accent)]/80 transition-all duration-300" style={{ height: `${h}%` }} />
        ))}
      </div>
      <p className="font-mono text-[11px] text-mute">frametime estable · inyección sin overhead</p>
    </div>
  )
}

function CoreLive() {
  const t = useTick(2200)
  const lang = LANGUAGES[t % LANGUAGES.length]
  return (
    <div className="flex h-full flex-col rounded-xl border border-line bg-obsidian">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 font-mono text-xs">
        <span className="size-2 rounded-full" style={{ background: lang.color }} />
        <span className="text-white">{lang.name}</span>
        <span className="ml-auto text-mute">{t % LANGUAGES.length + 1}/{LANGUAGES.length}</span>
      </div>
      <pre key={lang.id} className="flex-1 animate-fade-up overflow-hidden whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed text-zinc-200">
        {lang.snippet}
      </pre>
      <div className="flex flex-wrap gap-1.5 border-t border-line p-3">
        {lang.uses.map((u) => (
          <span key={u} className="rounded-md bg-[var(--accent)]/15 px-2 py-0.5 font-mono text-[11px] text-violet-200">{u}</span>
        ))}
      </div>
    </div>
  )
}

const LIVE = { web: WebLive, bots: BotLive, mods: ModLive, core: CoreLive }

export default function Hero() {
  const [active, setActive] = useState(0)
  const tab = TABS[active]
  const Live = LIVE[tab.div.id]

  return (
    <section id="top" style={{ '--accent': tab.div.accent }} className="relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 sm:pt-40">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-3xl transition-colors duration-700"
        style={{ background: 'radial-gradient(closest-side, var(--accent), transparent)' }}
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-carbon/70 px-3 py-1.5 font-mono text-xs text-mute">
          <span className="text-[var(--accent)] transition-colors">●</span> {tab.div.label} <span className="text-white/20">|</span> {BRAND.role}
        </p>
        <h1 className="max-w-4xl font-display text-5xl leading-[1.02] font-bold tracking-tight text-white sm:text-7xl">
          Si se puede imaginar,{' '}
          <span className="bg-gradient-to-r from-white to-[var(--accent)] bg-clip-text text-transparent">Kodexar lo programa.</span>
        </h1>
        </Reveal>
        <Reveal delay={150}>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mute">
          Soy <strong className="text-white">{BRAND.owner}</strong>, ingeniero de software políglota y fundador de{' '}
          <strong className="text-white">{BRAND.name}</strong>. Desarrollo sin límites en cualquier lenguaje: páginas web de alta
          conversión, bots de Discord a medida y mods para cualquier videojuego. No te lo cuento: pruébalo aquí abajo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#cotizar" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-obsidian transition hover:bg-zinc-200">
            Cotizar mi proyecto <ArrowRight className="size-4" />
          </a>
          <a href="#web" className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-carbon px-5 py-3 font-semibold text-white transition hover:border-[var(--accent)]">
            <Play className="size-4" /> Probar demos en vivo
          </a>
        </div>
        <p className="mt-4 font-mono text-xs text-mute">🇲🇽 {PRICING.paymentNote}</p>
        </Reveal>

        <Reveal delay={300}>
        <Panel className="mt-14 grid overflow-hidden lg:grid-cols-[320px_1fr]">
          <div role="tablist" aria-label="Divisiones" className="grid grid-cols-2 border-b border-line lg:grid-cols-1 lg:border-r lg:border-b-0">
            {TABS.map((t, i) => {
              const Icon = t.icon
              const on = i === active
              return (
                <button
                  key={t.n}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  style={{ '--accent': t.div.accent }}
                  className={`group relative flex items-start gap-3 border-line p-4 text-left transition sm:p-5 [&:not(:last-child)]:border-b ${
                    on ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {on && <span className="absolute inset-y-0 left-0 w-0.5 bg-[var(--accent)] shadow-[0_0_16px_var(--accent)]" />}
                  <Icon className={`mt-0.5 size-5 shrink-0 ${on ? 'text-[var(--accent)]' : 'text-mute'}`} />
                  <span>
                    <span className="block font-mono text-[11px] text-mute">[{t.n}. {t.title}]</span>
                    <span className={`block font-display font-semibold ${on ? 'text-white' : 'text-zinc-400'}`}>{t.div.label.split(' // ')[1]}</span>
                    <span className="mt-1 hidden text-xs text-mute sm:block">{t.desc}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <div className="min-h-[300px] p-4 sm:p-6">
            <Live key={tab.div.id} />
          </div>
        </Panel>
        </Reveal>

        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={420 + i * 90} className="bg-obsidian p-5">
              <dt className="text-xs text-mute">{s.label}</dt>
              <dd className="mt-1 font-mono text-2xl font-bold text-white">{s.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
