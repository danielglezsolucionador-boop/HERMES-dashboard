with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    ': tasks.slice(0,10).map((t,i)',
    ': filteredTasks.slice(0,10).map((t,i)'
)
content = content.replace(
    'tasks.length === 0',
    'filteredTasks.length === 0'
)

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Listo')
