# site — GitHub Pages viewer

На каждый `npm run build` / CI:

1. `scripts/generate-content.mjs` сканирует `projects/*/scenarios/*.md`
2. пишет `public/content/manifest.json` + копирует md
3. Vite собирает статику

Новый проект = новая папка в `projects/`. Новый сценарий = новый `.md` в `scenarios/`. Пуш в `main` → Pages обновляется. Руками манифест не правят.
