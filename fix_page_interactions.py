path = r"app\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1 — sacar onClick del style y ponerlo en el div
old1 = """      whileHover={{ y: -3, boxShadow: elevationHover, transition: { duration: 0.18 } }}
      style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 18, padding: "22px 24px",
        boxShadow: elevation1,
        backdropFilter: "blur(16px)", onClick,
        cursor: onClick ? "pointer" : "default",
      }}"""

new1 = """      whileHover={{ y: -3, boxShadow: elevationHover, transition: { duration: 0.18 } }}
      onClick={onClick}
      style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 18, padding: "22px 24px",
        boxShadow: elevation1,
        backdropFilter: "blur(16px)",
        cursor: onClick ? "pointer" : "default",
      }}"""

assert old1 in content, "Fix 1 no encontrado"
content = content.replace(old1, new1, 1)

# Fix 2 — t.name -> t.title
old2 = """{t.name}</span>"""
new2 = """{t.title}</span>"""
assert old2 in content, "Fix 2 no encontrado"
content = content.replace(old2, new2, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK")