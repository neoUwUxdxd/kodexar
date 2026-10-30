import { useEffect, useRef, useState } from 'react'

// Aparece con fade + desenfoque + desplazamiento al entrar en pantalla (una sola vez).
export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-visible={shown || undefined}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function Panel({ as: Tag = 'div', className = '', glow = true, children, ...rest }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <Tag onMouseMove={glow ? onMove : undefined} className={`panel ${glow ? 'glow' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

export function Section({ id, accent, className = '', children }) {
  return (
    <section id={id} style={{ '--accent': accent }} className={`relative scroll-mt-24 px-4 py-24 sm:px-6 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

export function SectionHeader({ label, title, desc, children }) {
  return (
    <Reveal className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[var(--accent)]">
          <span className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
          {label}
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
        {desc && <p className="mt-4 text-base leading-relaxed text-mute sm:text-lg">{desc}</p>}
      </div>
      {children}
    </Reveal>
  )
}

export function Segmented({ options, value, onChange, size = 'md', label }) {
  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-xl border border-line bg-obsidian/60 p-1">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-2 rounded-lg font-medium transition ${pad} ${
              active ? 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]' : 'text-mute hover:text-white'
            }`}
          >
            {o.icon}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
