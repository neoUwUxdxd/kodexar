import { useEffect, useMemo, useState } from 'react'
import {
  Activity, BarChart3, Bell, Calendar, Check, CheckCircle2, Clock, Crown, Gem, Home, KeyRound, Loader2, Minus,
  Package, Plus, Settings, Shirt, ShoppingCart, Sparkles, Users, X, Zap,
} from 'lucide-react'
import { useCurrency } from '../currency.jsx'

/* ───────────────────────── Lumière Studio ───────────────────────── */

const SERVICES = [
  { id: 'facial', name: 'Facial Diamante', mins: 90, price: 1450, tag: 'Más reservado' },
  { id: 'stones', name: 'Masaje Piedras Calientes', mins: 75, price: 1200 },
  { id: 'mani', name: 'Manicure Spa Signature', mins: 50, price: 480 },
  { id: 'bride', name: 'Ritual Novia Lumière', mins: 180, price: 3900, tag: 'Premium' },
]
const SLOTS = ['10:00', '11:30', '13:00', '16:00', '17:30', '19:00']

function nextDays(n) {
  const out = []
  const d = new Date()
  for (let i = 1; out.length < n; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i)
    if (x.getDay() !== 0) out.push(x)
  }
  return out
}

export function LumiereDemo() {
  const { format } = useCurrency()
  const days = useMemo(() => nextDays(5), [])
  const [service, setService] = useState(SERVICES[0].id)
  const [day, setDay] = useState(0)
  const [slot, setSlot] = useState(null)
  const [booked, setBooked] = useState(null)
  const svc = SERVICES.find((s) => s.id === service)
  const taken = (i) => (i * 7 + day * 3) % 5 === 0

  if (booked) {
    return (
      <div className="grid min-h-full place-items-center bg-[#F6EFE8] p-6 text-[#3B2F2A]">
        <div className="w-full max-w-sm animate-fade-up rounded-3xl bg-white p-6 text-center shadow-xl shadow-[#3B2F2A]/10">
          <CheckCircle2 className="mx-auto size-12 text-[#B08463]" />
          <h4 className="mt-3 font-display text-2xl font-semibold">¡Cita confirmada!</h4>
          <p className="mt-1 text-sm text-[#7A6A60]">Te enviamos un recordatorio por WhatsApp.</p>
          <div className="mt-5 space-y-2 rounded-2xl bg-[#F6EFE8] p-4 text-left text-sm">
            <p className="flex justify-between"><span>Servicio</span><b>{booked.svc.name}</b></p>
            <p className="flex justify-between"><span>Fecha</span><b>{booked.date}</b></p>
            <p className="flex justify-between"><span>Hora</span><b>{booked.slot}</b></p>
            <p className="flex justify-between"><span>Folio</span><b className="font-mono">LUM-{booked.code}</b></p>
          </div>
          <button onClick={() => { setBooked(null); setSlot(null) }} className="mt-5 w-full rounded-full bg-[#3B2F2A] py-3 text-sm font-semibold text-white">
            Agendar otra cita
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#F6EFE8] text-[#3B2F2A]">
      <header className="flex items-center justify-between px-5 py-4">
        <span className="font-display text-xl font-semibold tracking-[0.25em]">LUMIÈRE</span>
        <nav className="hidden gap-6 text-sm text-[#7A6A60] @2xl:flex"><span>Servicios</span><span>Estudio</span><span>Gift cards</span></nav>
        <span className="rounded-full bg-[#3B2F2A] px-4 py-1.5 text-xs font-semibold text-white">Reservar</span>
      </header>
      <div className="mx-4 rounded-3xl bg-gradient-to-br from-[#E8D5C4] via-[#F1E1D3] to-[#D9B99B] px-6 py-10 @2xl:px-10 @2xl:py-14">
        <p className="text-xs tracking-[0.3em] text-[#8C6A50]">ESTÉTICA & SPA DE LUJO</p>
        <h4 className="mt-2 max-w-md font-display text-3xl leading-tight font-semibold @2xl:text-5xl">Tu ritual de calma, reservado en 30 segundos.</h4>
        <p className="mt-3 flex items-center gap-2 text-sm text-[#7A6A60]"><Sparkles className="size-4" /> 4.9 ★ · 1,200+ clientas felices</p>
      </div>

      <div className="grid gap-5 p-4 @3xl:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-widest text-[#8C6A50]">1 · ELIGE TU SERVICIO</p>
          <div className="space-y-2">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => setService(s.id)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                  service === s.id ? 'border-[#3B2F2A] bg-white shadow-md' : 'border-[#E4D6CA] bg-white/50 hover:bg-white'
                }`}
              >
                <span>
                  <span className="block font-semibold">{s.name}</span>
                  <span className="flex items-center gap-1 text-xs text-[#7A6A60]"><Clock className="size-3" /> {s.mins} min {s.tag && <em className="ml-1 rounded-full bg-[#F1E1D3] px-2 not-italic">{s.tag}</em>}</span>
                </span>
                <span className="font-mono text-sm font-semibold">{format(s.price)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-[#8C6A50]"><Calendar className="size-3.5" /> 2 · FECHA Y HORA</p>
          <div className="grid grid-cols-5 gap-1.5">
            {days.map((d, i) => (
              <button
                key={d.toISOString()}
                onClick={() => { setDay(i); setSlot(null) }}
                className={`rounded-xl py-2 text-center transition ${day === i ? 'bg-[#3B2F2A] text-white' : 'bg-[#F6EFE8] hover:bg-[#EADBCD]'}`}
              >
                <span className="block text-[10px] uppercase">{d.toLocaleDateString('es-MX', { weekday: 'short' })}</span>
                <span className="block font-mono font-semibold">{d.getDate()}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {SLOTS.map((s, i) => (
              <button
                key={s}
                disabled={taken(i)}
                onClick={() => setSlot(s)}
                className={`rounded-xl py-2 font-mono text-sm transition disabled:cursor-not-allowed disabled:line-through disabled:opacity-35 ${
                  slot === s ? 'bg-[#B08463] text-white' : 'bg-[#F6EFE8] hover:bg-[#EADBCD]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            disabled={!slot}
            onClick={() =>
              setBooked({
                svc,
                slot,
                date: days[day].toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }),
                code: Math.floor(1000 + Math.random() * 9000),
              })
            }
            className="mt-4 w-full rounded-full bg-[#3B2F2A] py-3 text-sm font-semibold text-white transition disabled:opacity-40"
          >
            {slot ? `Confirmar ${svc.name} · ${slot}` : 'Selecciona un horario'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Vortex Store ───────────────────────── */

const PRODUCTS = [
  { id: 'vip', cat: 'Rangos', name: 'Rango VIP', price: 199, icon: Crown, hue: '#22D3EE', perks: 'Kit semanal · /fly · prefijo' },
  { id: 'mvp', cat: 'Rangos', name: 'Rango MVP+', price: 449, icon: Gem, hue: '#A855F7', perks: 'Todo VIP + mascotas + /nick' },
  { id: 'coins', cat: 'Monedas', name: '5,000 Vortex Coins', price: 149, icon: Zap, hue: '#FACC15', perks: '+10% bonus primera compra' },
  { id: 'key', cat: 'Monedas', name: 'Llave Legendaria x3', price: 99, icon: KeyRound, hue: '#F97316', perks: 'Cofres con items míticos' },
  { id: 'hoodie', cat: 'Merch', name: 'Hoodie Vortex Black', price: 790, icon: Shirt, hue: '#F43F5E', perks: 'Edición limitada · envío MX' },
  { id: 'starter', cat: 'Merch', name: 'Pack Creador', price: 349, icon: Package, hue: '#34D399', perks: 'Stickers + skin exclusiva' },
]

export function VortexDemo() {
  const { format } = useCurrency()
  const [cat, setCat] = useState('Todo')
  const [cart, setCart] = useState({})
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState('idle')
  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const total = Object.entries(cart).reduce((s, [id, q]) => s + PRODUCTS.find((p) => p.id === id).price * q, 0)
  const list = PRODUCTS.filter((p) => cat === 'Todo' || p.cat === cat)

  const add = (id, d = 1) =>
    setCart((c) => {
      const q = (c[id] || 0) + d
      const next = { ...c, [id]: q }
      if (q <= 0) delete next[id]
      return next
    })

  const pay = () => {
    setPhase('paying')
    setTimeout(() => setPhase('done'), 1400)
  }

  return (
    <div className="relative min-h-full bg-[#0B0D12] text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0B0D12]/90 px-5 py-3 backdrop-blur">
        <span className="font-display text-lg font-bold tracking-wider">
          VORTEX<span className="text-cyan-400">.</span>STORE
        </span>
        <span className="hidden font-mono text-xs text-emerald-400 @xl:inline">● play.vortex.mx · 1,284 online</span>
        <button onClick={() => setOpen(true)} className="relative rounded-xl bg-white/10 p-2" aria-label="Abrir carrito">
          <ShoppingCart className="size-5" />
          {count > 0 && <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-cyan-400 font-mono text-[10px] font-bold text-black">{count}</span>}
        </button>
      </header>

      <div className="p-5">
        <h4 className="font-display text-2xl font-bold @2xl:text-4xl">Tienda automatizada 24/7</h4>
        <p className="mt-1 text-sm text-white/50">Compra y recibe tus items en el servidor al instante. Sin esperar a un admin.</p>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {['Todo', 'Rangos', 'Monedas', 'Merch'].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition ${cat === c ? 'bg-cyan-400 font-semibold text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 @md:grid-cols-2 @3xl:grid-cols-3">
          {list.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.id} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/25">
                <div className="grid h-24 place-items-center rounded-xl" style={{ background: `radial-gradient(circle at 50% 120%, ${p.hue}55, transparent 70%)` }}>
                  <Icon className="size-10 transition group-hover:scale-110" style={{ color: p.hue }} />
                </div>
                <p className="mt-3 font-semibold">{p.name}</p>
                <p className="text-xs text-white/50">{p.perks}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono font-bold">{format(p.price)}</span>
                  <button onClick={() => add(p.id)} className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-black transition hover:bg-cyan-300">
                    <Plus className="size-3.5" /> Agregar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {open && (
        <div className="absolute inset-0 z-20 flex justify-end bg-black/60" onClick={() => setOpen(false)}>
          <aside onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-sm animate-fade-up flex-col border-l border-white/10 bg-[#11141B] p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-bold">Tu carrito</p>
              <button onClick={() => setOpen(false)} aria-label="Cerrar carrito"><X className="size-5" /></button>
            </div>
            {phase === 'done' ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <CheckCircle2 className="size-14 text-emerald-400" />
                <p className="mt-3 font-display text-xl font-bold">¡Entregado en el servidor!</p>
                <p className="mt-2 rounded-lg bg-black/40 px-3 py-2 font-mono text-xs text-emerald-300">[Vortex] /give Steve {Object.keys(cart).join(' ')} ✓</p>
                <button onClick={() => { setCart({}); setPhase('idle'); setOpen(false) }} className="mt-5 rounded-xl bg-white px-5 py-2 text-sm font-bold text-black">Seguir comprando</button>
              </div>
            ) : count === 0 ? (
              <p className="flex flex-1 items-center justify-center text-sm text-white/40">Tu carrito está vacío.</p>
            ) : (
              <>
                <ul className="mt-4 flex-1 space-y-3 overflow-auto">
                  {Object.entries(cart).map(([id, q]) => {
                    const p = PRODUCTS.find((x) => x.id === id)
                    return (
                      <li key={id} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                        <span className="text-sm">
                          <span className="block font-semibold">{p.name}</span>
                          <span className="font-mono text-xs text-white/50">{format(p.price * q)}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <button onClick={() => add(id, -1)} className="rounded-md bg-white/10 p-1" aria-label="Quitar uno"><Minus className="size-3" /></button>
                          <span className="w-4 text-center font-mono text-sm">{q}</span>
                          <button onClick={() => add(id, 1)} className="rounded-md bg-white/10 p-1" aria-label="Agregar uno"><Plus className="size-3" /></button>
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <div className="border-t border-white/10 pt-4">
                  <p className="flex justify-between font-mono"><span className="text-white/60">Total</span><b>{format(total)}</b></p>
                  <button onClick={pay} disabled={phase === 'paying'} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 font-bold text-black">
                    {phase === 'paying' ? <><Loader2 className="size-4 animate-spin" /> Procesando…</> : 'Pagar y entregar al instante'}
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}

/* ───────────────────────── Kodexar Cloud ───────────────────────── */

const SERIES = {
  '7D': [42, 58, 51, 66, 72, 69, 88],
  '30D': [30, 34, 41, 38, 45, 52, 49, 55, 61, 58, 64, 70, 68, 75, 82],
  '12M': [22, 28, 33, 39, 44, 52, 57, 63, 70, 78, 86, 94],
}
const EVENTS = [
  ['Nuevo cliente', 'Grupo Andrade · Plan Pro'],
  ['Pago recibido', 'SPEI · $12,400 MXN'],
  ['Deploy', 'api-v3 → producción'],
  ['Nuevo usuario', 'mariana@clinica.mx'],
  ['Alerta resuelta', 'Latencia p95 < 80ms'],
]

export function CloudDemo() {
  const { format } = useCurrency()
  const [range, setRange] = useState('7D')
  const [rps, setRps] = useState(1240)
  const [feed, setFeed] = useState(EVENTS.slice(0, 3).map((e, i) => ({ id: i, e })))

  useEffect(() => {
    let n = 3
    const id = setInterval(() => {
      setRps((r) => Math.max(900, Math.min(1800, r + Math.round((Math.random() - 0.45) * 120))))
      if (Math.random() > 0.55) {
        const e = EVENTS[n % EVENTS.length]
        const item = { id: n++, e }
        setFeed((f) => [item, ...f].slice(0, 4))
      }
    }, 1200)
    return () => clearInterval(id)
  }, [])

  const data = SERIES[range]
  const max = Math.max(...data)
  const nav = [Home, BarChart3, Users, Bell, Settings]

  return (
    <div className="flex min-h-full bg-[#F7F8FA] text-slate-900">
      <aside className="hidden w-16 shrink-0 flex-col items-center gap-3 bg-slate-950 py-4 @3xl:flex">
        <span className="mb-2 grid size-9 place-items-center rounded-xl bg-violet-500 font-display font-bold text-white">K</span>
        {nav.map((Icon, i) => (
          <span key={i} className={`grid size-9 place-items-center rounded-xl ${i === 1 ? 'bg-white/15 text-white' : 'text-slate-500'}`}><Icon className="size-4" /></span>
        ))}
      </aside>
      <div className="min-w-0 flex-1 p-4 @2xl:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Kodexar Cloud · Workspace</p>
            <h4 className="font-display text-xl font-bold @2xl:text-2xl">Panel de ingresos</h4>
          </div>
          <div className="flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200">
            {Object.keys(SERIES).map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`rounded-md px-3 py-1 font-mono text-xs ${range === r ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>{r}</button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 @3xl:grid-cols-4">
          {[
            ['MRR', format(184000 + data[data.length - 1] * 900), '+12.4%'],
            ['Usuarios activos', '8,942', '+6.1%'],
            ['Requests / s', rps.toLocaleString('es-MX'), 'en vivo'],
            ['Uptime', '99.99%', '30 días'],
          ].map(([k, v, d]) => (
            <div key={k} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs text-slate-500">{k}</p>
              <p className="mt-1 truncate font-mono text-lg font-bold @2xl:text-xl">{v}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600"><Activity className="size-3" /> {d}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 @3xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold">Ingresos · {range}</p>
            <div className="mt-4 flex h-40 items-end gap-1.5">
              {data.map((v, i) => (
                <div key={`${range}-${i}`} className="group relative flex-1">
                  <div className="rounded-t-md bg-gradient-to-t from-violet-600 to-violet-400 transition-all duration-500 group-hover:from-emerald-500 group-hover:to-emerald-300" style={{ height: `${(v / max) * 152}px` }} />
                  <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-white group-hover:block">{v}k</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="flex items-center gap-2 text-sm font-semibold"><span className="size-2 animate-pulse rounded-full bg-emerald-500" /> Actividad en vivo</p>
            <ul className="mt-3 space-y-2">
              {feed.map(({ id, e: [t, d] }) => (
                <li key={id} className="flex animate-fade-up items-start gap-2 rounded-lg bg-slate-50 p-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-violet-500" />
                  <span className="min-w-0 text-xs"><b className="block">{t}</b><span className="block truncate text-slate-500">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
