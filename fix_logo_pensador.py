path = r"app\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old = '''function HermesLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6"/>
          <stop offset="0.5" stopColor="#6366f1"/>
          <stop offset="1" stopColor="#0d9488"/>
        </linearGradient>
        <filter id="hglow">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="19" fill="white" stroke="url(#hg)" strokeWidth="1.5"/>
      <circle cx="20" cy="14" r="5" stroke="url(#hg)" strokeWidth="1.8" fill="none" filter="url(#hglow)"/>
      <circle cx="20" cy="14" r="2" fill="url(#hg)"/>
      <path d="M10 33c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="url(#hg)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}'''

new = '''function HermesLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="hg1" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6"/>
          <stop offset="0.5" stopColor="#6366f1"/>
          <stop offset="1" stopColor="#0d9488"/>
        </linearGradient>
        <linearGradient id="hg2" x1="20" y1="10" x2="60" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" stopOpacity="0.9"/>
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0.6"/>
        </linearGradient>
        <radialGradient id="hglow2" cx="40" cy="30" r="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" stopOpacity="0.15"/>
          <stop offset="1" stopColor="#6366f1" stopOpacity="0"/>
        </radialGradient>
        <filter id="hf1" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hf2" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle cx="40" cy="40" r="38" fill="white" stroke="url(#hg1)" strokeWidth="1.5" opacity="0.9"/>
      <circle cx="40" cy="40" r="38" fill="url(#hglow2)"/>

      {/* Inner ring subtle */}
      <circle cx="40" cy="40" r="32" stroke="url(#hg1)" strokeWidth="0.5" strokeOpacity="0.2" fill="none"/>

      {/* Head - El Pensador reinterpretado */}
      <ellipse cx="40" cy="22" rx="10" ry="11" fill="url(#hg2)" filter="url(#hf1)" opacity="0.95"/>

      {/* Face details - circuits */}
      <circle cx="37" cy="20" r="1.5" fill="white" opacity="0.7"/>
      <circle cx="43" cy="20" r="1.5" fill="white" opacity="0.7"/>
      <path d="M36 24 Q40 26 44 24" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6"/>

      {/* Thinking pose - arm/hand on chin */}
      <path d="M30 33 Q28 36 30 39 Q32 41 35 40" stroke="url(#hg1)" strokeWidth="2" strokeLinecap="round" fill="none" filter="url(#hf1)"/>
      <ellipse cx="36" cy="41" rx="3" ry="2.5" fill="url(#hg1)" opacity="0.8"/>

      {/* Body - torso */}
      <path d="M32 33 Q28 42 30 54 Q34 58 40 58 Q46 58 50 54 Q52 42 48 33" fill="url(#hg2)" opacity="0.85"/>

      {/* Elbow resting */}
      <path d="M30 44 Q26 48 28 52" stroke="url(#hg1)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

      {/* Neural/circuit lines - emanating from head */}
      <line x1="40" y1="11" x2="40" y2="6" stroke="url(#hg1)" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="2 2"/>
      <line x1="50" y1="14" x2="54" y2="10" stroke="url(#hg1)" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2"/>
      <line x1="30" y1="14" x2="26" y2="10" stroke="url(#hg1)" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2"/>

      {/* Thought dots */}
      <circle cx="52" cy="18" r="1.5" fill="url(#hg1)" opacity="0.5"/>
      <circle cx="56" cy="14" r="2" fill="url(#hg1)" opacity="0.4"/>
      <circle cx="61" cy="10" r="2.5" fill="url(#hg1)" opacity="0.3" filter="url(#hf2)"/>

      {/* Bottom accent line */}
      <path d="M24 62 Q40 66 56 62" stroke="url(#hg1)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
    </svg>
  );
}'''

assert old in content, "Logo no encontrado"
content = content.replace(old, new, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK")