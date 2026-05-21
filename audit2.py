import re

with open('proposta.html', 'r', encoding='utf-8') as f:
    content = f.read()

# find all @media (max-width
start_idx = 0
while True:
    idx = content.find("@media (max-width", start_idx)
    if idx == -1: break
    
    # find the opening brace
    brace_idx = content.find("{", idx)
    
    # count braces
    open_brackets = 0
    end_idx = -1
    for i in range(brace_idx, len(content)):
        if content[i] == '{':
            open_brackets += 1
        elif content[i] == '}':
            open_brackets -= 1
            if open_brackets == 0:
                end_idx = i
                break
                
    if end_idx != -1:
        mq_content = content[idx:end_idx+1]
        print(mq_content)
        print('-'*50)
    
    start_idx = end_idx + 1

