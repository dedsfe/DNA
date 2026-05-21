import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix Proposal Title Size
content = re.sub(r'\.proposal-title\s*\{.*?\}', r'.proposal-title { font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; margin-bottom: 1.5rem; line-height: 1.1; }', content, flags=re.DOTALL)

# 2. Fix Section Title Size
content = re.sub(r'\.section-title\s*\{.*?\}', r'.section-title { font-size: clamp(1.75rem, 3vw, 2.2rem); font-weight: 800; color: var(--accent-blue); letter-spacing: -0.02em; margin-bottom: 1.5rem; line-height: 1.2; }', content, flags=re.DOTALL)

# 3. Fix Metric Value Size
content = re.sub(r'\.metric-value\s*\{.*?\}', r'.metric-value { font-size: clamp(1.5rem, 4vw, 2.2rem); font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; line-height: 1.2; }', content, flags=re.DOTALL)
content = re.sub(r'\.metric-value\.highlight-gold\s*\{.*?\}', r'.metric-value.highlight-gold { color: var(--accent-gold); font-size: clamp(1.5rem, 4vw, 2.2rem); font-weight: 700; font-style: normal; }', content, flags=re.DOTALL)

# 4. Fix Accept Button Gradient
content = re.sub(r'background:\s*linear-gradient\(135deg,\s*var\(--text-primary\)\s*0%,\s*#e1e3e8\s*100%\);', r'background: var(--text-primary);', content)
content = re.sub(r'\.accept-btn\s*\{([^}]*color:\s*)var\(--bg-dark\)([^}]*)\}', r'.accept-btn {\g<1>#ffffff\g<2>}', content)

# 5. Fix Scope Card spacing
content = re.sub(r'\.scope-card\s*\{([^}]*padding:\s*)2\.5rem([^}]*)\}', r'.scope-card {\g<1>1.75rem\g<2>}', content)

# 6. Fix Metrics Grid gap and margin
content = re.sub(r'\.metrics-grid\s*\{([^}]*gap:\s*)1\.25rem([^}]*margin-bottom:\s*)5rem([^}]*)\}', r'.metrics-grid {\g<1>1rem\g<2>3rem\g<3>}', content)

# Write back
with open('proposta.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS adjustments complete.")
