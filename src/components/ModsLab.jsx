import { useEffect, useState } from 'react'
import { Cpu, Gauge, MemoryStick, MoveHorizontal } from 'lucide-react'
import { DIVISIONS } from '../config.js'
import { Panel, Reveal, Section, SectionHeader, Segmented } from './ui.jsx'

const ECOSYSTEMS = [
  {
    id: 'jvm',
    tab: 'Java / C++',
    games: ['Minecraft', 'Skyrim', 'Unreal Engine', 'Steam Workshop'],
    file: 'KodexarMod.java',
    code: `@Mod("kodexar")
public class KodexarMod {
  public KodexarMod(IEventBus bus) {
    bus.addListener(this::onTick);
    Registry.register(Items.PLASMA_BLADE);
  }
  private void onTick(TickEvent e) {
    ChunkCache.prefetch(e.level); // 0.01ms
  }
}`,
    base: { fps: 61, cpu: 2.41, ram: 3.8 },
  },
  {
    id: 'lua',
    tab: 'Lua / Luau',
    games: ['GTA V · FiveM', 'Roblox', "Garry's Mod", 'Project Zomboid'],
    file: 'client.lua',
    code: `local Kodexar = exports['kdx-core']

RegisterCommand('turbo', function()
  local veh = GetVehiclePedIsIn(PlayerPedId())
  SetVehicleEnginePowerMultiplier(veh, 40.0)
  Kodexar:Notify('🔥 Turbo activado')
end)

CreateThread(function()
  while true do Wait(500) Kodexar:Sync() end
end)`,
    base: { fps: 54, cpu: 3.12, ram: 4.6 },
  },
  {
    id: 'net',
    tab: 'C# / .NET',
    games: ['Unity', 'Terraria', 'Rust (uMod)'],
    file: 'KodexarPatch.cs',
    code: `[HarmonyPatch(typeof(Player), "Update")]
public static class KodexarPatch {
  static void Postfix(Player __instance) {
    if (__instance.IsLocal)
      KdxHud.Draw(__instance.Stats);
  }
}

[Info("Kodexar Core", "Yamil", "2.0.0")]
public class KodexarCore : RustPlugin { }`,
    base: { fps: 72, cpu: 1.96, ram: 2.9 },
  },
]

const MODS = [
  { id: 'light', label: 'Iluminación volumétrica' },
  { id: 'fx', label: 'Partículas y clima' },
  { id: 'hud', label: 'HUD Kodexar' },
]

function Scene({ modded, opts, eco }) {
  const sky = modded ? ['#1E1B4B', '#7C2D12', '#F59E0B'] : ['#9CA3AF', '#A8AFB8', '#C4C8CE']
  return (
    <svg viewBox="0 0 800 400" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${modded}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="0.65" stopColor={sky[1]} />
          <stop offset="1" stopColor={sky[2]} />
        </linearGradient>
        <radialGradient id="sun" cx="0.7" cy="0.62" r="0.35">
          <stop offset="0" stopColor="#FDE68A" stopOpacity="0.95" />
          <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill={`url(#sky-${modded})`} />
      {modded && opts.light && <rect width="800" height="400" fill="url(#sun)" />}
      {modded && opts.light && <circle cx="560" cy="250" r="38" fill="#FEF3C7" />}
      {modded && opts.light &&
        [0, 1, 2, 3, 4].map((i) => (
          <polygon key={i} points={`560,250 ${380 + i * 90},0 ${410 + i * 90},0`} fill="#FDE68A" opacity="0.07" />
        ))}

      <path d="M0 290 L120 210 L210 260 L330 170 L450 250 L560 190 L690 240 L800 200 L800 400 L0 400Z" fill={modded ? '#3B1D47' : '#7B8088'} />
      <path d="M0 320 L150 270 L260 300 L400 250 L520 300 L650 270 L800 300 L800 400 L0 400Z" fill={modded ? '#1F2937' : '#6B7078'} />
      {modded && <path d="M330 170 L355 186 L345 190 L320 180Z M560 190 L585 204 L575 208Z" fill="#FDE68A" opacity="0.6" />}

      <rect x="0" y="340" width="800" height="60" fill={modded ? '#0F172A' : '#5D6168'} />
      {/* estructura */}
      <rect x="140" y="250" width="70" height="90" fill={modded ? '#111827' : '#4B4F55'} />
      <polygon points="130,250 175,215 220,250" fill={modded ? '#7C2D12' : '#3F4247'} />
      <rect x="160" y="280" width="18" height="18" fill={modded ? '#FBBF24' : '#5A5E64'} />
      {modded && <rect x="160" y="280" width="18" height="18" fill="#FBBF24" opacity="0.5" style={{ filter: 'blur(6px)' }} />}
      {modded && (
        <>
          <rect x="620" y="230" width="24" height="110" fill="#111827" />
          <rect x="626" y="238" width="12" height="6" fill="#F59E0B" />
          <circle cx="632" cy="226" r="6" fill="#F59E0B">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      {/* árboles */}
      {[60, 260, 300, 470, 720].map((x, i) => (
        <g key={x}>
          <rect x={x - 3} y={315} width="6" height="25" fill={modded ? '#1C1917' : '#55595F'} />
          <polygon points={`${x - 18},320 ${x},${280 - (i % 2) * 12} ${x + 18},320`} fill={modded ? '#065F46' : '#62676D'} />
        </g>
      ))}
      {modded && opts.fx &&
        Array.from({ length: 26 }, (_, i) => (
          <circle key={i} cx={(i * 97) % 800} cy={(i * 53) % 330} r={1 + (i % 3)} fill="#FDE68A" opacity="0.7">
            <animate attributeName="cy" values={`${(i * 53) % 330};${((i * 53) % 330) + 30};${(i * 53) % 330}`} dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />
          </circle>
        ))}
      {!modded && (
        <text x="20" y="32" fill="#E5E7EB" fontFamily="JetBrains Mono" fontSize="14">VANILLA · {eco.games[0]}</text>
      )}
    </svg>
  )
}

export default function ModsLab() {
  const [ecoId, setEcoId] = useState('jvm')
  const [split, setSplit] = useState(52)
  const [mode, setMode] = useState('modded')
  const [opts, setOpts] = useState({ light: true, fx: true, hud: true })
  const [game, setGame] = useState(0)
  const [hist, setHist] = useState(() => Array(40).fill(0))
  const eco = ECOSYSTEMS.find((e) => e.id === ecoId)
  const modded = mode === 'modded'
  const fpsTarget = modded ? eco.base.fps + 144 : eco.base.fps

  useEffect(() => {
    const id = setInterval(() => {
      const jitter = modded ? 3 : 9
      const v = fpsTarget + Math.round((Math.random() - 0.5) * jitter * 2)
      setHist((h) => [...h.slice(1), v])
    }, 220)
    return () => clearInterval(id)
  }, [fpsTarget, modded])

  const fps = hist[hist.length - 1] || fpsTarget
  const maxY = 260
  const pts = hist.map((v, i) => `${(i / (hist.length - 1)) * 100},${40 - (Math.min(v, maxY) / maxY) * 38}`).join(' ')

  return (
    <Section id="mods" accent={DIVISIONS.mods.accent}>
      <SectionHeader
        label="KODEXAR // MODS — Para Cualquier Juego"
        title="Banco de pruebas multi-motor."
        desc="Java, C++, Lua, Luau y C#. Arrastra el comparador para ver la diferencia entre el juego original y un mod de Kodexar, y mide el rendimiento en vivo."
      >
        <Segmented
          label="Ecosistema"
          value={ecoId}
          onChange={(v) => { setEcoId(v); setGame(0) }}
          options={ECOSYSTEMS.map((e) => ({ value: e.id, label: e.tab }))}
        />
      </SectionHeader>

      <Reveal delay={80} className="mb-4 flex flex-wrap gap-2">
        {eco.games.map((g, i) => (
          <button
            key={g}
            onClick={() => setGame(i)}
            className={`rounded-full border px-3 py-1.5 font-mono text-xs transition ${
              game === i ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-amber-200' : 'border-line text-mute hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </Reveal>

      <Reveal delay={160} className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Panel glow={false} className="overflow-hidden">
          <div className="relative aspect-[16/9] select-none">
            <Scene modded={false} opts={opts} eco={{ ...eco, games: [eco.games[game]] }} />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
              <Scene modded opts={opts} eco={eco} />
              {opts.hud && (
                <div className="absolute top-3 right-3 rounded-lg border border-amber-400/40 bg-black/60 px-3 py-2 font-mono text-[11px] text-amber-200 backdrop-blur">
                  KODEXAR MODDED · {eco.games[game]}
                  <div className="mt-1 flex gap-3 text-white"><span>❤ 100</span><span>⚡ 84</span><span>🪙 2,450</span></div>
                </div>
              )}
            </div>
            <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_white]" style={{ left: `${split}%` }}>
              <span className="absolute top-1/2 left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-obsidian shadow-lg">
                <MoveHorizontal className="size-4" />
              </span>
            </div>
            <input
              type="range" min="0" max="100" value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              aria-label="Comparador Vanilla vs Kodexar Modded"
              className="absolute inset-0 size-full cursor-ew-resize opacity-0"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-line p-3">
            <span className="mr-1 font-mono text-[11px] text-mute">MÓDULOS:</span>
            {MODS.map((m) => (
              <label key={m.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-xs text-zinc-300 hover:border-line-strong">
                <input
                  type="checkbox"
                  checked={opts[m.id]}
                  onChange={() => setOpts((o) => ({ ...o, [m.id]: !o[m.id] }))}
                  className="accent-[var(--accent)]"
                />
                {m.label}
              </label>
            ))}
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel className="p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-mono text-xs text-mute"><Gauge className="size-4 text-[var(--accent)]" /> MONITOR DE RENDIMIENTO</p>
              <Segmented size="sm" label="Modo" value={mode} onChange={setMode} options={[{ value: 'vanilla', label: 'Vanilla' }, { value: 'modded', label: 'Modded' }]} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-line bg-obsidian p-3">
                <p className="text-[11px] text-mute">FPS</p>
                <p className="font-mono text-2xl font-bold text-white">{fps}</p>
                <p className={`font-mono text-[11px] ${modded ? 'text-amber-300' : 'text-mute'}`}>{modded ? '+144 FPS' : 'base'}</p>
              </div>
              <div className="rounded-xl border border-line bg-obsidian p-3">
                <p className="flex items-center gap-1 text-[11px] text-mute"><Cpu className="size-3" /> CPU/tick</p>
                <p className="font-mono text-2xl font-bold text-white">{modded ? '0.01' : eco.base.cpu.toFixed(2)}</p>
                <p className="font-mono text-[11px] text-mute">ms</p>
              </div>
              <div className="rounded-xl border border-line bg-obsidian p-3">
                <p className="flex items-center gap-1 text-[11px] text-mute"><MemoryStick className="size-3" /> RAM</p>
                <p className="font-mono text-2xl font-bold text-white">{(modded ? eco.base.ram * 0.62 : eco.base.ram).toFixed(1)}</p>
                <p className="font-mono text-[11px] text-mute">GB</p>
              </div>
            </div>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mt-3 h-24 w-full rounded-lg border border-line bg-obsidian">
              <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
              <line x1="0" x2="100" y1={40 - (60 / maxY) * 38} y2={40 - (60 / maxY) * 38} stroke="rgba(255,255,255,0.15)" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
            </svg>
            <p className="mt-2 font-mono text-[10px] text-mute">— línea punteada: 60 FPS</p>
          </Panel>

          <Panel className="flex-1 overflow-hidden">
            <p className="flex items-center gap-2 border-b border-line px-4 py-2.5 font-mono text-xs text-mute">
              <span className="size-2 rounded-full bg-[var(--accent)]" /> {eco.file}
            </p>
            <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-zinc-300 scroll-thin">{eco.code}</pre>
          </Panel>
        </div>
      </Reveal>
    </Section>
  )
}
