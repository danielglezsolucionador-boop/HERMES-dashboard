path = r"app\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old = '''    </svg>
  );
}

}

const SC'''

new = '''    </svg>
  );
}

const SC'''

assert old in content, "Fragmento no encontrado"
content = content.replace(old, new, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK")