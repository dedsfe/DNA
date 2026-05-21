import re

with open('/Users/andrefelipe/.gemini/antigravity/brain/6559c594-dfa7-4216-8beb-e0890ed67c20/artifacts/task.md', 'r') as f:
    content = f.read()

content = content.replace('- [ ]', '- [x]')
content = content.replace('- [x] Atualizar fontes para Inter e system-ui', '- [x] Atualizar fontes para Inter e system-ui')

with open('/Users/andrefelipe/.gemini/antigravity/brain/6559c594-dfa7-4216-8beb-e0890ed67c20/artifacts/task.md', 'w') as f:
    f.write(content)
