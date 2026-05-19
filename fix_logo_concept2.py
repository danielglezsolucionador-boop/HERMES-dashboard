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
          <stop offset="0%" stopColor="#60A5FA"/>
          <stop offset="60%" stopColor="#2563EB"/>
          <stop offset="100%" stopColor="#1E3A8A"/>
        </radialGradient>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0F1E3D"/>
          <stop offset="100%" stopColor="#050A14"/>
        </radialGradient>
        <radialGradient id="glowRad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
        </radialGradient>
        <filter id="coreGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="ringGlow">
          <feGaussianBlur stdDeviation="0.8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer ambient glow */}
      <circle cx="40" cy="40" r="40" fill="url(#glowRad)" opacity="0.6"/>

      {/* Base */}
      <circle cx="40" cy="40" r="37" fill="url(#bgGrad)"/>

      {/* Outer border ring */}
      <circle cx="40" cy="40" r="36" stroke="#1E3A8A" strokeWidth="0.8" fill="none" strokeOpacity="0.8"/>

      {/* Ring 1 - outer orbit */}
      <circle cx="40" cy="40" r="29" stroke="#1D4ED8" strokeWidth="0.7" fill="none" strokeOpacity="0.6" filter="url(#ringGlow)"/>

      {/* Ring 2 - middle orbit dashed */}
      <circle cx="40" cy="40" r="21" stroke="#2563EB" strokeWidth="0.8" fill="none" strokeOpacity="0.7" strokeDasharray="4 3" filter="url(#ringGlow)"/>

      {/* Ring 3 - inner orbit */}
      <circle cx="40" cy="40" r="13" stroke="#3B82F6" strokeWidth="1" fill="none" strokeOpacity="0.9" filter="url(#ringGlow)"/>

      {/* Inner fill subtle */}
      <circle cx="40" cy="40" r="13" fill="#0F172A" fillOpacity="0.8"/>

      {/* Core pulsing center */}
      <circle cx="40" cy="40" r="8" fill="url(#core)" filter="url(#coreGlow)"/>
      <circle cx="40" cy="40" r="4.5" fill="#93C5FD" opacity="0.95"/>
      <circle cx="40" cy="40" r="2" fill="white"/>

      {/* Cardinal nodes on ring 1 */}
      <circle cx="40" cy="11" r="2.5" fill="#3B82F6" filter="url(#ringGlow)"/>
      <circle cx="69" cy="40" r="2" fill="#2563EB" filter="url(#ringGlow)"/>
      <circle cx="40" cy="69" r="2.5" fill="#3B82F6" filter="url(#ringGlow)"/>
      <circle cx="11" cy="40" r="2" fill="#2563EB" filter="url(#ringGlow)"/>

      {/* Diagonal nodes on ring 2 */}
      <circle cx="55" cy="25" r="1.5" fill="#60A5FA" opacity="0.7"/>
      <circle cx="55" cy="55" r="1.5" fill="#60A5FA" opacity="0.7"/>
      <circle cx="25" cy="55" r="1.5" fill="#60A5FA" opacity="0.7"/>
      <circle cx="25" cy="25" r="1.5" fill="#60A5FA" opacity="0.7"/>

      {/* Connector lines - cardinal */}
      <line x1="40" y1="13" x2="40" y2="27" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.5"/>
      <line x1="67" y1="40" x2="61" y2="40" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.5"/>
      <line x1="40" y1="67" x2="40" y2="53" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.5"/>
      <line x1="13" y1="40" x2="19" y2="40" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.5"/>
    </svg>
  );
}

'''

content = content[:start_idx] + new_logo + content[end_idx:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK")