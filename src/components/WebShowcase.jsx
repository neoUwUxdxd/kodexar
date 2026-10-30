import { useState } from 'react'
import { Lock, Monitor, RotateCw, Smartphone } from 'lucide-react'
import { DIVISIONS } from '../config.js'
import { Panel, Reveal, Section, SectionHeader, Segmented } from './ui.jsx'
import { CloudDemo, LumiereDemo, VortexDemo } from './WebDemos.jsx'

const CASES = [
  { id: 'lumiere', name: 'Lumière Studio', kind: 'Estética & Spa de Lujo', url: 'lumiere-studio.mx', feat: 'Sistema de citas en tiempo real', Demo: LumiereDemo },
  { id: 'vortex', name: 'Vortex Store', kind: 'E-Commerce automatizado', url: 'store.vortex.mx', feat: 'Entrega automática al servidor', Demo: VortexDemo },
  { id: 'cloud', name: 'Kodexar Cloud', kind: 'Dashboard SaaS', url: 'app.kodexar.cloud', feat: 'Métricas en vivo y reportes', Demo: CloudDemo },
]

export default function WebShowcase() {
  const [device, setDevice] = useState('pc')
  const [active, setActive] = useState('lumiere')
  const [reload, setReload] = useState(0)
  const c = CASES.find((x) => x.id === active)
  const Demo = c.Demo

  return (
    <Section id="web" accent={DIVISIONS.web.accent}>
      <SectionHeader
        label="KODEXAR // WEB"
        title="Páginas web que venden. Pruébalas aquí."
        desc="Tres proyectos funcionales, no capturas. Agenda una cita, compra en la tienda o explora el dashboard, y cambia a vista móvil para ver la adaptación."
      >
        <Segmented
          label="Dispositivo"
          value={device}
          onChange={setDevice}
          options={[
            { value: 'pc', label: 'PC', icon: <Monitor className="size-4" /> },
            { value: 'mobile', label: 'Móvil', icon: <Smartphone className="size-4" /> },
          ]}
        />
      </SectionHeader>

      <Reveal delay={120} className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div role="tablist" aria-label="Casos de estudio" className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {CASES.map((x, i) => {
            const on = x.id === active
            return (
              <Panel
                as="button"
                key={x.id}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(x.id)}
                className={`min-w-[220px] p-4 text-left transition lg:min-w-0 ${on ? 'border-[var(--accent)]/50 bg-[var(--accent)]/[0.06]' : 'hover:bg-white/[0.02]'}`}
              >
                <span className="font-mono text-[11px] text-mute">CASO 0{i + 1}</span>
                <span className="mt-1 block font-display text-lg font-semibold text-white">{x.name}</span>
                <span className="block text-sm text-mute">{x.kind}</span>
                <span className={`mt-3 inline-block rounded-md px-2 py-0.5 font-mono text-[11px] ${on ? 'bg-[var(--accent)]/15 text-emerald-300' : 'bg-white/5 text-mute'}`}>
                  {x.feat}
                </span>
              </Panel>
            )
          })}
        </div>

        <Panel glow={false} className="grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)] p-3 sm:p-6">
          {device === 'pc' ? (
            <div className="w-full overflow-hidden rounded-xl border border-line-strong bg-carbon shadow-2xl shadow-black/60">
              <div className="flex items-center gap-3 border-b border-line bg-carbon-2 px-3 py-2.5">
                <span className="flex gap-1.5">
                  <span className="size-3 rounded-full bg-[#FF5F57]" />
                  <span className="size-3 rounded-full bg-[#FEBC2E]" />
                  <span className="size-3 rounded-full bg-[#28C840]" />
                </span>
                <span className="flex flex-1 items-center justify-center gap-1.5 truncate rounded-md bg-obsidian px-3 py-1 font-mono text-xs text-mute">
                  <Lock className="size-3 text-web" /> {c.url}
                </span>
                <button onClick={() => setReload((r) => r + 1)} className="text-mute hover:text-white" aria-label="Recargar demo">
                  <RotateCw className="size-4" />
                </button>
              </div>
              <div className="@container h-[560px] overflow-y-auto scroll-thin">
                <Demo key={`${active}-${reload}`} />
              </div>
            </div>
          ) : (
            <div className="relative w-[340px] max-w-full rounded-[2.75rem] border border-line-strong bg-black p-3 shadow-2xl shadow-black/70">
              <span className="absolute top-5 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
              <div className="@container h-[640px] overflow-y-auto rounded-[2.1rem] scroll-thin">
                <div className="h-10 bg-transparent" />
                <Demo key={`${active}-${reload}-m`} />
              </div>
            </div>
          )}
        </Panel>
      </Reveal>
    </Section>
  )
}
