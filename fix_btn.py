import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for .accept-btn block
m = re.search(r'\.accept-btn\s*\{.*?\}', content, flags=re.DOTALL)
if m:
    print(m.group(0))

