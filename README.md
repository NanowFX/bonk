<img src="preview.png" width="220" alt="BONK">

# BONK

Listen to Spotify with someone else, at the same time, on the same track — with a host you can hand over whenever the other person should be the one picking the music.

BONK is a [Spicetify](https://spicetify.app) extension: it adds a button to the playbar and a panel that manages the session, the roles and the duo stats.

## What it does

- **Temporary session** — create one, share the code, listen together.
- **Permanent duo** — a two-person invite that becomes a duo as soon as the other person enters the code, so nobody has to type it again.
- **Transferable host** — whoever joins is a listener, the other one is the host; the host can pass the role on, which is what decides who picks the music.
- **Watch and join** — leaving a duo session doesn't cut the link: you can see what the other person is playing and join them, or turn on **auto-join**.
- **Duo stats** — tracks, listening time, top artists and songs, tied to the two accounts rather than to a single install.
- **Online backup** — the duo and its stats come back after a reinstall through a fingerprint of your account; the account itself is never sent.

## Requirements

- Spotify for desktop (Windows)
- [Spicetify](https://spicetify.app/docs/getting-started) installed and working

## Install

**From Spicetify Marketplace** (easiest): open Marketplace in Spotify, go to the Extensions tab, search for “BONK” and hit Install.

**Or, in one line**, in PowerShell:

```powershell
irm https://raw.githubusercontent.com/NanowFX/bonk/main/install.ps1 | iex
```

The script downloads the latest build, enables it in Spicetify, applies the changes and sets up automatic updates. Restart Spotify afterwards.

### Automatic updates

`install.ps1` registers a scheduled task named `BonkUpdate` (at sign-in and every 6 hours) that compares the fingerprint of the installed extension with the one published in [`version.json`](version.json) and replaces the file when needed. If the task can't be created, a shortcut is dropped into the Startup folder instead.

To turn it off: `Unregister-ScheduledTask -TaskName BonkUpdate -Confirm:$false`.
To run it by hand: `powershell -ExecutionPolicy Bypass -File "$env:LOCALAPPDATA\bonk\update.ps1" -Force`.

### Manual install

Download [`dist/bonk.js`](dist/bonk.js), drop it into `%APPDATA%\spicetify\Extensions\`, then:

```powershell
spicetify config extensions bonk.js
spicetify apply
```

## Uninstall

```powershell
spicetify config extensions bonk.js-
spicetify apply
```

Then delete `%APPDATA%\spicetify\Extensions\bonk.js` and, if you want, `%LOCALAPPDATA%\bonk`.

## Development

```powershell
npm install
npm test          # jsdom harness, no Spotify needed
npm run build     # dist/bonk.js
npm run install:plugin
npm run release   # build + version.json (fingerprint for the auto-update)
```

- `src/bonk.js` — the whole extension (state, PeerJS networking, duo, roles, stats, rendering).
- `src/panel.css` — the frosted-glass panel.
- `cloud/` — the small backup service (Cloudflare Worker + D1).
- `test/` — end-to-end harness with a fake PeerJS.

No server sits in the path of the audio: the clients talk to each other peer-to-peer through PeerJS.
