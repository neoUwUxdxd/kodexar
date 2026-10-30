// ─────────────────────────────────────────────────────────────
//  KODEXAR — Archivo central de datos
//  Edita aquí nombre, correo, precios, tasas y catálogo.
// ─────────────────────────────────────────────────────────────

export const BRAND = {
  name: 'KODEXAR',
  owner: 'Yamil',
  role: 'Ingeniero de Software Políglota',
  email: 'kodexar@icloud.com',
  // Número de WhatsApp que recibe los pedidos (solo dígitos, con lada de país).
  whatsapp: '525565304301',
  whatsappDisplay: '+52 56 5530 4301',
  tagline: 'Si se puede imaginar, Kodexar lo programa',
  available: true,
  storageKey: 'kodexar:orders',
}

// Todos los precios se definen en MXN; USD se calcula con esta tasa.
export const PRICING = {
  defaultCurrency: 'MXN',
  mxnPerUsd: 18.5,
  paymentNote:
    'Pago preferente vía Transferencia Bancaria (SPEI México) y disponible en USD internacional',
}

export const DIVISIONS = {
  web: { id: 'web', label: 'KODEXAR // WEB', short: 'Desarrollo Web', accent: '#10B981', emoji: '🌐' },
  bots: { id: 'bots', label: 'KODEXAR // BOTS', short: 'Discord Bots', accent: '#5865F2', emoji: '🤖' },
  mods: { id: 'mods', label: 'KODEXAR // MODS', short: 'Mods Multi-Juego', accent: '#F59E0B', emoji: '🎮' },
  core: { id: 'core', label: 'KODEXAR // CORE', short: 'Ingeniería Políglota', accent: '#8B5CF6', emoji: '⚡' },
}

export const PAYMENT_METHODS = [
  {
    id: 'SPEI',
    flag: '🇲🇽',
    title: 'Transferencia Bancaria en Pesos Mexicanos (SPEI)',
    badge: 'Preferente',
    desc: 'Liquidación inmediata entre bancos mexicanos. Yamil te enviará la CLABE al confirmar.',
    currency: 'MXN',
  },
  {
    id: 'USD',
    flag: '🇺🇸',
    title: 'Pago en Dólares (USD)',
    badge: 'Internacional',
    desc: 'Para clientes fuera de México. Recibirás los datos de pago internacional por correo.',
    currency: 'USD',
  },
]

// Catálogo del cotizador. price en MXN, days = días hábiles añadidos.
export const CATALOG = [
  {
    id: 'web',
    division: 'web',
    emoji: '🌐',
    title: 'Página Web',
    desc: 'Landing, sitio corporativo, e-commerce o SaaS de alta conversión.',
    basePrice: 4500,
    baseDays: 6,
    features: [
      { id: 'pages', label: 'Hasta 5 secciones / páginas', price: 1500, days: 2 },
      { id: 'booking', label: 'Sistema de citas y reservas', price: 3200, days: 3 },
      { id: 'shop', label: 'E-commerce + pasarela de pago', price: 5500, days: 5 },
      { id: 'admin', label: 'Panel de administración', price: 4200, days: 4 },
      { id: 'seo', label: 'SEO técnico + Analytics', price: 1800, days: 1 },
      { id: 'i18n', label: 'Multi-idioma (ES / EN)', price: 1400, days: 1 },
      { id: 'motion', label: 'Animaciones premium e interacciones', price: 2200, days: 2 },
      { id: 'cms', label: 'Blog / CMS autogestionable', price: 2600, days: 2 },
    ],
  },
  {
    id: 'bot',
    division: 'bots',
    emoji: '🤖',
    title: 'Bot de Discord',
    desc: 'Cualquier función: ventas, economía, moderación IA, puentes con juegos.',
    basePrice: 1800,
    baseDays: 3,
    features: [
      { id: 'tickets', label: 'Tickets de ventas y soporte', price: 1200, days: 1 },
      { id: 'economy', label: 'Economía + casino', price: 1600, days: 2 },
      { id: 'bridge', label: 'Puente con servidor de juego', price: 2400, days: 3 },
      { id: 'ai', label: 'Moderación con IA', price: 2800, days: 3 },
      { id: 'panel', label: 'Panel web de configuración', price: 3500, days: 4 },
      { id: 'levels', label: 'Niveles, XP y rankings', price: 900, days: 1 },
      { id: 'music', label: 'Música y audio', price: 1100, days: 1 },
      { id: 'hosting', label: 'Despliegue 24/7 + monitoreo', price: 800, days: 1 },
    ],
  },
  {
    id: 'mod',
    division: 'mods',
    emoji: '🎮',
    title: 'Mod para Juego',
    desc: 'Minecraft, FiveM, Roblox, Skyrim, Unity, Rust… cualquier motor.',
    basePrice: 2500,
    baseDays: 4,
    requiresGame: true,
    features: [
      { id: 'mechanics', label: 'Nuevas mecánicas de juego', price: 2200, days: 3 },
      { id: 'items', label: 'Items, armas o vehículos custom', price: 1800, days: 2 },
      { id: 'npc', label: 'NPCs con IA / comportamiento', price: 2600, days: 3 },
      { id: 'hud', label: 'UI / HUD personalizada', price: 1500, days: 2 },
      { id: 'perf', label: 'Optimización de rendimiento', price: 2000, days: 2 },
      { id: 'mp', label: 'Sincronización multijugador', price: 3000, days: 4 },
      { id: 'discord', label: 'Integración con Discord', price: 1200, days: 1 },
      { id: 'anticheat', label: 'Anti-cheat / protección', price: 2400, days: 3 },
    ],
  },
  {
    id: 'software',
    division: 'core',
    emoji: '⚡',
    title: 'Software a Medida',
    desc: 'APIs, automatizaciones, apps de escritorio e integraciones en cualquier lenguaje.',
    basePrice: 6000,
    baseDays: 8,
    features: [
      { id: 'api', label: 'API REST / GraphQL', price: 3500, days: 3 },
      { id: 'db', label: 'Diseño de base de datos', price: 2200, days: 2 },
      { id: 'automation', label: 'Automatización / scraping', price: 2800, days: 3 },
      { id: 'desktop', label: 'App de escritorio', price: 5200, days: 5 },
      { id: 'llm', label: 'Integración con IA (LLMs)', price: 3800, days: 3 },
      { id: 'dash', label: 'Dashboard de métricas', price: 3000, days: 3 },
      { id: 'auth', label: 'Autenticación y roles', price: 1900, days: 2 },
      { id: 'cloud', label: 'Despliegue cloud + CI/CD', price: 2100, days: 2 },
    ],
  },
]

export const LANGUAGES = [
  { id: 'ts', name: 'TypeScript / JS', level: 98, color: '#3178C6', uses: ['Frontends', 'Bots', 'APIs'], snippet: "const kodexar = (idea: string) =>\n  ship(idea, { fast: true, limits: 0 });" },
  { id: 'py', name: 'Python', level: 95, color: '#3776AB', uses: ['IA', 'Automatización', 'Scraping'], snippet: "def kodexar(idea):\n    return ship(idea, limits=None)" },
  { id: 'java', name: 'Java', level: 92, color: '#E76F00', uses: ['Minecraft', 'Backend', 'Android'], snippet: "public Mod kodexar(String idea) {\n  return Forge.ship(idea);\n}" },
  { id: 'cpp', name: 'C++', level: 90, color: '#00599C', uses: ['Unreal', 'Skyrim SKSE', 'Motores'], snippet: "auto kodexar(std::string idea) {\n  return engine::inject(idea);\n}" },
  { id: 'cs', name: 'C#', level: 93, color: '#9B4F96', uses: ['Unity', 'Terraria', 'Rust (uMod)'], snippet: "public void Kodexar(string idea) =>\n  Harmony.Patch(idea);" },
  { id: 'lua', name: 'Lua / Luau', level: 96, color: '#2C2D72', uses: ['FiveM', 'Roblox', "Garry's Mod"], snippet: "local function kodexar(idea)\n  return Citizen.Ship(idea)\nend" },
  { id: 'rs', name: 'Rust', level: 85, color: '#DEA584', uses: ['CLIs', 'Alto rendimiento', 'WASM'], snippet: "fn kodexar(idea: &str) -> Ship {\n    Ship::new(idea).blazing()\n}" },
  { id: 'sql', name: 'SQL', level: 94, color: '#F29111', uses: ['PostgreSQL', 'MySQL', 'Analítica'], snippet: "SELECT idea, 'shipped' AS status\nFROM kodexar WHERE limits IS NULL;" },
  { id: 'react', name: 'React', level: 97, color: '#61DAFB', uses: ['SPAs', 'Dashboards', 'Next.js'], snippet: "<Kodexar idea={idea}\n  onShip={() => grow()} />" },
  { id: 'node', name: 'Node.js', level: 96, color: '#5FA04E', uses: ['APIs', 'Discord.js', 'Realtime'], snippet: "app.post('/idea', (req, res) =>\n  res.json(kodexar(req.body)));" },
]

export const STATS = [
  { value: '10+', label: 'Lenguajes dominados' },
  { value: '4', label: 'Divisiones de ingeniería' },
  { value: '24h', label: 'Respuesta a solicitudes' },
  { value: '∞', label: 'Juegos soportados' },
]
