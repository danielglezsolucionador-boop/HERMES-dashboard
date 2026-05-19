path = r"app\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old_start = "function HermesLogo({ size = 40 }: { size?: number }) {"
old_end = "\nconst SC: any = {"

start_idx = content.find(old_start)
end_idx = content.find(old_end)

new_logo = '''function HermesLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <radialGradient id="core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6"/>
          <stop offset="100%" stopColor="#1E293B"/>
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
        </radialGradient>
        <filter id="blur1">
          <feGaussianBlur stdDeviation="1.2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer glow */}
      <circle cx="40" cy="40" r="38" fill="url(#glow)"/>

      {/* Base dark circle */}
      <circle cx="40" cy="40" r="36" fill="#0A0F1E"/>

      {/* Orbital ring 1 */}
      <circle cx="40" cy="40" r="30" stroke="#1E293B" strokeWidth="1" fill="none"/>

      {/* Orbital ring 2 */}
      <circle cx="40" cy="40" r="22" stroke="#2563EB" strokeWidth="0.8" strokeOpacity="0.5" fill="none" strokeDasharray="3 4"/>

      {/* Orbital ring 3 */}
      <circle cx="40" cy="40" r="14" stroke="#3B82F6" strokeWidth="0.8" strokeOpacity="0.7" fill="none"/>

      {/* Core */}
      <circle cx="40" cy="40" r="7" fill="url(#core)" filter="url(#blur1)"/>
      <circle cx="40" cy="40" r="4" fill="#93C5FD"/>

      {/* Orbital nodes */}
      <circle cx="40" cy="10" r="2" fill="#3B82F6" opacity="0.9"/>
      <circle cx="70" cy="40" r="1.5" fill="#3B82F6" opacity="0.7"/>
      <circle cx="40" cy="70" r="2" fill="#2563EB" opacity="0.8"/>
      <circle cx="10" cy="40" r="1.5" fill="#3B82F6" opacity="0.6"/>

      {/* Connector lines to nodes */}
      <line x1="40" y1="14" x2="40" y2="26" stroke="#3B82F6" strokeWidth="0.6" strokeOpacity="0.4"/>
      <line x1="66" y1="40" x2="62" y2="40" stroke="#3B82F6" strokeWidth="0.6" strokeOpacity="0.4"/>
      <line x1="40" y1="66" x2="40" y2="54" stroke="#3B82F6" strokeWidth="0.6" strokeOpacity="0.4"/>
      <line x1="14" y1="40" x2="18" y2="40" stroke="#3B82F6" strokeWidth="0.6" strokeOpacity="0.4"/>

      {/* Diagonal nodes */}
      <circle cx="61" cy="19" r="1.5" fill="#93C5FD" opacity="0.5"/>
      <circle cx="19" cy="61" r="1.5" fill="#93C5FD" opacity="0.5"/>
    </svg>
  );
}

'''

content = content[:start_idx] + new_logo + content[end_idx:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK")