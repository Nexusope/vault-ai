# Design System

Vault’s visual language is technical brutalism: black-green surfaces, one-pixel structure, dense monospaced metadata, oversized grotesk headlines, and restrained signal colors. Tokens live in `app/globals.css`; components never hardcode theme roles. Core tokens are background, panel, two border levels, text, muted, dim, signal green, cyan semantic, orange urgent, purple generative, and red destructive.

Spacing follows 4, 8, 12, 16, 20, 24, 32, 42, 64, and 86 px. Radius is 2 px except semantic circles. Type roles are display 46–104 px/0.84–0.95, section 24–30 px, body 12–17 px/1.55–1.65, and metadata 7–10 px monospaced uppercase. Focus is a two-pixel green outline with three-pixel offset.

Motion durations are 120 ms control, 240 ms route, 400 ms panel, with the shared emphasized ease. Reduced-motion disables rotation, parallax, and continuous particles and exposes the Galaxy list fallback. Every semantic color has text/icon support; color alone never communicates status. Minimum targets are 44×44 px on touch and WCAG AA contrast in dark and future light themes.
