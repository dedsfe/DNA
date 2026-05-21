import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# .proposal-title was white, let's fix it
content = re.sub(r'\.proposal-title\s*\{.*?\}', r'.proposal-title { font-size: clamp(3rem, 7vw, 5rem); font-weight: 800; color: var(--text-primary); letter-spacing: -0.04em; margin-bottom: 2rem; line-height: 1.05; }', content, flags=re.DOTALL)

# .proposal-meta
content = re.sub(r'\.proposal-meta\s*\{.*?\}', r'.proposal-meta { font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: var(--accent-blue); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }', content, flags=re.DOTALL)

# Let's fix .metric-value highlight-gold to be normal or bold, not necessarily italic, but let's make it readable.
content = re.sub(r'\.metric-value\.highlight-gold\s*\{.*?\}', r'.metric-value.highlight-gold { color: var(--accent-gold); font-size: 2.1rem; font-weight: 700; font-style: normal; }', content, flags=re.DOTALL)

# .brand-logo
content = re.sub(r'\.brand-logo\s*\{.*?\}', r'.brand-logo { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.05em; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem; }', content, flags=re.DOTALL)

# .brand-tag
content = re.sub(r'\.brand-tag\s*\{.*?\}', r'.brand-tag { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-secondary); margin-top: 0.5rem; }', content, flags=re.DOTALL)

# Make sure .section-title is readable
content = re.sub(r'\.section-title\s*\{.*?\}', r'.section-title { font-size: 2.5rem; font-weight: 800; color: var(--accent-blue); letter-spacing: -0.03em; margin-bottom: 2.5rem; }', content, flags=re.DOTALL)

# Remove background gradient from .proposal-title if it existed
content = content.replace("background: linear-gradient(135deg, var(--accent-blue) 0%, var(--text-primary) 100%); -webkit-background-clip: text;", "color: var(--text-primary);")

with open('proposta.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
