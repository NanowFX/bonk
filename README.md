# BONK

Écouter Spotify à deux, en même temps, sur le même morceau — avec un hôte qu'on peut passer à l'autre quand on veut choisir la musique.

BONK est une extension [Spicetify](https://spicetify.app) : elle ajoute un bouton dans la barre de lecture et un panneau qui gère la session, les rôles et les stats du duo.

## Ce qu'elle fait

- **Session temporaire** : on crée, on partage un code, on écoute ensemble.
- **Duo permanent** : une invitation à deux, qui devient un duo dès que l'autre saisit le code — plus besoin de le retaper ensuite.
- **Hôte transférable** : celui qui rejoint est auditeur, l'autre est hôte ; l'hôte peut repasser le rôle (c'est ce qui change qui choisit la musique).
- **Veille et rejoindre** : quitter une session duo ne coupe pas le lien — tu vois ce que l'autre écoute et tu peux le rejoindre, ou activer « Rejoindre auto ».
- **Stats de la paire** : titres, temps écouté, tops — rattachés aux deux comptes, pas à l'installation.
- **Sauvegarde en ligne** : le duo et ses stats reviennent après une réinstallation, via une empreinte de ton compte (le compte lui-même n'est jamais transmis).

## Prérequis

- Spotify pour ordinateur (Windows)
- [Spicetify](https://spicetify.app/docs/getting-started) installé et fonctionnel

## Installation

**Depuis le Marketplace de Spicetify** (le plus simple) : ouvre Marketplace dans Spotify, onglet Extensions, cherche « BONK » et clique sur Install.

**Sinon, en une ligne** dans PowerShell :

```powershell
irm https://raw.githubusercontent.com/NanowFX/bonk/main/install.ps1 | iex
```

Le script télécharge la dernière version, l'active dans Spicetify, l'applique, puis installe la mise à jour automatique. Redémarre Spotify ensuite.

### Mise à jour automatique

`install.ps1` enregistre une tâche planifiée `BonkUpdate` (au démarrage et toutes les 6 heures) qui compare l'empreinte de l'extension installée à celle publiée dans [`version.json`](version.json) et remplace le fichier si besoin. Si la tâche ne peut pas être créée, un raccourci est déposé dans le dossier Démarrage.

Pour la couper : `Unregister-ScheduledTask -TaskName BonkUpdate -Confirm:$false`.
Pour la forcer à la main : `powershell -ExecutionPolicy Bypass -File "$env:LOCALAPPDATA\bonk\update.ps1" -Force`.

### Installation manuelle

Télécharge [`dist/bonk.js`](dist/bonk.js), place-le dans `%APPDATA%\spicetify\Extensions\`, puis :

```powershell
spicetify config extensions bonk.js
spicetify apply
```

## Désinstallation

```powershell
spicetify config extensions bonk.js-
spicetify apply
```

Puis supprime `%APPDATA%\spicetify\Extensions\bonk.js` et, si tu veux, `%LOCALAPPDATA%\bonk`.

## Développement

```powershell
npm install
npm test          # harnais jsdom, sans Spotify
npm run build     # dist/bonk.js
npm run install:plugin
npm run release   # build + version.json (empreinte pour l'auto-update)
```

- `src/bonk.js` : toute l'extension (état, réseau PeerJS, duo, rôles, stats, rendu).
- `src/panel.css` : le panneau, en verre dépoli.
- `cloud/` : le petit service de sauvegarde (Worker Cloudflare + D1).
- `test/` : harnais de bout en bout avec un faux PeerJS.

L'extension ne passe par aucun serveur pour l'audio : les navigateurs se parlent en pair-à-pair via PeerJS.
