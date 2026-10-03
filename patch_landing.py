import re

with open('/home/demo/project/pulse-landing/index.html', 'r') as f:
    text = f.read()

# Update version
text = text.replace('v2.1.1', 'v2.1.4')
text = text.replace('Pulse-Music-v2.1.1.apk', 'Pulse-Music-latest.apk')

# Update Features
# Replace Spotify Import with Time-Synced Lyrics
old_spotify = """          <div class="feature-item">
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 11.933a6.139 6.139 0 0 1 7.142-1.391"/><path d="M8 14.5a4.7 4.7 0 0 1 5.3-.96"/></svg>
            <h4>Spotify Import</h4>
            <p>Seamlessly migrate your public Spotify playlists directly into native offline Pulse crates via URL scraper.</p>
          </div>"""
new_lyrics = """          <div class="feature-item">
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <h4>Time-Synced Lyrics</h4>
            <p>Beautiful Neumorphic animated lyrics injected into the player UI, automatically syncing and scrolling with the track.</p>
          </div>"""
text = text.replace(old_spotify, new_lyrics)

# Replace Media controls with Sleep Timer
old_media = """          <div class="feature-item">
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <h4>Media controls</h4>
            <p>Full background playback support with rich media notifications, Android 13+ playback controls, and lock screen widgets.</p>
          </div>"""
new_timer = """          <div class="feature-item">
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <h4>Sleep Timer</h4>
            <p>Set a custom countdown timer that safely pauses playback and shuts down the music engine so you can drift off to sleep.</p>
          </div>"""
text = text.replace(old_media, new_timer)

with open('/home/demo/project/pulse-landing/index.html', 'w') as f:
    f.write(text)

