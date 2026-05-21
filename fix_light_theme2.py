import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Let's make text-secondary darker, because 0.65 is too light on white background
content = content.replace("rgba(10, 22, 40, 0.65)", "rgba(10, 22, 40, 0.8)")
content = content.replace("rgba(10, 22, 40, 0.4)", "rgba(10, 22, 40, 0.6)")

# 2. What about the buttons? "Aceitar Proposta" is super washed out!
# .btn-primary probably has a transparent background or white background.
# In the original dark theme, .btn-primary background was `#ffffff` so it became `var(--text-primary)` from my replacement? Or maybe it was `var(--text-primary)` which is now `#0a1628`? But in the screenshot it looks very light gray.
content = re.sub(r'\.btn-primary\s*\{.*?(background-color:|background:).*?\}', r'.btn-primary { background: var(--accent-blue); color: #ffffff; border: none; font-weight: 600; }', content, flags=re.DOTALL)

# 3. .btn-secondary
content = re.sub(r'\.btn-secondary\s*\{.*?(background-color:|background:).*?\}', r'.btn-secondary { background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-hover); font-weight: 500; }', content, flags=re.DOTALL)

# 4. Signature pad area
content = content.replace("background: rgba(255, 255, 255, 0.03);", "background: rgba(10, 22, 40, 0.05);")
content = content.replace("border: 1px dashed rgba(255, 255, 255, 0.15);", "border: 1px dashed rgba(10, 22, 40, 0.2);")
# The signature canvas background was white in dark mode? Or transparent?
content = content.replace("background-color: transparent;", "background-color: var(--bg-card);")

# 5. Let's check what class "Proposta Comercial" is. It's likely .hero-title
# And "Cliente Teste" is .client-name
# In dark theme they might have had specific colors.
content = re.sub(r'\.hero-title\s*\{.*?\}', r'.hero-title { font-size: 3.5rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1.5rem; }', content, flags=re.DOTALL)

# 6. "Escopo de Trabalho" is .section-title
content = re.sub(r'\.section-title\s*\{.*?\}', r'.section-title { font-size: 2.5rem; font-weight: 700; color: var(--accent-blue); letter-spacing: -0.02em; margin-bottom: 2.5rem; display: flex; align-items: center; gap: 1rem; }', content, flags=re.DOTALL)

# 7. Values like "R$ 0,00" might be .metric-value
content = re.sub(r'\.metric-value\s*\{.*?\}', r'.metric-value { font-size: 3.5rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; line-height: 1; }', content, flags=re.DOTALL)
content = re.sub(r'\.client-name\s*\{.*?\}', r'.client-name { font-size: 1.8rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; margin-bottom: 0.2rem; }', content, flags=re.DOTALL)

with open('proposta.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
