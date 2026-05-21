import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's extract typography, spacing and button classes to see what might look weird
targets = [
    r'\.proposal-title\s*\{.*?\}',
    r'\.section-title\s*\{.*?\}',
    r'\.metric-value\s*\{.*?\}',
    r'\.metric-label\s*\{.*?\}',
    r'\.scope-title\s*\{.*?\}',
    r'\.scope-desc\s*\{.*?\}',
    r'\.accept-btn\s*\{.*?\}',
    r'\.scope-card\s*\{.*?\}',
    r'\.metrics-grid\s*\{.*?\}',
    r'\.page-wrapper\s*\{.*?\}'
]

for t in targets:
    m = re.search(t, content, flags=re.DOTALL)
    if m:
        print(m.group(0))
        print('-'*40)

