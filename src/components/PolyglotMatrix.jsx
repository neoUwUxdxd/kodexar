import { useState } from 'react'
import { Loader2, Play, Terminal } from 'lucide-react'
import { DIVISIONS, LANGUAGES } from '../config.js'
import { Panel, Reveal, Section, SectionHeader } from './ui.jsx'

export default function PolyglotMatrix() {
  const [active, setActive] = useState(LANGUAGES[0].id)
  const [run, setRun] = useState({ id: null, state: 'idle', ms: 0 })
  const lang = LANGUAGES.find((l) => l.id === active)
  const output = run.id === active ? run : { state: 'idle' }

  const execute = () => {
    const ms = 3 + Math.floor(Math.random() * 40)
    setRun({ id: active, state: 'running', ms })
    setTimeout(() => setRun((r) => (r.id === active ? { ...r, state: 'done' } : r)), 650)
  }

  return (
    <Section id="lenguajes" accent={DIVISIONS.core.accent}>
      <SectionHeader
        label="KODEXAR // CORE — Todos los Lenguajes"
        title="Todos los lenguajes, cero límites."
        desc="Elijo la herramienta correcta para tu problema, no el problema para mi herramienta. Selecciona un lenguaje para ver código real y dónde lo aplico."
      />

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {LANGUAGES.map((l, i) => {
            const on = l.id === active
            return (
              <Reveal key={l.id} delay={i * 60}>
              <Panel
                as="button"
                onClick={() => setActive(l.id)}
                aria-pressed={on}
                className={`flex size-full flex-col items-start gap-3 p-4 text-left transition ${on ? 'border-[var(--accent)]/60 bg-[var(--accent)]/[0.07]' : 'hover:bg-white/[0.02]'}`}
              >
                <span className="grid size-9 place-items-center rounded-lg font-mono text-xs font-bold text-white" style={{ background: `${l.color}33`, boxShadow: `inset 0 0 0 1px ${l.color}66` }}>
                  {l.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-white">{l.name}</span>
                <span className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <span className="block h-full rounded-full bg-[var(--accent)] transition-all duration-700" style={{ width: on ? `${l.level}%` : '0%' }} />
                </span>
              </Panel>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={200}>
        <Panel className="flex h-full flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <span className="size-2.5 rounded-full" style={{ background: lang.color }} />
            <span className="font-display font-semibold text-white">{lang.name}</span>
            <span className="ml-auto font-mono text-xs text-violet-300">dominio {lang.level}%</span>
          </div>
          <pre key={lang.id} className="min-h-[120px] animate-fade-up overflow-x-auto p-5 font-mono text-sm leading-relaxed text-zinc-200 scroll-thin">{lang.snippet}</pre>
          <div className="flex flex-wrap gap-1.5 px-5 pb-4">
            {lang.uses.map((u) => (
              <span key={u} className="rounded-md bg-[var(--accent)]/15 px-2 py-1 font-mono text-[11px] text-violet-200">{u}</span>
            ))}
          </div>
          <div className="mt-auto border-t border-line bg-obsidian/60 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-xs text-mute"><Terminal className="size-3.5" /> salida</span>
              <button onClick={execute} disabled={output.state === 'running'} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
                {output.state === 'running' ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />} Ejecutar
              </button>
            </div>
            <p className="mt-3 font-mono text-xs text-zinc-400">
              {output.state === 'idle' && '> listo para compilar'}
              {output.state === 'running' && '> compilando…'}
              {output.state === 'done' && <span className="text-emerald-400">✓ build OK en {run.ms}ms · idea → producción</span>}
            </p>
          </div>
        </Panel>
        </Reveal>
      </div>
    </Section>
  )
}
