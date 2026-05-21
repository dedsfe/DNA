import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Any remaining rgba(255, 255, 255, 0.x) should become rgba(10, 22, 40, 0.x)
content = re.sub(r'rgba\(255,\s*255,\s*255,\s*(0\.\d+)\)', r'rgba(10, 22, 40, \1)', content)

# 2. Fix gradients that fade to white, now they should fade to dark. Wait, if it was a text gradient it was fading to transparent white.
# E.g. background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%);
# This was making the title white. Let's replace it with blue gradient:
content = re.sub(r'background:\s*linear-gradient\(.*?(?:#ffffff|#fff).*?\);\s*-webkit-background-clip:\s*text;', 'background: linear-gradient(135deg, var(--accent-blue) 0%, var(--text-primary) 100%); -webkit-background-clip: text;', content)

# 3. Replace any hardcoded #ffffff or #fff color (NOT background-color) to var(--text-primary)
content = re.sub(r'color:\s*#ffffff;?', 'color: var(--text-primary);', content)
content = re.sub(r'color:\s*#fff;?', 'color: var(--text-primary);', content)

# 4. In "Valores & Pagamento" and "Escopo de Trabalho", the title uses Instrument Serif and accent-gold.
# Let's change the color of section-title from accent-gold to accent-gold-dark or accent-blue so it's readable.
# Actually, the user asked for "Branco, Azul, um pouco de dourado. As fontes tbm".
# So the serif titles should be accent-gold, but maybe the gold needs to be slightly darker to read on white.
# Our accent-gold is #d4a87a. Let's add --accent-gold-dark: #b88d5e; and use it for .section-title
content = content.replace('color: var(--accent-gold);', 'color: var(--accent-gold-dark, #b88d5e);')

# 5. Buttons and important UI elements might need to be blue instead of gold for a cleaner look.
content = content.replace('background: var(--accent-gold)', 'background: var(--accent-blue)')
content = content.replace('border-color: var(--accent-gold)', 'border-color: var(--accent-blue)')

# 6. Change all `Instrument Serif` to `Inter` to match the "fontes tbm" request
content = content.replace("'Instrument Serif', serif", "'Inter', sans-serif")

# 7. Button text color inside the blue button should be white.
# "color: var(--bg-dark);" inside .btn-primary should become "color: #ffffff;"
content = re.sub(r'\.btn-primary\s*\{\s*(.*?)\s*color:\s*var\(--bg-dark\);', r'.btn-primary {\n\1\n      color: #ffffff;', content, flags=re.DOTALL)

with open('proposta.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
