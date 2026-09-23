import re

with open("index.html", "r") as f:
    text = f.read()

# Replace hero actions
hero_actions_regex = r'<div class="hero-actions">\s*<a href="#download" class="btn btn-primary">DOWNLOAD PULSE</a>\s*<a href="#features" class="btn btn-secondary">EXPLORE FEATURES</a>\s*</div>'
new_hero_actions = """<div class="hero-actions">
            <a href="#features" class="btn btn-primary">SCROLL TO EXPLORE</a>
          </div>"""

text = re.sub(hero_actions_regex, new_hero_actions, text)

# The user might also want the nav bar download button removed?
# "in top add scroll to know the app and download" -> this just means replacing the hero button.
# "make it bottom only" -> "insted of ading download on top make it bottom only"
# So let's remove the nav bar download button too.

nav_actions_regex = r'<div class="nav-actions">\s*<a href="#" class="btn btn-secondary" id="nav-github-btn">GitHub</a>\s*<a href="#download" class="btn btn-primary btn-download">Download</a>\s*</div>'
new_nav_actions = """<div class="nav-actions">
        <a href="#" class="btn btn-secondary" id="nav-github-btn">GitHub</a>
      </div>"""

text = re.sub(nav_actions_regex, new_nav_actions, text)

with open("index.html", "w") as f:
    f.write(text)
