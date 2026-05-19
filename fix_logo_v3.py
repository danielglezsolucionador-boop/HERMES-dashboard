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
        <linearGradient id="hg1" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e293b"/>
          <stop offset="1" stopColor="#0f172a"/>
        </linearGradient>
        <linearGradient id="hg2" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6"/>
          <stop offset="1" stopColor="#6366f1"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Dark circle base */}
      <circle cx="40" cy="40" r="38" fill="url(#hg1)"/>
      <circle cx="40" cy="40" r="38" stroke="url(#hg2)" strokeWidth="1" strokeOpacity="0.4" fill="none"/>

      {/* H letter - bold geometric */}
      <rect x="20" y="22" width="7" height="36" rx="2" fill="white"/>
      <rect x="53" y="22" width="7" height="36" rx="2" fill="white"/>
      <rect x="20" y="36" width="40" height="7" rx="2" fill="white"/>

      {/* Accent dot - pulse of intelligence */}
      <circle cx="58" cy="20" r="5" fill="url(#hg2)" filter="url(#glow)"/>
      <circle cx="58" cy="20" r="2.5" fill="white" opacity="0.9"/>
    </svg>
  );
}

'''

content = content[:start_idx] + new_logo + content[end_idx:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK")