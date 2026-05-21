import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find responsive media queries
matches = re.finditer(r'@media\s*\(max-width:\s*\d+px\)\s*\{.*?\}', content, flags=re.DOTALL)
for i, m in enumerate(matches):
    print(f"Media query {i}:")
    lines = m.group(0).split('\n')
    print('\n'.join(lines[:10]))
    print('...')
    print('\n'.join(lines[-3:]))
    print('-'*50)

