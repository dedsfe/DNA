import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any color starting with #1... #2... or #3... if it's not a variable
content = re.sub(r'color:\s*#[1-4][0-9a-fA-F]{5};', 'color: var(--ink-primary);', content)

# Replace remaining rgba(10, 22, 40, ...)
content = re.sub(r'color:\s*rgba\(\s*10\s*,\s*22\s*,\s*40\s*,\s*0\.[0-9]+\s*\);', 'color: var(--ink-secondary);', content)
content = re.sub(r'border:\s*1.5px solid rgba\(\s*10\s*,\s*22\s*,\s*40\s*,\s*0\.[0-9]+\s*\);', 'border: 1.5px solid var(--border-color);', content)

with open('proposta.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
