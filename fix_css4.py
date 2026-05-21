import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any rgba(10, 22, 40, 0.7x) with var(--ink-secondary)
content = re.sub(r'color:\s*rgba\(\s*10\s*,\s*22\s*,\s*40\s*,\s*0\.[678]\d*\s*\);', 'color: var(--ink-secondary);', content)

with open('proposta.html', 'w', encoding='utf-8') as f:
    f.write(content)
