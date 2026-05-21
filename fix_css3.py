import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

media_old = """.metrics-grid, .objectives-grid, .signature-header { grid-template-columns: 1fr !important; }"""
media_new = """.metrics-grid, .objectives-grid, .signature-header, .notes-columns, .signature-meta-grid { grid-template-columns: 1fr !important; }"""
content = content.replace(media_old, media_new)

with open('proposta.html', 'w', encoding='utf-8') as f:
    f.write(content)
