/**
 * Liquid-glass surface — frosted, refractive, with a bright top sheen and a
 * slow specular sweep, like an iOS control. Cheap: it's static (no per-frame
 * work) and only used in the hero, so the backdrop-blur is paid once.
 */
export default function Glass({ as = 'div', className = '', children, sheen = true, ...rest }) {
  const Tag = as
  return (
    <Tag
      className={`group/glass relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(150deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))',
        backdropFilter: 'blur(14px) saturate(150%)',
        WebkitBackdropFilter: 'blur(14px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(255,255,255,0.06), 0 10px 30px -12px rgba(0,0,0,0.55)',
      }}
      {...rest}
    >
      {/* moving specular highlight */}
      {sheen && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-sheen"
          style={{
            background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.22) 48%, transparent 62%)',
            backgroundSize: '250% 100%',
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </Tag>
  )
}
