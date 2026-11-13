<img src="preview.png" width="180" alt="BONK">

# BONK

Spicetify extension to listen to Spotify in sync with one other person.

## Features

- Temporary session with a share code
- Permanent duo, code entered once
- Transferable host role
- Watch what the other account plays, and join it
- Auto-join toggle
- Duo stats: tracks, listening time, top artists and songs
- Online backup of the duo and its stats

## Install

Spicetify Marketplace, Extensions tab, "BONK". Or:

```powershell
irm https://raw.githubusercontent.com/NanowFX/bonk/main/install.ps1 | iex
```

`install.ps1` also registers the `BonkUpdate` scheduled task (sign-in and every 6 hours) which syncs `dist/bonk.js` with [`version.json`](version.json).

## Uninstall

```powershell
spicetify config extensions bonk.js-
spicetify apply
```

## Build

```powershell
npm install
npm test
npm run build
npm run release
```
