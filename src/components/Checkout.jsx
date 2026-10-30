import { useMemo, useRef, useState } from 'react'
import {
  AlertCircle, ArrowLeft, ArrowRight, Check, ClipboardCopy, Clock, Download, History, Lock,
  LockOpen, Mail, MessageCircle, Phone, RotateCcw, Send, Trash2, User,
} from 'lucide-react'
import { BRAND, CATALOG, DIVISIONS, PAYMENT_METHODS, PRICING } from '../config.js'
import { formatMoney, useCurrency } from '../currency.jsx'
import { Panel, Reveal, Section, SectionHeader } from './ui.jsx'

const STEPS = ['Configuración', 'Método de pago', 'Checkout']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const DISCORD_RE = /^@?[a-zA-Z0-9_.]{2,32}(#\d{4})?$/
const FOLIO_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function makeFolio() {
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  return 'KDX-' + Array.from(bytes, (b) => FOLIO_CHARS[b % FOLIO_CHARS.length]).join('')
}

function loadHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem(BRAND.storageKey) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(BRAND.storageKey, JSON.stringify(list))
  } catch {
    /* almacenamiento no disponible */
  }
}

export function validate(form) {
  const e = {}
  const phoneDigits = form.whatsapp.replace(/\D/g, '')
  const discord = form.discord.trim()
  if (form.name.trim().length < 2) e.name = 'Escribe tu nombre o alias (mínimo 2 caracteres).'
  if (!form.email.trim()) e.email = 'El correo es obligatorio.'
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Formato de correo no válido (ej. tu@correo.com).'
  if (form.whatsapp.trim() && phoneDigits.length < 10) e.whatsapp = 'El WhatsApp / teléfono debe tener al menos 10 dígitos.'
  if (discord && !DISCORD_RE.test(discord)) e.discord = 'Usuario de Discord no válido (letras, números, _ y .).'
  if (!form.whatsapp.trim() && !discord) e.contact = 'Debes dejar tu WhatsApp / Teléfono o tu usuario de Discord (o ambos).'
  if (form.details.trim().length < 15) e.details = 'Describe tu idea con al menos 15 caracteres.'
  return e
}

const SUBJECT = (folio) => '🚀 Nueva Solicitud de Compra KODEXAR - Folio #' + folio

function orderLines(o) {
  const line = '─'.repeat(44)
  return [
    `Folio:            #${o.folio}`,
    `Fecha:            ${o.date}`,
    `Cliente:          ${o.name}`,
    `Correo:           ${o.email}`,
    `WhatsApp:         ${o.whatsapp || 'No proporcionado'}`,
    `Discord:          ${o.discord || 'No proporcionado'}`,
    line,
    `Servicio:         ${o.category}`,
    o.game ? `Juego:            ${o.game}` : null,
    `Módulos:`,
    ...(o.modules.length ? o.modules.map((m) => `  • ${m}`) : ['  • Paquete base']),
    `Entrega estimada: ${o.days} días hábiles`,
    line,
    `Moneda:           ${o.currency}`,
    `Método de pago:   ${o.paymentLabel}`,
    `Total estimado:   ${o.total}`,
    `Equivalente:      ${o.totalAlt}`,
    line,
    `Descripción del proyecto:`,
    o.details,
  ].filter((l) => l !== null)
}

// Correo que el cliente envía a Yamil desde su propia cuenta.
function buildOrderEmail(o) {
  return [`Hola ${BRAND.owner}, quiero hacer este pedido en ${BRAND.name}:`, '', ...orderLines(o), '', 'Quedo atento(a) a los datos de pago.', `— ${o.name}`].join('\n')
}

function buildReceiptText(o) {
  const line = '─'.repeat(44)
  return [
    `KODEXAR — Recibo de Orden`,
    line,
    ...orderLines(o),
    line,
    `Tu pedido se preparó en Gmail para ${BRAND.email}.`,
    `Si aún no lo enviaste, manda este recibo a ese correo para que ${BRAND.owner}`,
    `te contacte con los datos de pago (SPEI / USD).`,
  ].join('\n')
}

function gmailHref(o) {
  const q = new URLSearchParams({ view: 'cm', fs: '1', to: BRAND.email, su: SUBJECT(o.folio), body: buildOrderEmail(o) })
  return `https://mail.google.com/mail/?${q.toString().replace(/\+/g, '%20')}`
}

function mailtoHref(o) {
  return `mailto:${BRAND.email}?subject=${encodeURIComponent(SUBJECT(o.folio))}&body=${encodeURIComponent(buildOrderEmail(o))}`
}

function Field({ id, label, icon: Icon, error, hint, ok, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-2 text-sm font-medium text-zinc-200">
        <Icon className="size-4 text-mute" /> {label}
        {ok && <Check className="ml-auto size-4 text-emerald-400" />}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400"><AlertCircle className="size-3.5 shrink-0" /> {error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-mute">{hint}</p>
      ) : null}
    </div>
  )
}

const inputCls = (bad) =>
  `w-full rounded-xl border bg-obsidian px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 ${
    bad ? 'border-red-500/70 ring-2 ring-red-500/15' : 'border-line'
  }`

export default function Checkout() {
  const { currency, setCurrency, format } = useCurrency()
  const [step, setStep] = useState(0)
  const [catId, setCatId] = useState('web')
  const [game, setGame] = useState('')
  const [features, setFeatures] = useState([])
  const [payment, setPayment] = useState('SPEI')
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', discord: '', details: '' })
  const [touched, setTouched] = useState({})
  const [order, setOrder] = useState(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState(loadHistory)
  const topRef = useRef(null)

  const cat = CATALOG.find((c) => c.id === catId)
  const accent = DIVISIONS[cat.division].accent
  const chosen = cat.features.filter((f) => features.includes(f.id))
  const totalMxn = cat.basePrice + chosen.reduce((s, f) => s + f.price, 0)
  const days = cat.baseDays + chosen.reduce((s, f) => s + f.days, 0)
  const errors = useMemo(() => validate(form), [form])
  const contactOk = !errors.contact && !errors.whatsapp && !errors.discord
  const formOk = Object.keys(errors).length === 0
  const gameMissing = cat.requiresGame && game.trim().length < 2
  const show = (k) => touched[k] || touched._all

  const pickCategory = (id) => {
    if (id === catId) return
    setCatId(id)
    setFeatures([])
  }

  const goto = (s) => {
    setStep(s)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const pickPayment = (m) => {
    setPayment(m.id)
    setCurrency(m.currency)
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }))

  const submit = (e) => {
    e.preventDefault()
    setTouched({ _all: true })
    if (!formOk) {
      const first = ['name', 'email', 'whatsapp', 'discord', 'details'].find((k) => errors[k] || (k === 'whatsapp' && errors.contact))
      document.getElementById(`co-${first}`)?.focus()
      return
    }

    const folio = makeFolio()
    const pay = PAYMENT_METHODS.find((p) => p.id === payment)
    const altCurrency = currency === 'MXN' ? 'USD' : 'MXN'
    const record = {
      folio,
      date: new Date().toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' }),
      name: form.name.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      discord: form.discord.trim(),
      category: `${cat.emoji} ${cat.title}`,
      game: cat.requiresGame ? game.trim() : '',
      modules: chosen.map((f) => f.label),
      days,
      currency,
      payment,
      paymentLabel: `${pay.flag} ${pay.title}`,
      total: format(totalMxn),
      totalAlt: formatMoney(totalMxn, altCurrency),
      details: form.details.trim(),
    }

    // Se abre en el mismo clic (sin await antes) para que el navegador no bloquee la ventana.
    const win = window.open(gmailHref(record), '_blank')
    if (win) win.opener = null

    const next = [{ folio, date: record.date, category: record.category, total: record.total, payment }, ...history].slice(0, 20)
    setHistory(next)
    saveHistory(next)
    setOrder(record)
    goto(3)
  }

  const receiptText = order ? buildReceiptText(order) : ''

  const download = () => {
    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recibo-${order.folio}.txt`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(receiptText)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = receiptText
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const reset = () => {
    setOrder(null)
    setForm({ name: '', email: '', whatsapp: '', discord: '', details: '' })
    setTouched({})
    setFeatures([])
    setGame('')
    goto(0)
  }

  const clearHistory = () => {
    setHistory([])
    saveHistory([])
  }

  return (
    <Section id="cotizar" accent={accent}>
      <div ref={topRef} className="scroll-mt-28" />
      <SectionHeader
        label="SISTEMA DE COMPRA // KODEXAR"
        title="Cotiza, configura y envía tu pedido."
        desc={`Precio y tiempo de entrega calculados en vivo. Tu solicitud llega directo al correo de ${BRAND.owner}: ${BRAND.email}.`}
      />

      <Reveal delay={120}>
      {step < 3 && (
        <ol className="mb-6 grid grid-cols-3 gap-2">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button
                onClick={() => i < step && goto(i)}
                disabled={i >= step}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  i === step ? 'border-[var(--accent)]/60 bg-[var(--accent)]/[0.08]' : i < step ? 'border-line hover:border-line-strong' : 'border-line opacity-50'
                }`}
              >
                <span className={`grid size-7 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold ${i < step ? 'bg-[var(--accent)] text-obsidian' : i === step ? 'bg-white text-obsidian' : 'bg-white/5 text-mute'}`}>
                  {i < step ? <Check className="size-4" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] text-mute">PASO {i + 1}</span>
                  <span className="block truncate text-sm font-semibold text-white">{s}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      {step === 3 && order ? (
        <Receipt order={order} copied={copied} onCopy={copy} onDownload={download} onReset={reset} />
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[1fr_360px]">
          <Panel glow={false} className="p-5 sm:p-6">
            {step === 0 && (
              <div className="animate-fade-up">
                <h3 className="font-display text-xl font-semibold text-white">1. ¿Qué quieres construir?</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {CATALOG.map((c) => {
                    const on = c.id === catId
                    const a = DIVISIONS[c.division].accent
                    return (
                      <button
                        key={c.id}
                        onClick={() => pickCategory(c.id)}
                        aria-pressed={on}
                        style={{ '--accent': a }}
                        className={`rounded-xl border p-4 text-left transition ${on ? 'border-[var(--accent)] bg-[var(--accent)]/[0.08]' : 'border-line hover:border-line-strong'}`}
                      >
                        <span className="flex items-center justify-between">
                          <span className="font-display font-semibold text-white">{c.emoji} {c.title}</span>
                          <span className={`grid size-5 place-items-center rounded-full border ${on ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-line-strong'}`}>
                            {on && <Check className="size-3 text-obsidian" />}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-mute">{c.desc}</span>
                        <span className="mt-3 block font-mono text-xs text-zinc-300">desde {format(c.basePrice)}</span>
                      </button>
                    )
                  })}
                </div>

                {cat.requiresGame && (
                  <div className="mt-5">
                    <label htmlFor="co-game" className="mb-1.5 block text-sm font-medium text-zinc-200">🎮 ¿Para qué juego es el mod? <span className="text-red-400">*</span></label>
                    <input id="co-game" value={game} onChange={(e) => setGame(e.target.value)} placeholder="Ej. GTA V (FiveM), Minecraft 1.20 Forge, Roblox…" className={inputCls(touched.game && gameMissing)} onBlur={() => setTouched((t) => ({ ...t, game: true }))} />
                    {touched.game && gameMissing && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400"><AlertCircle className="size-3.5" /> Indica el juego para poder cotizar tu mod.</p>}
                  </div>
                )}

                <h4 className="mt-6 mb-3 text-sm font-semibold text-white">Módulos y funciones</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {cat.features.map((f) => {
                    const on = features.includes(f.id)
                    return (
                      <label key={f.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${on ? 'border-[var(--accent)]/60 bg-[var(--accent)]/[0.06]' : 'border-line hover:border-line-strong'}`}>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => setFeatures((fs) => (on ? fs.filter((x) => x !== f.id) : [...fs, f.id]))}
                          className="size-4 accent-[var(--accent)]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm text-zinc-100">{f.label}</span>
                          <span className="font-mono text-[11px] text-mute">+{format(f.price)} · +{f.days}d</span>
                        </span>
                      </label>
                    )
                  })}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => (gameMissing ? setTouched((t) => ({ ...t, game: true })) : goto(1))}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-obsidian transition hover:bg-zinc-200"
                  >
                    Continuar al pago <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-up">
                <h3 className="font-display text-xl font-semibold text-white">2. ¿Cómo prefieres pagar?</h3>
                <p className="mt-1 text-sm text-mute">{PRICING.paymentNote}. No se cobra nada ahora: {BRAND.owner} te enviará los datos al confirmar.</p>
                <div className="mt-4 space-y-3" role="radiogroup" aria-label="Método de pago">
                  {PAYMENT_METHODS.map((m) => {
                    const on = payment === m.id
                    return (
                      <button
                        key={m.id}
                        role="radio"
                        aria-checked={on}
                        onClick={() => pickPayment(m)}
                        className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${on ? 'border-[var(--accent)] bg-[var(--accent)]/[0.08]' : 'border-line hover:border-line-strong'}`}
                      >
                        <span className="text-3xl leading-none">{m.flag}</span>
                        <span className="flex-1">
                          <span className="flex flex-wrap items-center gap-2 font-semibold text-white">
                            {m.title}
                            <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] ${m.id === 'SPEI' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-zinc-300'}`}>{m.badge}</span>
                          </span>
                          <span className="mt-1 block text-sm text-mute">{m.desc}</span>
                          <span className="mt-2 block font-mono text-sm text-zinc-200">{formatMoney(totalMxn, m.currency)}</span>
                        </span>
                        <span className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full border ${on ? 'border-[var(--accent)]' : 'border-line-strong'}`}>
                          {on && <span className="size-2.5 rounded-full bg-[var(--accent)]" />}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => goto(0)} className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-zinc-300 hover:border-line-strong"><ArrowLeft className="size-4" /> Atrás</button>
                  <button onClick={() => goto(2)} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-obsidian transition hover:bg-zinc-200">
                    Continuar <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={submit} noValidate className="animate-fade-up">
                <h3 className="font-display text-xl font-semibold text-white">3. Tus datos de contacto</h3>
                <p className="mt-1 text-sm text-mute">Obligatorios para que {BRAND.owner} pueda responderte y enviarte los datos de pago.</p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field id="co-name" label="Nombre o alias *" icon={User} error={show('name') && errors.name} ok={!errors.name}>
                    <input id="co-name" value={form.name} onChange={set('name')} onBlur={blur('name')} autoComplete="name" placeholder="Tu nombre" aria-invalid={!!(show('name') && errors.name)} className={inputCls(show('name') && errors.name)} />
                  </Field>
                  <Field id="co-email" label="Correo electrónico *" icon={Mail} error={show('email') && errors.email} ok={!errors.email}>
                    <input id="co-email" type="email" value={form.email} onChange={set('email')} onBlur={blur('email')} autoComplete="email" placeholder="tu@correo.com" aria-invalid={!!(show('email') && errors.email)} className={inputCls(show('email') && errors.email)} />
                  </Field>
                </div>

                <fieldset
                  className={`mt-4 rounded-2xl border p-4 transition ${
                    (show('whatsapp') || show('discord')) && !contactOk ? 'border-red-500/60 bg-red-500/[0.04]' : contactOk ? 'border-emerald-500/40 bg-emerald-500/[0.03]' : 'border-line'
                  }`}
                >
                  <legend className="flex items-center gap-2 px-2 text-sm font-semibold text-white">
                    {contactOk ? <LockOpen className="size-4 text-emerald-400" /> : <Lock className="size-4 text-amber-400" />}
                    Contacto directo obligatorio
                  </legend>
                  <p className="mb-3 text-xs text-mute">Ingresa tu WhatsApp / Teléfono <b className="text-zinc-300">o</b> tu usuario de Discord (o ambos).</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="co-whatsapp" label="WhatsApp / Teléfono" icon={Phone} error={show('whatsapp') && errors.whatsapp} hint="Mínimo 10 dígitos. Ej. 55 1234 5678" ok={form.whatsapp && !errors.whatsapp}>
                      <input id="co-whatsapp" type="tel" inputMode="tel" value={form.whatsapp} onChange={set('whatsapp')} onBlur={blur('whatsapp')} autoComplete="tel" placeholder="+52 55 1234 5678" aria-invalid={!!(show('whatsapp') && (errors.whatsapp || errors.contact))} className={inputCls(show('whatsapp') && (errors.whatsapp || errors.contact))} />
                    </Field>
                    <Field id="co-discord" label="Usuario de Discord" icon={MessageCircle} error={show('discord') && errors.discord} hint="Ej. yamil.dev" ok={form.discord && !errors.discord}>
                      <input id="co-discord" value={form.discord} onChange={set('discord')} onBlur={blur('discord')} placeholder="tu_usuario" aria-invalid={!!(show('discord') && (errors.discord || errors.contact))} className={inputCls(show('discord') && (errors.discord || errors.contact))} />
                    </Field>
                  </div>
                  {(show('whatsapp') || show('discord')) && errors.contact && (
                    <p role="alert" className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300">
                      <AlertCircle className="size-4 shrink-0" /> {errors.contact}
                    </p>
                  )}
                </fieldset>

                <div className="mt-4">
                  <Field id="co-details" label="Detalles / especificaciones de tu idea *" icon={Send} error={show('details') && errors.details} ok={!errors.details}>
                    <textarea id="co-details" rows={5} value={form.details} onChange={set('details')} onBlur={blur('details')} placeholder="Cuéntame qué necesitas, referencias, fechas importantes…" aria-invalid={!!(show('details') && errors.details)} className={`${inputCls(show('details') && errors.details)} resize-y`} />
                  </Field>
                  <p className="mt-1 text-right font-mono text-[10px] text-mute">{form.details.trim().length} / 15 mín.</p>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button type="button" onClick={() => goto(1)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-zinc-300 hover:border-line-strong"><ArrowLeft className="size-4" /> Atrás</button>
                  <button
                    type="submit"
                    aria-disabled={!formOk}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                      formOk ? 'bg-[var(--accent)] text-obsidian hover:brightness-110' : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    {formOk ? (
                      <><Send className="size-4" /> Confirmar Pedido y Enviar por Gmail</>
                    ) : (
                      <><Lock className="size-4" /> Completa tus datos para enviar</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Panel>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Panel className="p-5">
              <p className="font-mono text-[11px] tracking-widest text-[var(--accent)]">RESUMEN EN VIVO</p>
              <p className="mt-2 font-display text-lg font-semibold text-white">{cat.emoji} {cat.title}</p>
              {cat.requiresGame && <p className="text-sm text-mute">Juego: {game.trim() || '—'}</p>}
              <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <li className="flex justify-between gap-3 text-zinc-300"><span>Paquete base</span><span className="font-mono">{format(cat.basePrice)}</span></li>
                {chosen.map((f) => (
                  <li key={f.id} className="flex justify-between gap-3 text-zinc-400"><span className="min-w-0 truncate">{f.label}</span><span className="shrink-0 font-mono">+{format(f.price)}</span></li>
                ))}
              </ul>
              <div className="mt-4 border-t border-line pt-4">
                <p className="flex items-center justify-between text-sm text-mute"><span className="flex items-center gap-1.5"><Clock className="size-4" /> Entrega estimada</span><span className="font-mono text-white">{days} días hábiles</span></p>
                <p className="mt-3 text-xs text-mute">Total estimado</p>
                <p className="font-mono text-3xl font-bold text-white">{format(totalMxn)}</p>
                <p className="font-mono text-xs text-mute">≈ {formatMoney(totalMxn, currency === 'MXN' ? 'USD' : 'MXN')} · 1 USD = {PRICING.mxnPerUsd} MXN</p>
              </div>
              <div className="mt-4 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-200">
                🇲🇽 {PRICING.paymentNote}.
                <span className="mt-1 block text-emerald-200/70">Método elegido: <b>{payment === 'SPEI' ? 'SPEI (MXN)' : 'USD internacional'}</b></span>
              </div>
            </Panel>

            {history.length > 0 && (
              <Panel className="p-5">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-mute"><History className="size-3.5" /> TUS PEDIDOS</p>
                  <button onClick={clearHistory} className="text-mute hover:text-red-400" aria-label="Borrar historial"><Trash2 className="size-4" /></button>
                </div>
                <ul className="mt-3 space-y-2">
                  {history.map((h) => (
                    <li key={h.folio} className="rounded-lg border border-line bg-obsidian p-3 text-xs">
                      <p className="flex justify-between font-mono"><b className="text-white">#{h.folio}</b><span className="text-zinc-300">{h.total}</span></p>
                      <p className="mt-1 text-mute">{h.category} · {h.payment} · {h.date}</p>                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </aside>
        </div>
      )}
      </Reveal>    </Section>
  )
}

function Receipt({ order, copied, onCopy, onDownload, onReset }) {
  const channel = `${order.whatsapp ? ' por WhatsApp' : ''}${order.whatsapp && order.discord ? ' o' : ''}${order.discord ? ' por Discord' : ''}`
  const payWith = order.payment === 'SPEI' ? 'transferencia SPEI' : 'pago en USD'
  return (
    <Panel glow={false} className="mx-auto max-w-3xl animate-fade-up overflow-hidden">
      <div className="border-b border-line bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_70%)] p-6 text-center sm:p-10">
        <Mail className="mx-auto size-14 text-[var(--accent)]" />
        <p className="mt-4 font-mono text-xs tracking-widest text-mute">RECIBO DE ORDEN · LISTO PARA ENVIAR</p>
        <h3 className="mt-1 font-mono text-3xl font-bold text-white sm:text-4xl">#{order.folio}</h3>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-300">
          Abrimos Gmail con tu pedido ya escrito para <b className="text-white">{BRAND.email}</b>. Solo presiona <b className="text-white">Enviar</b> en
          Gmail y <b className="text-white">{BRAND.owner}</b> se pondrá en contacto contigo{channel} para enviarte los datos de {payWith}.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href={gmailHref(order)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-obsidian hover:brightness-110">
            <Mail className="size-4" /> Abrir Gmail de nuevo
          </a>
          <a href={mailtoHref(order)} className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 text-sm text-white hover:border-[var(--accent)]">
            <Send className="size-4" /> Usar otra app de correo
          </a>
        </div>
      </div>
      <dl className="grid gap-px bg-line sm:grid-cols-2">
        {[
          ['Cliente', order.name],
          ['Correo', order.email],
          ['WhatsApp', order.whatsapp || '—'],
          ['Discord', order.discord || '—'],
          ['Servicio', order.category + (order.game ? ` · ${order.game}` : '')],
          ['Entrega estimada', `${order.days} días hábiles`],
          ['Método de pago', order.paymentLabel],
          ['Total estimado', `${order.total}  (≈ ${order.totalAlt})`],
        ].map(([k, v]) => (
          <div key={k} className="bg-carbon p-4">
            <dt className="text-xs text-mute">{k}</dt>
            <dd className="mt-0.5 font-mono text-sm break-words text-white">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-line p-5">
        <p className="text-xs text-mute">Módulos</p>
        <p className="mt-1 text-sm text-zinc-200">{order.modules.length ? order.modules.join(' · ') : 'Paquete base'}</p>
        <p className="mt-4 text-xs text-mute">Descripción</p>
        <p className="mt-1 text-sm whitespace-pre-line text-zinc-200">{order.details}</p>
      </div>
      <div className="flex flex-wrap gap-3 border-t border-line p-5">
        <button onClick={onDownload} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-obsidian hover:bg-zinc-200"><Download className="size-4" /> Descargar recibo .txt</button>
        <button onClick={onCopy} className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 text-sm text-white hover:border-[var(--accent)]">
          {copied ? <Check className="size-4 text-emerald-400" /> : <ClipboardCopy className="size-4" />} {copied ? 'Copiado' : 'Copiar recibo'}
        </button>
        <button onClick={onReset} className="ml-auto inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-mute hover:text-white"><RotateCcw className="size-4" /> Nueva solicitud</button>
      </div>
    </Panel>
  )
}
