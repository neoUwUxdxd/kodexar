import { useEffect, useRef, useState } from 'react'
import { Bell, Hash, Pin, PlusCircle, Search, SendHorizontal, Smile, Users, Volume2 } from 'lucide-react'
import { DIVISIONS } from '../config.js'
import { Reveal, Section, SectionHeader } from './ui.jsx'

const COMMANDS = [
  { name: 'tickets-ventas', desc: 'Abre el centro de ventas con tickets automáticos' },
  { name: 'economia-casino', desc: 'Economía del servidor con minijuegos de casino' },
  { name: 'puente-juego', desc: 'Estado en vivo del servidor de juego (FiveM / Minecraft)' },
  { name: 'ia-moderacion', desc: 'Analiza un mensaje con moderación por IA' },
  { name: 'panel-custom', desc: 'Panel de auto-roles con botones' },
]

const ROLE_OPTS = [
  { id: 'dev', label: '💻 Developer' },
  { id: 'gamer', label: '🎮 Gamer' },
  { id: 'news', label: '🔔 Notificaciones' },
  { id: 'vip', label: '💎 Cliente VIP' },
]

let uid = 0
const nextId = () => ++uid
const now = () => new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
const rnd = (a, b) => Math.floor(a + Math.random() * (b - a + 1))

// Construye el embed de cada comando a partir de su estado.
function buildEmbed(cmd, st) {
  switch (cmd) {
    case 'tickets-ventas':
      return {
        color: '#5865F2',
        title: '🛒 Centro de Ventas — Kodexar Store',
        desc: 'Selecciona una opción. Se abrirá un canal privado con el equipo en menos de 1 segundo.',
        fields: [['Tickets abiertos', String(st.open)], ['Tiempo de respuesta', '~2 min']],
        buttons: [
          { id: 'buy', label: '🛒 Comprar', style: 'primary' },
          { id: 'support', label: '❓ Soporte', style: 'secondary' },
          { id: 'status', label: '📦 Estado de pedido', style: 'secondary' },
        ],
      }
    case 'economia-casino':
      return {
        color: '#F1C40F',
        title: '🎰 Casino Kodexar',
        desc: st.last || 'Apuesta 100 🪙 por jugada. ¡Suerte!',
        fields: [['Saldo', `${st.balance.toLocaleString('es-MX')} 🪙`], ['Racha', `${st.streak} 🔥`]],
        buttons: [
          { id: 'slots', label: '🎰 Tragamonedas', style: 'success', disabled: st.balance < 100 },
          { id: 'flip', label: '🪙 Coinflip', style: 'primary', disabled: st.balance < 100 },
          { id: 'daily', label: '💰 Daily', style: 'secondary', disabled: st.daily },
        ],
      }
    case 'puente-juego':
      return {
        color: '#2ECC71',
        title: '🟢 play.kodexar-rp.mx — En línea',
        desc: st.announce ? `📢 Anuncio enviado al juego: "${st.announce}"` : 'Puente bidireccional Discord ⇄ Servidor de juego.',
        fields: [['Jugadores', `${st.players}/64`], ['TPS', st.tps.toFixed(1)], ['Ping', `${st.ping}ms`]],
        list: st.showList ? ['Yamil_Dev', 'Nova_RP', 'ElPatron', 'Luna.mx', 'Kraken'] : null,
        buttons: [
          { id: 'refresh', label: '🔄 Refrescar', style: 'secondary' },
          { id: 'announce', label: '📢 Anunciar en juego', style: 'primary' },
          { id: 'list', label: st.showList ? '🙈 Ocultar jugadores' : '👥 Lista jugadores', style: 'secondary' },
        ],
      }
    case 'ia-moderacion':
      return {
        color: st.action ? '#2ECC71' : '#ED4245',
        title: '🛡️ Moderación IA — Mensaje analizado',
        desc: '> "eres un inútil, nadie te quiere aquí 🤡"\n— @usuario_random en #general',
        fields: [['Toxicidad', '97.2%'], ['Categoría', 'Acoso'], ['Confianza', 'Alta']],
        footer: st.action ? `✅ Acción aplicada por @Moderador: ${st.action}` : 'Esperando decisión del moderador…',
        buttons: st.action
          ? []
          : [
              { id: 'warn', label: '⚠️ Advertir', style: 'secondary' },
              { id: 'mute', label: '🔇 Silenciar 10m', style: 'danger' },
              { id: 'ignore', label: '✅ Ignorar', style: 'success' },
            ],
      }
    case 'panel-custom':
      return {
        color: '#EB459E',
        title: '🎭 Elige tus roles',
        desc: 'Haz clic para agregar o quitar roles. Los cambios son instantáneos.',
        fields: [['Tus roles', st.roles.length ? st.roles.map((r) => ROLE_OPTS.find((o) => o.id === r).label).join(', ') : 'Ninguno']],
        buttons: ROLE_OPTS.map((o) => ({ id: o.id, label: o.label, style: st.roles.includes(o.id) ? 'success' : 'secondary' })),
      }
    default:
      return null
  }
}

const INITIAL_STATE = {
  'tickets-ventas': () => ({ open: 3 }),
  'economia-casino': () => ({ balance: 1000, streak: 0, daily: false, last: '' }),
  'puente-juego': () => ({ players: 47, tps: 19.9, ping: 38, showList: false, announce: '' }),
  'ia-moderacion': () => ({ action: '' }),
  'panel-custom': () => ({ roles: [] }),
}

// Reductor de clics en botones: devuelve nuevo estado y mensaje efímero opcional.
function onButton(cmd, st, btn) {
  if (cmd === 'tickets-ventas') {
    const n = String(140 + st.open + 1).padStart(4, '0')
    const kind = { buy: 'venta', support: 'soporte', status: 'pedido' }[btn]
    return [{ ...st, open: st.open + 1 }, `🎫 Ticket creado: **#${kind}-${n}** — solo tú y el staff pueden verlo.`]
  }
  if (cmd === 'economia-casino') {
    if (btn === 'daily') return [{ ...st, balance: st.balance + 500, daily: true, last: '💰 Reclamaste tu recompensa diaria: +500 🪙' }]
    if (btn === 'slots') {
      const icons = ['🍒', '💎', '7️⃣', '🍋', '⭐']
      const roll = [0, 0, 0].map(() => icons[rnd(0, icons.length - 1)])
      const win = roll[0] === roll[1] && roll[1] === roll[2] ? 1000 : roll[0] === roll[1] || roll[1] === roll[2] ? 150 : 0
      return [{ ...st, balance: st.balance - 100 + win, streak: win ? st.streak + 1 : 0, last: `[ ${roll.join(' | ')} ]  ${win ? `¡Ganaste ${win} 🪙!` : 'Sin premio esta vez.'}` }]
    }
    const heads = Math.random() > 0.5
    return [{ ...st, balance: st.balance + (heads ? 100 : -100), streak: heads ? st.streak + 1 : 0, last: heads ? '🪙 ¡Cara! Ganaste 100 🪙' : '🪙 Cruz… perdiste 100 🪙' }]
  }
  if (cmd === 'puente-juego') {
    if (btn === 'refresh') return [{ ...st, players: rnd(40, 64), tps: 19 + Math.random(), ping: rnd(28, 55) }]
    if (btn === 'announce') return [{ ...st, announce: '¡Evento de carreras en 10 minutos!' }, '✅ Anuncio transmitido a 64 jugadores en el servidor.']
    return [{ ...st, showList: !st.showList }]
  }
  if (cmd === 'ia-moderacion') {
    const label = { warn: 'Advertencia enviada por DM', mute: 'Usuario silenciado 10 minutos', ignore: 'Marcado como falso positivo' }[btn]
    return [{ ...st, action: label }]
  }
  if (cmd === 'panel-custom') {
    const has = st.roles.includes(btn)
    const roles = has ? st.roles.filter((r) => r !== btn) : [...st.roles, btn]
    const label = ROLE_OPTS.find((o) => o.id === btn).label
    return [{ ...st, roles }, has ? `➖ Rol ${label} removido.` : `➕ Rol ${label} agregado.`]
  }
  return [st]
}

const BTN = {
  primary: 'bg-[#5865F2] hover:bg-[#4752C4] text-white',
  secondary: 'bg-[#4E5058] hover:bg-[#6D6F78] text-white',
  success: 'bg-[#248046] hover:bg-[#1A6334] text-white',
  danger: 'bg-[#DA373C] hover:bg-[#A12828] text-white',
}

function Markdown({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith('**') ? <b key={i} className="text-white">{p.slice(2, -2)}</b> : p))
}

function Avatar({ bot }) {
  return bot ? (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#5865F2] font-display text-sm font-bold text-white">K</span>
  ) : (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-black">TÚ</span>
  )
}

function Message({ m, onClick }) {
  const embed = m.cmd ? buildEmbed(m.cmd, m.state) : null
  return (
    <div className={`group flex gap-4 px-4 py-1.5 hover:bg-[#2E3035] ${m.ephemeral ? 'bg-[#5865F2]/[0.06]' : ''}`}>
      <Avatar bot={m.bot} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2">
          <span className={`font-semibold ${m.bot ? 'text-[#C9CDFB]' : 'text-emerald-300'}`}>{m.bot ? 'Kodexar Bot' : 'Tú'}</span>
          {m.bot && <span className="rounded bg-[#5865F2] px-1 text-[10px] font-semibold text-white">✓ APP</span>}
          <span className="text-xs text-[#949BA4]">Hoy a las {m.time}</span>
        </p>
        {m.text && (
          <p className={`text-[15px] text-[#DBDEE1] ${m.slash ? 'font-mono text-sm' : ''}`}>
            {m.slash ? <span className="rounded bg-[#5865F2]/25 px-1 text-[#C9CDFB]">{m.text}</span> : <Markdown text={m.text} />}
          </p>
        )}
        {m.ephemeral && <p className="mt-1 text-xs text-[#949BA4]">👁️ Solo tú puedes ver esto · <span className="text-[#00A8FC]">Descartar mensaje</span></p>}
        {embed && (
          <div className="mt-1.5 max-w-[520px] animate-fade-up">
            <div className="rounded border-l-4 bg-[#2B2D31] p-3 pr-4" style={{ borderColor: embed.color }}>
              <p className="font-semibold text-white">{embed.title}</p>
              <p className="mt-1 text-sm whitespace-pre-line text-[#DBDEE1]">{embed.desc}</p>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                {embed.fields.map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs font-semibold text-white">{k}</p>
                    <p className="font-mono text-sm text-[#DBDEE1]">{v}</p>
                  </div>
                ))}
              </div>
              {embed.list && (
                <ul className="mt-3 grid grid-cols-2 gap-1 font-mono text-xs text-[#B5BAC1]">
                  {embed.list.map((p) => <li key={p}>• {p}</li>)}
                </ul>
              )}
              {embed.footer && <p className="mt-3 text-xs text-[#B5BAC1]">{embed.footer}</p>}
            </div>
            {embed.buttons.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {embed.buttons.map((b) => (
                  <button
                    key={b.id}
                    disabled={b.disabled}
                    onClick={() => onClick(m.id, b.id)}
                    className={`rounded-[3px] px-4 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${BTN[b.style]}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DiscordSim() {
  const [messages, setMessages] = useState(() => [
    { id: nextId(), bot: true, time: now(), text: '👋 ¡Hola! Soy un bot hecho por **Kodexar**. Escribe **/** en el chat o toca un comando abajo para probarme.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [sel, setSel] = useState(0)
  const scroller = useRef(null)
  const timers = useRef([])

  const showMenu = input.startsWith('/')
  const matches = COMMANDS.filter((c) => c.name.startsWith(input.slice(1).trim().toLowerCase()))

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = (name) => {
    if (typing) return
    setInput('')
    setMessages((ms) => [...ms, { id: nextId(), time: now(), text: `/${name}`, slash: true }])
    setTyping(true)
    timers.current.push(
      setTimeout(() => {
        setTyping(false)
        setMessages((ms) => [...ms, { id: nextId(), bot: true, time: now(), cmd: name, state: INITIAL_STATE[name]() }])
      }, 700),
    )
  }

  const click = (msgId, btn) => {
    setMessages((ms) => {
      const msg = ms.find((m) => m.id === msgId)
      const [state, reply] = onButton(msg.cmd, msg.state, btn)
      const updated = ms.map((m) => (m.id === msgId ? { ...m, state } : m))
      return reply ? [...updated, { id: nextId(), bot: true, time: now(), text: reply, ephemeral: true }] : updated
    })
  }

  const submit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    if (showMenu) {
      const exact = COMMANDS.find((c) => `/${c.name}` === text)
      const pick = exact || matches[sel] || matches[0]
      if (pick) return run(pick.name)
    }
    setInput('')
    setMessages((ms) => [
      ...ms,
      { id: nextId(), time: now(), text },
      { id: nextId(), bot: true, time: now(), text: 'Usa un comando slash, por ejemplo **/tickets-ventas** o **/economia-casino** 😉', ephemeral: true },
    ])
  }

  const onKey = (e) => {
    if (!showMenu || !matches.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => (s + 1) % matches.length) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => (s - 1 + matches.length) % matches.length) }
    if (e.key === 'Tab') { e.preventDefault(); setInput(`/${matches[sel]?.name ?? matches[0].name}`) }
  }

  return (
    <Section id="bots" accent={DIVISIONS.bots.accent}>
      <SectionHeader
        label="KODEXAR // BOTS — Cualquier Función"
        title="Un Discord real, dentro de esta página."
        desc="Ejecuta comandos slash y presiona los botones de los embeds. Todo responde en tiempo real, igual que en tu servidor."
      />

      <Reveal delay={120} className="flex h-[640px] overflow-hidden rounded-2xl border border-line bg-[#313338] font-sans shadow-2xl shadow-black/60">
        {/* Servidores */}
        <div className="hidden w-[72px] shrink-0 flex-col items-center gap-2 bg-[#1E1F22] py-3 sm:flex">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#5865F2] font-display font-bold text-white">K</span>
          <span className="h-0.5 w-8 rounded bg-[#35363C]" />
          {['🎮', '🛒', '🏎️'].map((e) => (
            <span key={e} className="grid size-12 place-items-center rounded-full bg-[#313338] text-xl transition-all hover:rounded-2xl hover:bg-[#5865F2]">{e}</span>
          ))}
          <span className="grid size-12 place-items-center rounded-full bg-[#313338] text-[#23A559]"><PlusCircle className="size-5" /></span>
        </div>

        {/* Canales */}
        <div className="hidden w-60 shrink-0 flex-col bg-[#2B2D31] md:flex">
          <p className="border-b border-black/30 px-4 py-3 font-semibold text-white shadow-sm">Kodexar Lab</p>
          <div className="flex-1 space-y-0.5 p-2 text-[15px]">
            <p className="px-2 pt-3 pb-1 text-xs font-semibold tracking-wide text-[#949BA4] uppercase">Canales de texto</p>
            {['anuncios', 'pruebas-bot', 'ventas', 'general'].map((c) => (
              <p key={c} className={`flex items-center gap-1.5 rounded px-2 py-1.5 ${c === 'pruebas-bot' ? 'bg-[#404249] text-white' : 'text-[#949BA4]'}`}>
                <Hash className="size-5" /> {c}
              </p>
            ))}
            <p className="px-2 pt-4 pb-1 text-xs font-semibold tracking-wide text-[#949BA4] uppercase">Voz</p>
            <p className="flex items-center gap-1.5 rounded px-2 py-1.5 text-[#949BA4]"><Volume2 className="size-5" /> Lounge</p>
          </div>
          <div className="flex items-center gap-2 bg-[#232428] p-2">
            <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-[10px] font-bold text-black">TÚ</span>
            <span className="text-sm leading-tight"><b className="block text-white">Cliente</b><span className="text-xs text-[#949BA4]">En línea</span></span>
          </div>
        </div>

        {/* Chat */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-black/30 px-4 py-3 shadow-sm">
            <Hash className="size-5 text-[#80848E]" />
            <span className="font-semibold text-white">pruebas-bot</span>
            <span className="ml-auto flex gap-4 text-[#B5BAC1]"><Bell className="size-5" /><Pin className="size-5" /><Users className="hidden size-5 sm:block" /><Search className="hidden size-5 sm:block" /></span>
          </div>

          <div ref={scroller} className="flex-1 space-y-1 overflow-y-auto py-4 scroll-thin" aria-live="polite">
            {messages.map((m) => <Message key={m.id} m={m} onClick={click} />)}
            {typing && <p className="px-4 pt-2 text-sm text-[#B5BAC1]"><b>Kodexar Bot</b> está escribiendo<span className="animate-pulse">…</span></p>}
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-2">
            {COMMANDS.map((c) => (
              <button key={c.name} onClick={() => run(c.name)} disabled={typing} className="shrink-0 rounded-full border border-[#5865F2]/40 bg-[#5865F2]/10 px-3 py-1 font-mono text-xs text-[#C9CDFB] transition hover:bg-[#5865F2]/30 disabled:opacity-50">
                /{c.name}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="relative px-4 pb-5">
            {showMenu && matches.length > 0 && (
              <div className="absolute inset-x-4 bottom-full mb-2 overflow-hidden rounded-lg bg-[#2B2D31] shadow-xl ring-1 ring-black/40">
                <p className="px-3 pt-2 pb-1 text-xs font-semibold text-[#B5BAC1] uppercase">Comandos de Kodexar Bot</p>
                {matches.map((c, i) => (
                  <button
                    type="button"
                    key={c.name}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => run(c.name)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left ${i === sel ? 'bg-[#404249]' : ''}`}
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-[#5865F2] text-xs font-bold text-white">K</span>
                    <span className="min-w-0">
                      <span className="block font-mono text-sm text-white">/{c.name}</span>
                      <span className="block truncate text-xs text-[#B5BAC1]">{c.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3 rounded-lg bg-[#383A40] px-4 py-2.5">
              <PlusCircle className="size-5 shrink-0 text-[#B5BAC1]" />
              <input
                value={input}
                onChange={(e) => { setInput(e.target.value); setSel(0) }}
                onKeyDown={onKey}
                placeholder="Enviar mensaje a #pruebas-bot — escribe /"
                aria-label="Mensaje"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-[#DBDEE1] outline-none placeholder:text-[#6D6F78]"
              />
              <Smile className="hidden size-5 text-[#B5BAC1] sm:block" />
              <button type="submit" aria-label="Enviar" className="text-[#B5BAC1] hover:text-white"><SendHorizontal className="size-5" /></button>
            </div>
          </form>
        </div>
      </Reveal>
    </Section>
  )
}
