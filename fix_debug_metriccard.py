path = r"app\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("whileHover={{ y: -3")
print(repr(content[idx:idx+300]))