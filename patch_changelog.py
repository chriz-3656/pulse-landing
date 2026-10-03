import re

with open('/home/demo/project/pulse-landing/changelog.html', 'r') as f:
    text = f.read()

# Update base version text for parser test if it exists
text = text.replace('v2.0.0', 'v2.1.4')

with open('/home/demo/project/pulse-landing/changelog.html', 'w') as f:
    f.write(text)

