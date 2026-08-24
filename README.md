# my planner

A little desktop scrapbook planner — Electron + React + TypeScript.

Launch it and pick **calendar** or **planner**:

- **calendar** — click any date to plan it out: a numbered checklist where each
  item can be expanded (✎) to add specifics/notes underneath it.
- **planner** — your main page is today's task checklist. Set up **recurring
  tasks** (daily, weekdays, or custom days) that automatically add themselves
  to today's checklist each day. Create **task banks** (icon + color) to hold
  tasks for later, and move any bank item onto today's list with one click.

All data is saved locally on your machine (nothing leaves your computer).

## Run it in development

```bash
npm install
npm run dev
```

This opens the app in a live-reloading Electron window.

## Build a macOS app you can install

> **Note:** producing a signed `.dmg`/`.app` requires macOS tooling and must
> be run **on a Mac** (Apple's codesign/notarization tools don't exist on
> Linux/Windows). If you're reading this from a non-Mac environment, pull
> this repo down onto your MacBook first, then run the command below there.

```bash
npm install
npm run dist:mac
```

This produces, in the `release/` folder:

- `Scrap Planner-<version>-arm64.dmg` — installer for Apple Silicon Macs
- `Scrap Planner-<version>.dmg` — installer for Intel Macs
- matching `.zip` builds too

Double-click the `.dmg` for your Mac's chip (Apple Silicon vs Intel — check
via  → About This Mac), drag **Scrap Planner** into Applications, and launch
it from Launchpad/Spotlight like any other app.

The build is unsigned (no Apple Developer account configured), so the first
time you open it macOS Gatekeeper will warn that it's from an unidentified
developer. Right-click (or Control-click) the app → **Open** → **Open** to
approve it once; after that it launches normally.

If you'd rather skip that prompt, run `npm run dist:mac-unsigned` instead,
which is equivalent unless you later add your own Apple Developer signing
identity to `package.json`'s `build.mac` config.

## Regenerating the app icon

`build/icon.png` is a 1024×1024 source icon; electron-builder converts it to
`.icns` automatically at build time. Edit `build/generate_icon.py` and re-run
`python3 build/generate_icon.py` (requires `pip install Pillow`) if you want
to tweak it.
