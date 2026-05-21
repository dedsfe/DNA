import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'@media\s*print\s*\{.*?\}', content, flags=re.DOTALL)
if match:
    # Print the first 50 lines of the print media query
    print('\n'.join(match.group(0).split('\n')[:50]))
    print('...')
    # Print the last 20 lines
    print('\n'.join(match.group(0).split('\n')[-20:]))

