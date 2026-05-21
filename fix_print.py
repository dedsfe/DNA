import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the start of @media print and the end.
# @media print is near line 835. Let's just find the index of "@media print {" and then balance the brackets to find the end.

start_idx = content.find("@media print {")
if start_idx == -1:
    print("Could not find @media print")
else:
    open_brackets = 0
    end_idx = -1
    for i in range(start_idx + 13, len(content)):
        if content[i] == '{':
            open_brackets += 1
        elif content[i] == '}':
            open_brackets -= 1
            if open_brackets == 0:
                end_idx = i
                break
    
    if end_idx != -1:
        # We have the bounds of the old @media print
        old_print_css = content[start_idx:end_idx+1]
        
        new_print_css = """@media print {
      @page {
        size: A4;
        margin: 15mm;
      }

      html, body {
        background-color: #ffffff !important;
        color: #0a1628 !important;
        padding: 0 !important;
        margin: 0 !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 11pt !important;
        line-height: 1.5 !important;
      }

      .page-wrapper {
        padding: 0 !important;
        min-height: auto !important;
        display: block !important;
      }

      .ambient-light, .bg-grid, .bg-glow-1, .bg-glow-2,
      .proposal-actions, .print-trigger-btn, .accept-btn,
      .scope-price-badge:empty, #errorScreen, .premium-checkbox-container {
        display: none !important;
      }

      .container {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* CABEÇALHO INICIAL DO PDF */
      .brand-header {
        border-bottom: 2px solid #d4a87a !important;
        padding-bottom: 10px !important;
        margin-bottom: 20px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        page-break-after: avoid !important;
      }
      .brand-logo { color: #0a1628 !important; font-size: 16pt !important; }
      .brand-tag { color: #d4a87a !important; font-size: 9pt !important; }

      .proposal-hero {
        text-align: center !important;
        margin-top: 100px !important;
        margin-bottom: 150px !important;
        page-break-after: always !important;
      }

      .proposal-title {
        color: #0a1628 !important;
        font-size: 32pt !important;
        margin-bottom: 20px !important;
      }

      .client-company { color: #0a1628 !important; font-size: 16pt !important; font-weight: bold !important; }
      .client-name { font-size: 14pt !important; color: #0a1628 !important; }

      /* SEÇÕES (Ex: Site/Automação) */
      .section-title {
        background-color: #0a1628 !important;
        color: #ffffff !important;
        padding: 15px 20px !important;
        text-align: center !important;
        font-size: 16pt !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        margin-top: 30px !important;
        margin-bottom: 20px !important;
        border-radius: 4px !important;
        page-break-after: avoid !important;
      }

      /* PACOTES DE ESCOPO */
      .scope-grid {
        display: block !important;
      }

      .scope-card {
        background: transparent !important;
        border: 1px solid #d4a87a !important;
        border-radius: 0 !important;
        padding: 20px !important;
        margin-bottom: 20px !important;
        page-break-inside: avoid !important; /* IMPORTANTE: NUNCA QUEBRAR PACOTE NA METADE */
        box-shadow: none !important;
      }

      .scope-card.is-deselected {
        display: none !important; /* Não imprimir o que não foi selecionado */
      }

      .scope-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: baseline !important;
        border-bottom: 1px solid rgba(212, 168, 122, 0.4) !important;
        padding-bottom: 10px !important;
        margin-bottom: 15px !important;
      }

      .scope-title {
        font-size: 14pt !important;
        font-weight: bold !important;
        color: #0a1628 !important;
      }

      .scope-price {
        font-size: 14pt !important;
        color: #d4a87a !important;
        font-weight: bold !important;
      }

      .scope-desc {
        font-size: 11pt !important;
        color: #0a1628 !important;
      }

      .scope-desc ul {
        list-style-type: disc !important;
        padding-left: 20px !important;
      }

      .scope-desc li {
        margin-bottom: 5px !important;
      }

      /* INVESTIMENTO TOTAL E PAGAMENTO */
      .investment-panel {
        page-break-before: always !important;
      }

      .total-invest-box {
        border: 2px solid #0a1628 !important;
        padding: 30px !important;
        text-align: center !important;
        margin-bottom: 30px !important;
      }

      .total-invest-label { color: #0a1628 !important; font-size: 12pt !important; }
      .total-invest-value { color: #0a1628 !important; font-size: 28pt !important; font-weight: 800 !important; }
      
      .payment-methods-grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 20px !important;
      }

      .method-card {
        border: 1px solid #d4a87a !important;
        padding: 15px !important;
        page-break-inside: avoid !important;
      }

      /* ASSINATURA */
      .signature-section {
        page-break-before: auto !important;
        page-break-inside: avoid !important;
        margin-top: 50px !important;
        border-top: 1px dashed #d4a87a !important;
        padding-top: 30px !important;
      }

      .print-signature-box {
        display: block !important;
        margin-top: 30px !important;
      }

      .signature-line {
        border-top: 1px solid #000 !important;
        width: 300px !important;
        margin: 0 auto 10px auto !important;
      }

      .signature-pad-container {
        display: none !important; /* Esconde a caixa de assinar interativa do PDF caso use a linha acima, ou mantemos. O user disse fundo da assinatura. */
      }
    }"""
        
        # Replace the content
        new_content = content[:start_idx] + new_print_css + content[end_idx+1:]
        
        with open('proposta.html', 'w', encoding='utf-8') as file:
            file.write(new_content)
        print("Updated @media print successfully.")

