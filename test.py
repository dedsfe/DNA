import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's see if :root is redefined anywhere
matches = re.findall(r':root\s*\{.*?\}', content, flags=re.DOTALL)
print(f"Found {len(matches)} :root blocks")

# Let's print the first one
if matches:
    print(matches[0][:500])

