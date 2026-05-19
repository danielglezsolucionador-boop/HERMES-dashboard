path = r"app\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old_start = "function HermesLogo({ size = 40 }: { size?: number }) {"
old_end = "}\n\nconst SC: any = {"

start_idx = content.find(old_start)
end_idx = content.find(old_end)

assert start_idx != -1, "Logo start no encontrado"
assert end_idx != -1, "Logo end no encontrado"

new_logo = '''function HermesLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="hg1" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6"/>
          <stop offset="1" stopColor="#6366f1"/>
        </linearGradient>
        <linearGradient id="hg2" x1="80" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1"/>
          <stop offset="1" stopColor="#0d9488"/>
        </linearGradient>
        <filter id="glow1">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Base circle */}
      <circle cx="40" cy="40" r="38" fill="white" stroke="url(#hg1)" strokeWidth="1.5"/>

      {/* Thinking arc - abstract head bowed forward */}
      <path d="M22 28 Q22 14 40 14 Q58 14 58 28 Q58 40 46 44 Q44 45 44 47"
        stroke="url(#hg1)" strokeWidth="2.5" strokeLinecap="round" fill="none" filter="url(#glow1)"/>

      {/* Chin rest - hand/fist suggestion, pure geometric */}
      <path d="M36 52 Q34 50 34 47 Q34 44 38 44 Q50 44 50 44"
        stroke="url(#hg2)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="36" cy="54" r="4" stroke="url(#hg2)" strokeWidth="2" fill="none"/>

      {/* Neural pulse - thought emanating */}
      <circle cx="55" cy="22" r="2.5" fill="url(#hg1)" opacity="0.6"/>
      <circle cx="62" cy="16" r="3.5" fill="url(#hg1)" opacity="0.4" filter="url(#glow1)"/>
      <circle cx="58" cy="30" r="1.5" fill="url(#hg2)" opacity="0.5"/>

      {/* Connecting dots - thought chain */}
      <line x1="55" y1="22" x2="62" y2="16" stroke="url(#hg1)" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="2 2"/>

      {/* Subtle base line */}
      <path d="M28 64 Q40 68 52 64" stroke="url(#hg1)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
    </svg>
  );
}

'''

content = content[:start_idx] + new_logo + content[end_idx:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK")