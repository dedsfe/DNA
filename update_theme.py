import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace :root
root_old = r""":root\s*\{.*?(?=--radius-sm: 8px;)"""
root_new = """:root {
      --bg-dark: #f5f5f7;
      --bg-card: #ffffff;
      --bg-card-hover: #f8fafc;
      --accent-gold: #d4a87a;
      --accent-gold-rgb: 212, 168, 122;
      --accent-blue: #245ba1;
      --accent-blue-rgb: 36, 91, 161;
      --text-primary: #0a1628;
      --text-secondary: rgba(10, 22, 40, 0.65);
      --text-muted: rgba(10, 22, 40, 0.4);
      --border-color: rgba(10, 22, 40, 0.07);
      --border-hover: rgba(36, 91, 161, 0.25);
      --border-active: rgba(36, 91, 161, 0.4);
      --max-width: 840px;
      --transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      --shadow-premium: 0 12px 32px rgba(10, 22, 40, 0.04), 0 2px 8px rgba(10, 22, 40, 0.02);
      --shadow-card: 0 4px 18px rgba(10, 22, 40, 0.02), 0 1px 3px rgba(10, 22, 40, 0.01);
      --shadow-hover: 0 24px 48px rgba(10, 22, 40, 0.08), 0 4px 12px rgba(10, 22, 40, 0.03);
      """
content = re.sub(root_old, root_new, content, flags=re.DOTALL)

# Scrollbar
content = content.replace("background: rgba(255, 255, 255, 0.1);", "background: rgba(10, 22, 40, 0.15);")

# Background Grid
content = content.replace("rgba(255, 255, 255, 0.015)", "rgba(10, 22, 40, 0.012)")

# Glows
content = content.replace("rgba(212, 168, 122, 0.02)", "rgba(36, 91, 161, 0.035)")
content = content.replace("rgba(59, 124, 211, 0.018)", "rgba(36, 91, 161, 0.035)")

# Additional text transparency replacements (e.g. rgba(255,255,255, 0.6) to dark)
content = re.sub(r'rgba\(255,\s*255,\s*255,\s*(0\.\d+)\)', r'rgba(10, 22, 40, \1)', content)

# Check for #1d2238 or other dark colors that were used previously and now might be wrong. Wait, no, we WANT dark text colors!
# Actually we want text to be dark.
# But wait, did they hardcode any #ffffff text?
content = content.replace('color: #ffffff', 'color: var(--text-primary)')

with open('proposta.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
