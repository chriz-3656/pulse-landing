import re

with open("index.html", "r") as f:
    html = f.read()

# Update version
html = html.replace('v1.4.1', 'v2.0.0')

# Add NewPipe Extractor and Dynamic feed to feature grid
feat_grid_regex = r'<div class="features-grid reveal">[\s\S]*?<h4>Multi-source search</h4>[\s\S]*?<p>Discover music through multiple integrated providers effortlessly.</p>\s*</div>'
new_feat_grid = """<div class="features-grid reveal">
          <div class="feature-item">
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            <h4>NewPipe Extractor</h4>
            <p>Powered by the stable NewPipe engine for resilient, ad-free background playback directly from YouTube Music.</p>
          </div>
          <div class="feature-item">
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <h4>Dynamic Feed</h4>
            <p>Infinite generated Home screen with randomized Quick Picks, Trending Tracks, and curated Moods & Genres.</p>
          </div>"""

html = re.sub(feat_grid_regex, new_feat_grid, html)

with open("index.html", "w") as f:
    f.write(html)
