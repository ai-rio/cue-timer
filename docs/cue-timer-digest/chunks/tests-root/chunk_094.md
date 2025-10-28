# Chunk 94: tests_root

## Metadata

- **Files**: 1
- **Size**: 5,001 characters (~1,250 tokens)
- **Categories**: tests

## Files in this chunk

- `test-timer.html`

---

## File: `test-timer.html`

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Timer Visibility Test</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <style>
      :root {
        --background: 0 0% 100%;
        --foreground: 214 15% 20%;
      }

      .dark {
        --background: 214 15% 10%;
        --foreground: 0 0% 98%;
      }

      body {
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
        font-family: 'Inter', sans-serif;
        padding: 2rem;
        transition: all 0.3s ease;
      }

      .timer-display {
        font-family: 'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif !important;
        font-variant-numeric: tabular-nums !important;
        line-height: 1 !important;
        letter-spacing: -0.02em !important;
        color: #000000 !important; /* Pure black for light theme - maximum contrast */
        font-weight: 700 !important; /* Bolder weight for better visibility */
      }

      .dark .timer-display {
        color: #ffffff !important; /* Pure white for dark theme */
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important; /* Enhanced shadow for dark theme */
      }

      .timer-display-robust {
        color: #000000 !important;
        text-shadow:
          0 1px 2px rgba(255, 255, 255, 0.9),
          0 0 8px rgba(255, 255, 255, 0.5) !important;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.1),
          rgba(255, 255, 255, 0.05)
        ) !important;
        padding: 0.5rem 1rem !important;
        border-radius: 0.5rem !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 4rem;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.02em;
      }

      .dark .timer-display-robust {
        color: #ffffff !important;
        text-shadow:
          0 1px 2px rgba(0, 0, 0, 0.9),
          0 0 8px rgba(0, 0, 0, 0.5) !important;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }

      .theme-toggle {
        background: #ff6b35;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        margin-bottom: 2rem;
      }

      .theme-toggle:hover {
        background: #e55a2b;
      }

      .test-section {
        margin: 2rem 0;
        padding: 2rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
      }

      .dark .test-section {
        border-color: #4a5568;
      }

      .test-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      .old-timer {
        font-size: 4rem;
        color: #718096;
        font-family: 'Space Grotesk', sans-serif;
        font-variant-numeric: tabular-nums;
      }

      .dark .old-timer {
        color: #a0aec0;
      }
    </style>
  </head>
  <body>
    <button class="theme-toggle" onclick="toggleTheme()">Toggle Theme</button>

    <h1>Timer Display Visibility Test</h1>
    <p>
      This page tests different timer display approaches to ensure visibility in both light and dark
      themes.
    </p>

    <div class="test-section">
      <h2 class="test-title">OLD: Basic Timer (Problematic)</h2>
      <p>Uses Tailwind gray colors that may not have sufficient contrast:</p>
      <div class="old-timer">05:42.3</div>
    </div>

    <div class="test-section">
      <h2 class="test-title">NEW: Robust Timer Display</h2>
      <p>Uses high contrast colors and enhanced backgrounds:</p>
      <div class="timer-display-robust">05:42.3</div>
    </div>

    <div class="test-section">
      <h2 class="test-title">NEW: Simple High Contrast Timer</h2>
      <p>Uses pure black/white with !important specificity:</p>
      <div class="timer-display" style="font-size: 4rem">05:42.3</div>
    </div>

    <script>
      function toggleTheme() {
        document.documentElement.classList.toggle('dark');
      }

      // Check for saved theme preference or default to light mode
      const currentTheme = localStorage.getItem('cue-timer-theme') || 'light';
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }

      // Save theme preference
      document.addEventListener('DOMContentLoaded', () => {
        const toggleBtn = document.querySelector('.theme-toggle');
        toggleBtn.addEventListener('click', () => {
          const isDark = document.documentElement.classList.contains('dark');
          localStorage.setItem('cue-timer-theme', isDark ? 'dark' : 'light');
        });
      });
    </script>
  </body>
</html>
```
