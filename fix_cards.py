import re

with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'delay={0.12} sub={${runtime.backlog.doing} doing',
    'delay={0.12} onClick={() => setTaskFilter(taskFilter === "doing" ? null : "doing")} sub={${runtime.backlog.doing} doing'
)
content = content.replace(
    'delay={0.18} sub={runtime.stuck_tasks',
    'delay={0.18} onClick={() => setTaskFilter(taskFilter === "failed" ? null : "failed")} sub={runtime.stuck_tasks'
)
content = content.replace(
    'delay={0.06} sub={${runtime.total_success}',
    'delay={0.06} onClick={() => setTaskFilter(taskFilter === "done" ? null : "done")} sub={${runtime.total_success}'
)

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Listo')
