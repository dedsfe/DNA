import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's print the CSS block for .proposal-title
match = re.search(r'\.proposal-title\s*\{.*?\}', content, flags=re.DOTALL)
if match:
    print(".proposal-title:")
    print(match.group(0))

match2 = re.search(r'\.metric-value\s*\{.*?\}', content, flags=re.DOTALL)
if match2:
    print(".metric-value:")
    print(match2.group(0))

match3 = re.search(r'body\s*\{.*?\}', content, flags=re.DOTALL)
if match3:
    print("body:")
    print(match3.group(0))

