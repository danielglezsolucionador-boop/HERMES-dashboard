with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const { tasks } = useTasks(10000);
  const [taskFilter, setTaskFilter] = useState<string|null>(null);
  const filteredTasks = taskFilter ? tasks.filter((t:any) => t.status === taskFilter) \n: tasks;',
    'const { tasks } = useTasks(10000);\n  const [taskFilter, setTaskFilter] = useState<string|null>(null);\n  const filteredTasks = taskFilter ? tasks.filter((t:any) => t.status === taskFilter) : tasks;'
)

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Listo')
