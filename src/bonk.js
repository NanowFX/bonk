import Peer from "peerjs";
import panelCss from "./panel.css";
import displayFont from "../assets/display.woff2";

/* ------------------------------------------------------------------ *
 *  BONK — écouter Spotify ensemble, en P2P, avec un hôte qui se passe
 * ------------------------------------------------------------------ */

const PEER_PREFIX = "bonk-aux-";
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const TICK_MS = 400;
const PUSH_MS = 1500;
const DRIFT_MS = 1200;

const PEER_CONFIG = {
  debug: 0,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:global.stun.twilio.com:3478" },
      { urls: "turn:openrelay.metered.ca:80", username: "openrelayproject", credential: "openrelayproject" },
      { urls: "turn:openrelay.metered.ca:443", username: "openrelayproject", credential: "openrelayproject" },
      {
        urls: "turn:openrelay.metered.ca:443?transport=tcp",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
    iceCandidatePoolSize: 10,
  },
};

const ICON = {
  jam: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>',
  play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>',
  prev: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>',
  next: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z"/></svg>',
  copy: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 4h9a2 2 0 0 1 2 2v9h-2V6H8V4z"/><path d="M5 8h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2zm0 2v10h9V10H5z"/></svg>',
  close:
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  note: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  crown:
    '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4.2 4.6L12 5.5l4.8 7.1L21 8l-1.6 9.2H4.6z"/></svg>',
  cloud:
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 9.4A3.8 3.8 0 0 0 7 18z"/></svg>',
  check:
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  refresh:
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>',
  headphones:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 14v-2a8 8 0 0 1 16 0v2" stroke-linecap="round"/><rect x="2.6" y="13" width="4.4" height="7" rx="2.2"/><rect x="17" y="13" width="4.4" height="7" rx="2.2"/></svg>',
  chart:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
};

const PLAYBAR_ICON =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>';

/* ---------------------------- state ---------------------------- */

const S = {
  me: { name: "Auditeur", image: "", username: "" },
  role: null,
  code: "",
  peerId: "",
  authority: "",
  hostName: "",
  members: [],
  conns: new Map(),
  hostConn: null,
  peer: null,
  remote: { uri: null, name: "", artist: "", art: "", duration: 0, playing: false, progress: 0, at: Date.now() },
  hasRemote: false,
  joined: false,
  open: false,
  busy: false,
  error: "",
  input: "",
  sig: "",
  lastPush: 0,
  copied: null,
  duo: null,
  duoInput: "",
  mode: "manual",
  following: false,
  applyingUntil: 0,
  connectingDuo: false,
  pendingPeer: null,
  duoPaused: false,
  autoJoin: false,
  lastNotify: { uri: "", at: 0 },
  stats: [],
  statsOpen: false,
  lastRecorded: null,
  el: { panel: null, head: null, body: null, button: null },
};

/* --------------------------- utilities --------------------------- */

const log = (...args) => console.debug("[BONK]", ...args);
const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function fmtTime(ms) {
  const total = Math.max(0, Math.floor((Number(ms) || 0) / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function fmtImg(url) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  if (raw.startsWith("https://")) return raw;
  if (raw.startsWith("spotify:image:")) return `https://i.scdn.co/image/${raw.slice(14)}`;
  if (/^[0-9a-f]{40}$/i.test(raw)) return `https://i.scdn.co/image/${raw}`;
  return "";
}

function initials(name) {
  const clean = String(name || "?").trim();
  return (clean[0] || "?").toUpperCase();
}

function hueFor(name) {
  let hash = 0;
  for (const char of String(name || "?")) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return `hsl(${Math.abs(hash) % 360} 52% 34%)`;
}

function makeCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

function normalizeCode(raw) {
  const text = String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return text.slice(0, 8);
}

/* ----------------------------- duo ----------------------------- */

const DUO_KEY = "bonk.duo";
const DUO_BACKUP_KEY = "bonk.duo.bak";
const AUTO_KEY = "bonk.autojoin";

function loadAutoJoin() {
  try {
    return window.localStorage.getItem(AUTO_KEY) === "1";
  } catch {
    return false;
  }
}

function saveAutoJoin() {
  try {
    window.localStorage.setItem(AUTO_KEY, S.autoJoin ? "1" : "0");
  } catch (error) {
    log("autojoin storage", error);
  }
}

function readDuo(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.code) return null;
    return {
      code: String(parsed.code),
      partnerName: String(parsed.partnerName || ""),
      partnerUser: String(parsed.partnerUser || ""),
    };
  } catch {
    return null;
  }
}

function writeDuo(duo) {
  try {
    if (!duo) {
      window.localStorage.removeItem(DUO_KEY);
      window.localStorage.removeItem(DUO_BACKUP_KEY);
      return;
    }
    const raw = JSON.stringify(duo);
    window.localStorage.setItem(DUO_KEY, raw);
    window.localStorage.setItem(DUO_BACKUP_KEY, raw);
    if (readCloudKey()) cloudPush(true);
  } catch (error) {
    log("duo storage", error);
  }
}

/** Primary key, then the safety copy: Spotify sometimes drops site storage. */
function loadDuo() {
  const direct = readDuo(DUO_KEY);
  if (direct) return direct;
  const backup = readDuo(DUO_BACKUP_KEY);
  if (!backup) return null;
  log("duo restauré depuis la sauvegarde", backup.code);
  writeDuo(backup);
  return backup;
}

function persistDuo() {
  writeDuo(S.duo || null);
}

function saveDuo(duo) {
  S.duo = duo;
  persistDuo();
  refreshStats();
  render();
}

/** Un duo n'existe qu'une fois les deux personnes connues : le code seul est une invitation. */
function duoLinked() {
  return Boolean(S.duo?.code && S.duo?.partnerUser);
}

/** Connecté mais volontairement hors session : on suit le duo, sans le suivre. */
function duoIdle() {
  return Boolean(S.duo && S.duoPaused && !S.following);
}

function hash8(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/** Identifiant stable de la paire de comptes, peu importe l'ordre. */
function pairId() {
  const me = String(S.me?.username || "").trim().toLowerCase();
  const them = String(S.duo?.partnerUser || "").trim().toLowerCase();
  if (!me || !them) return "";
  const [first, second] = me < them ? [me, them] : [them, me];
  return hash8(`${first}|${second}`);
}

/** Les deux côtés s'échangent leur compte : c'est là que le duo existe vraiment. */
function linkDuo(partnerUser, partnerName) {
  const clean = String(partnerUser || "").trim().toLowerCase().slice(0, 60);
  if (!S.duo || !clean) return false;
  const name = String(partnerName || "").slice(0, 40);
  if (S.duo.partnerUser === clean && S.duo.partnerName === name) return false;
  const wasPending = !S.duo.partnerUser;
  S.duo = { ...S.duo, partnerUser: clean, partnerName: name || S.duo.partnerName || "" };
  persistDuo();
  refreshStats();
  if (wasPending) notify(`Duo créé avec ${S.duo.partnerName || "ton binôme"}`);
  render();
  return true;
}

function duoPeerId(code) {
  return `${PEER_PREFIX}duo-${String(code).toLowerCase()}`;
}

function partnerName() {
  if (S.duo?.partnerName) return S.duo.partnerName;
  const member = S.members.find((entry) => entry.id === S.authority && entry.id !== S.peerId);
  return member?.name || "Ton binôme";
}

function rememberPartner(name) {
  if (!S.duo || !name || S.duo.partnerName === name) return;
  S.duo = { ...S.duo, partnerName: name };
  persistDuo();
}

function connectDuo() {
  if (!S.duo || S.joined || S.busy || S.connectingDuo) return;
  S.connectingDuo = true;
  S.error = "";
  render();
  startHost({ duo: true, code: S.duo.code, quiet: true });
  // Sans ça, un pair qui n'ouvre ni n'échoue laissait le panneau sur
  // « Connexion… » pour toujours, sans jamais retenter.
  window.setTimeout(() => {
    if (S.joined || !S.connectingDuo) return;
    if (S.pendingPeer) {
      try {
        S.pendingPeer.destroy();
      } catch {
        /* ignore */
      }
      S.pendingPeer = null;
    }
    S.connectingDuo = false;
    render();
  }, 9000);
}

function createDuo() {
  const code = makeCode();
  saveDuo({ code, partnerName: "" });
  S.duoPaused = false;
  connectDuo();
  notify(`Code duo ${code} — partage-le avec ton binôme`);
}

function joinDuoFromInput() {
  const code = normalizeCode(S.duoInput || "");
  if (code.length < 6) {
    S.error = "Le code duo fait 6 caractères.";
    render();
    return;
  }
  saveDuo({ code, partnerName: "" });
  S.duoPaused = false;
  connectDuo();
}

function unbindDuo() {
  if (S.mode === "duo") leave(true, true);
  saveDuo(null);
  S.duoPaused = false;
  cloudForget();
  render();
}

/* ---------------------- sauvegarde en ligne ---------------------- */

const CLOUD_URL = "https://site-a91ec02422f5470481e7129658fcceb1.freebuff.page/v1/duo";
const CLOUD_KEY = "bonk.duo.k";

let CLOUD_KEY_CACHE = "";

function readCloudKey() {
  if (CLOUD_KEY_CACHE) return CLOUD_KEY_CACHE;
  try {
    CLOUD_KEY_CACHE = window.localStorage.getItem(CLOUD_KEY) || "";
  } catch {
    CLOUD_KEY_CACHE = "";
  }
  return CLOUD_KEY_CACHE;
}

/**
 * La clé est l'empreinte du compte Spotify : elle se recalcule à l'identique
 * après une réinstallation complète, sans rien avoir à saisir. Le compte
 * lui-même ne quitte jamais la machine.
 */
async function deriveCloudKey() {
  const account = String(S.me?.username || "").trim().toLowerCase();
  if (!account) return "";
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return "";
  try {
    const digest = await subtle.digest("SHA-256", new TextEncoder().encode(`bonk-account|${account}`));
    const key = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    CLOUD_KEY_CACHE = key;
    try {
      window.localStorage.setItem(CLOUD_KEY, key);
    } catch {}
    return key;
  } catch (error) {
    log("cloud key", error);
    return "";
  }
}

/** Sauvegarde le duo en ligne, ou le récupère quand il manque localement. */
async function syncCloud({ restore = true } = {}) {
  const key = await deriveCloudKey();
  if (!key) return false;
  if (document.getElementById("bonk-panel")) render();
  if (S.duo) return cloudPush(true);
  return restore ? cloudRestore(key, true) : false;
}

async function cloudCall(path, options) {
  const doFetch = globalThis.fetch;
  if (typeof doFetch !== "function") throw new Error("fetch indisponible");
  const response = await doFetch(CLOUD_URL + path, options);
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  return { ok: response.ok, status: response.status, data };
}

async function cloudPush(silent = false) {
  const key = readCloudKey();
  if (!key || !S.duo) return false;
  try {
    const { ok } = await cloudCall("", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        k: key,
        code: S.duo.code,
        partner: S.duo.partnerName || "",
        partnerUser: S.duo.partnerUser || "",
        stats: S.stats.slice(-300),
      }),
    });
    if (!ok) throw new Error("http " + ok);
    if (!silent) notify("Duo sauvegardé en ligne");
    return true;
  } catch (error) {
    log("cloud push", error);
    if (!silent) notify("Sauvegarde impossible (hors ligne ?)", true);
    return false;
  }
}

let statsPushTimer = 0;

/** Envoie les stats sans marteler le réseau à chaque écoute. */
function scheduleStatsPush() {
  if (statsPushTimer) return;
  statsPushTimer = window.setTimeout(() => {
    statsPushTimer = 0;
    if (S.duo) cloudPush(true);
  }, 15000);
}

async function cloudForget() {
  const key = readCloudKey();
  if (!key) return false;
  try {
    const { ok } = await cloudCall("", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ k: key, code: "", partner: "" }),
    });
    return ok;
  } catch (error) {
    log("cloud forget", error);
    return false;
  }
}

async function cloudRestore(key, silent = false) {
  if (!key) return false;
  try {
    const { ok, data } = await cloudCall(`?k=${encodeURIComponent(key)}`);
    if (!ok || !data?.code) {
      if (!silent) notify("Aucune sauvegarde pour cette phrase", true);
      return false;
    }
    saveDuo({
      code: String(data.code),
      partnerName: String(data.partner || ""),
      partnerUser: String(data.partner_user || "").toLowerCase(),
    });
    mergeStats(Array.isArray(data.stats) ? data.stats : []);
    S.duoPaused = false;
    connectDuo();
    notify("Duo restauré depuis la sauvegarde");
    return true;
  } catch (error) {
    log("cloud restore", error);
    if (!silent) notify("Récupération impossible (hors ligne ?)", true);
    return false;
  }
}

function cloudHTML() {
  const ready = Boolean(readCloudKey());
  return `
    <div class="bonk-cloud">
      <span class="bonk-cloud-head">${ICON.cloud} Sauvegarde en ligne${ready ? "" : " · en attente du compte"}</span>
      <span class="bonk-cloud-note">${
        ready
          ? "Automatique sur ton compte Spotify : le duo revient même après une réinstallation."
          : "S'active dès que ton compte Spotify est reconnu."
      }</span>
      ${
        ready && !S.duo
          ? '<div class="bonk-actions"><button class="bonk-mini bonk-mini-ghost" data-act="cloud-restore">Récupérer</button></div>'
          : ""
      }
    </div>`;
}

function startFollowing() {
  S.following = true;
  S.applyingUntil = Date.now() + 2000;
  if (S.hasRemote) {
    applyState({
      t: "state",
      track: { ...S.remote },
      playing: S.remote.playing,
      progress: S.remote.progress,
      ts: Date.now(),
    });
  }
  if (S.role === "host") {
    const authorityConn = S.conns.get(S.authority);
    if (authorityConn) send(authorityConn, { t: "sync" });
  } else {
    send(S.hostConn, { t: "sync" });
  }
  render();
}

function takeHost() {
  if (!S.joined) return;
  S.following = false;
  S.authority = S.peerId;
  const message = { t: "claim", from: S.peerId };
  if (S.role === "host") {
    broadcast(message);
    broadcastMembers();
  } else {
    send(S.hostConn, message);
  }
  pushState();
  render();
}

function notifyPartner(track) {
  if (!track?.uri) return;
  const now = Date.now();
  if (S.lastNotify.uri === track.uri && now - S.lastNotify.at < 120000) return;
  S.lastNotify = { uri: track.uri, at: now };
  notify(`${partnerName()} écoute « ${track.name} »`);
  pulseTrigger();
}

function pulseTrigger() {
  const element = S.el.button;
  if (!element) return;
  element.classList.add("bonk-trigger-ping");
  window.setTimeout(() => element.classList.remove("bonk-trigger-ping"), 6000);
}

/** Spicetify renders notification text as-is (no HTML), so keep it plain. */
function notify(message, isError = false) {
  const text = `BONK · ${String(message ?? "").replace(/<[^>]*>/g, "")}`;
  try {
    window.Spicetify.showNotification(text, isError, isError ? "error" : "check");
  } catch {
    log(text);
  }
}

async function waitFor(check, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      if (check()) return true;
    } catch {
      /* not ready yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  return false;
}

/* ---------------------------- player ---------------------------- */

const player = () => window.Spicetify?.Player;

function currentUri() {
  try {
    return player().data?.item?.uri ?? null;
  } catch {
    return null;
  }
}

function isPlayingNow() {
  try {
    return Boolean(player().isPlaying());
  } catch {
    return false;
  }
}

function localProgress() {
  try {
    return Number(player().getProgress()) || 0;
  } catch {
    return 0;
  }
}

/**
 * `Player.getProgress()` only moves when Spotify pushes a new sample, so the
 * counter reads frozen between updates. Interpolating from the last sample
 * (capped at 1 s) gives the real position, like Spotify's own playbar.
 */
const progressAnchor = { uri: null, raw: -1, at: 0, playing: false };

function smoothLocalProgress() {
  const raw = localProgress();
  const playing = isPlayingNow();
  const uri = currentUri();
  const now = Date.now();
  if (uri !== progressAnchor.uri || !playing || raw !== progressAnchor.raw) {
    progressAnchor.uri = uri;
    progressAnchor.raw = raw;
    progressAnchor.at = now;
    progressAnchor.playing = playing;
  }
  if (!playing) return raw;
  return raw + Math.min(Math.max(0, now - progressAnchor.at), 1000);
}

function localDuration() {
  try {
    return Number(player().getDuration()) || 0;
  } catch {
    return 0;
  }
}

function trackInfo() {
  let item;
  try {
    item = player().data?.item;
  } catch {
    item = null;
  }
  if (!item) return null;
  const meta = item.metadata || {};
  return {
    uri: item.uri,
    name: item.name || meta.title || "Titre inconnu",
    artist: meta.artist_name || meta.artists || meta.album_artist_name || "",
    art: fmtImg(meta.image_xlarge_url || meta.image_large_url || meta.image_url || item.album?.images?.[0]?.url),
    duration: localDuration() || Number(item.duration?.milliseconds) || 0,
  };
}

function playUri(uri) {
  try {
    return Promise.resolve(player().playUri(uri)).catch((error) => log("playUri", error));
  } catch (error) {
    log("playUri sync", error);
    return Promise.resolve();
  }
}

async function queueTrack(uri) {
  const Spicetify = window.Spicetify;
  const attempts = [
    () => Spicetify.addToQueue?.([{ uri }]),
    () => Spicetify.addToQueue?.([uri]),
    () => Spicetify.Platform?.PlayerAPI?.addToQueue?.([{ uri }]),
  ];
  for (const attempt of attempts) {
    try {
      const result = attempt();
      if (result) {
        await result;
        notify("Ajouté à la file d'attente");
        return true;
      }
    } catch (error) {
      log("queue", error);
    }
  }
  notify("Impossible d'ajouter à la file d'attente", true);
  return false;
}

/* --------------------------- networking --------------------------- */

function isAuthority() {
  return S.joined && Boolean(S.peerId) && S.peerId === S.authority;
}

function send(conn, message) {
  if (!conn?.open) return;
  try {
    conn.send(message);
  } catch (error) {
    log("send", error);
  }
}

function broadcast(message, exceptId) {
  S.conns.forEach((conn, id) => {
    if (id !== exceptId) send(conn, message);
  });
}

function snapshot() {
  return {
    t: "state",
    track: trackInfo(),
    playing: isPlayingNow(),
    progress: localProgress(),
    ts: Date.now(),
    authority: S.authority,
  };
}

function pushState() {
  if (!isAuthority()) return;
  // Hors session volontairement : on ne diffuse pas sa lecture aux autres.
  if (duoIdle()) return;
  S.lastPush = Date.now();
  const message = snapshot();
  if (S.role === "host") broadcast(message);
  else send(S.hostConn, message);
  rememberLocal(message);
  recordPlay(message.track, S.me.name);
}

function rememberLocal(message) {
  if (!message.track) return;
  S.remote = {
    ...message.track,
    playing: message.playing,
    progress: message.progress,
    at: Date.now(),
  };
  S.hasRemote = true;
}

function broadcastMembers() {
  broadcast({ t: "members", members: S.members, authority: S.authority });
}

/** Rejoint le duo tout seul, sauf si c'est ma propre lecture qui tourne (boucle). */
function maybeAutoJoin(message) {
  if (!S.autoJoin || !S.duo || S.mode !== "duo") return false;
  if (!S.joined) return false;
  if (S.authority && S.authority === S.peerId) return false;
  if (!message?.track?.uri || !message.playing) return false;
  S.duoPaused = false;
  S.following = true;
  S.applyingUntil = Date.now() + 2200;
  notify("Tu as rejoint ton duo");
  render();
  return true;
}

/** Suit le duo tout de suite, sans attendre la prochaine synchro. */
function followDuo() {
  if (!S.duo) return;
  S.duoPaused = false;
  S.following = true;
  S.applyingUntil = Date.now() + 2200;
  if (S.hasRemote && S.remote?.uri) {
    applyState({
      track: S.remote,
      playing: S.remote.playing,
      progress: S.remote.progress + (S.remote.playing ? Date.now() - S.remote.at : 0),
      ts: Date.now(),
      authority: S.authority,
    });
  }
  render();
}

function applyState(message) {
  if (!message) return;
  if (!message.track) {
    S.remote = { uri: null, name: "", artist: "", art: "", duration: 0, playing: false, progress: 0, at: Date.now() };
    S.hasRemote = true;
    renderChanged();
    return;
  }
  const playing = Boolean(message.playing);
  const sentAt = Number(message.ts) || Date.now();
  const base = Number(message.progress) || 0;

  S.remote = { ...message.track, playing, progress: base, at: Date.now() };
  S.hasRemote = true;
  if (message.authority) S.authority = message.authority;

  if (isAuthority()) {
    renderChanged();
    return;
  }

  if (!S.following) {
    if (playing) notifyPartner(message.track);
    if (!maybeAutoJoin(message)) {
      renderChanged();
      return;
    }
  }

  S.applyingUntil = Date.now() + 2200;
  recordPlay(
    message.track,
    S.members.find((member) => member.id === S.authority)?.name || partnerName(),
  );
  const expected = base + (playing ? Math.max(0, Date.now() - sentAt) : 0);
  try {
    const local = currentUri();
    if (message.track.uri && local !== message.track.uri) {
      playUri(message.track.uri).then(() => {
        window.setTimeout(() => {
          try {
            player().seek(Math.max(0, expected));
          } catch {
            /* ignore */
          }
        }, 700);
      });
    } else if (playing !== isPlayingNow()) {
      if (playing) {
        player().play();
        if (Math.abs(localProgress() - expected) > DRIFT_MS) player().seek(expected);
      } else {
        player().pause();
      }
    } else if (playing && Math.abs(localProgress() - expected) > DRIFT_MS) {
      player().seek(expected);
    }
  } catch (error) {
    log("apply", error);
  }

  renderChanged();
}

function onLocalChange(trackChanged) {
  if (!S.joined || duoIdle()) return;
  if (Date.now() < S.applyingUntil) {
    renderChanged();
    return;
  }
  if (isAuthority()) {
    pushState();
    renderChanged();
    return;
  }
  // Whoever puts a track on becomes the host: "listen to mine".
  if (trackChanged) {
    takeHost();
    return;
  }
  renderChanged();
}

function onHostMessage(conn, message) {
  if (!message || typeof message !== "object") return;
  switch (message.t) {
    case "hello": {
      S.conns.set(conn.peer, conn);
      const name = String(message.name || "Auditeur").slice(0, 40);
      const image = String(message.image || "");
      S.members = [...S.members.filter((member) => member.id !== conn.peer), { id: conn.peer, name, image }];
      if (S.mode === "duo") {
        rememberPartner(name);
        if (message.duo && message.username) linkDuo(message.username, name);
      }
      send(conn, {
        t: "welcome",
        code: S.code,
        authority: S.authority,
        hostName: S.me.name,
        hostUser: S.me.username || "",
        members: S.members,
      });
      broadcastMembers();
      if (isAuthority()) send(conn, snapshot());
      else if (S.hasRemote) send(conn, { t: "state", ...S.remote, ts: Date.now() });
      notify(S.mode === "duo" ? `${name} est là` : `${name} a rejoint la session`);
      render();
      break;
    }
    case "state": {
      if (S.authority !== conn.peer) return;
      applyState(message);
      broadcast(message, conn.peer);
      break;
    }
    case "sync": {
      if (isAuthority()) send(conn, snapshot());
      else {
        const authorityConn = S.conns.get(S.authority);
        if (authorityConn) send(authorityConn, { t: "sync" });
        else if (S.hasRemote) send(conn, { t: "state", ...S.remote, ts: Date.now() });
      }
      break;
    }
    case "queue": {
      if (isAuthority()) queueTrack(message.uri);
      else {
        const target = S.conns.get(S.authority);
        if (target) send(target, { t: "add", uri: message.uri });
      }
      break;
    }
    case "claim": {
      if (!message.from) return;
      S.authority = message.from;
      S.following = message.from !== S.peerId;
      broadcast({ t: "claim", from: message.from }, conn.peer);
      broadcastMembers();
      if (message.from !== S.peerId) {
        const member = S.members.find((entry) => entry.id === message.from);
        notify(`${member?.name ?? "Ton duo"} est l'hôte`);
      }
      render();
      break;
    }
    case "control": {
      const target = String(message.authority || "");
      if (!target) return;
      S.authority = target;
      S.following = target !== S.peerId;
      broadcast({ t: "control", authority: target }, conn.peer);
      broadcastMembers();
      if (isAuthority()) pushState();
      render();
      break;
    }
    case "bye": {
      dropMember(conn.peer);
      break;
    }
    case "profile": {
      const member = S.members.find((entry) => entry.id === conn.peer);
      if (!member) break;
      if (message.name) member.name = String(message.name).slice(0, 40);
      if (message.image) member.image = fmtImg(message.image);
      broadcastMembers();
      render();
      break;
    }
    default:
      break;
  }
}

function onGuestMessage(message) {
  if (!message || typeof message !== "object") return;
  switch (message.t) {
    case "welcome": {
      S.code = message.code || S.code;
      S.authority = message.authority || "";
      S.hostName = message.hostName || "l'hôte";
      S.members = message.members || [];
      S.joined = true;
      S.busy = false;
      S.connectingDuo = false;
      S.error = "";
      S.following = S.authority !== S.peerId;
      if (S.mode === "duo") {
        rememberPartner(S.hostName);
        if (message.hostUser) linkDuo(message.hostUser, S.hostName);
      }
      render();
      send(S.hostConn, { t: "sync" });
      break;
    }
    case "members": {
      S.members = message.members || [];
      if (message.authority) S.authority = message.authority;
      render();
      break;
    }
    case "profile": {
      const host = S.members.find((entry) => entry.id === conn.peer);
      if (!host) break;
      if (message.name) host.name = String(message.name).slice(0, 40);
      if (message.image) host.image = fmtImg(message.image);
      render();
      break;
    }
    case "claim": {
      if (!message.from) return;
      S.authority = message.from;
      S.following = message.from !== S.peerId;
      if (message.from !== S.peerId) {
        const member = S.members.find((entry) => entry.id === message.from);
        notify(`${member?.name ?? "Ton duo"} est l'hôte`);
      }
      render();
      break;
    }
    case "control": {
      if (message.authority) S.authority = message.authority;
      S.following = S.authority !== S.peerId;
      notify(isAuthority() ? "Tu es l'hôte" : "L'hôte a changé");
      render();
      if (isAuthority()) pushState();
      break;
    }
    case "state":
      applyState(message);
      break;
    case "add":
      if (isAuthority()) queueTrack(message.uri);
      break;
    case "sync":
      if (isAuthority()) pushState();
      break;
    default:
      break;
  }
}

function dropMember(peerId) {
  S.conns.delete(peerId);
  S.members = S.members.filter((member) => member.id !== peerId);
  if (S.authority === peerId) {
    S.authority = S.peerId;
    S.following = false;
    broadcast({ t: "control", authority: S.authority });
    pushState();
  }
  broadcastMembers();
  render();
}

function createPeer(id) {
  const peer = id ? new Peer(id, PEER_CONFIG) : new Peer(undefined, PEER_CONFIG);
  peer.on("disconnected", () => {
    try {
      peer.reconnect();
    } catch (error) {
      log("reconnect", error);
    }
  });
  return peer;
}

function startHost(options = {}, attempt = 0) {
  if (S.joined) return;
  const duo = Boolean(options.duo);
  const code = options.code || makeCode();
  if (!options.quiet) S.busy = true;
  S.error = "";
  render();

  const peerId = duo ? duoPeerId(code) : PEER_PREFIX + code.toLowerCase();
  let peer;
  try {
    peer = createPeer(peerId);
    S.pendingPeer = peer;
  } catch (error) {
    S.busy = false;
    S.error = "Impossible de créer la session (WebRTC indisponible).";
    render();
    return;
  }

  peer.on("open", () => {
    S.peer = peer;
    S.pendingPeer = null;
    S.role = "host";
    S.mode = duo ? "duo" : "manual";
    S.following = false;
    S.connectingDuo = false;
    S.code = code;
    S.peerId = peerId;
    S.authority = peerId;
    S.hostName = S.me.name;
    S.members = [{ id: peerId, name: S.me.name, image: S.me.image }];
    S.joined = true;
    S.busy = false;
    S.error = "";
    if (!duo) notify(`Session ${code} ouverte`);
    render();
    pushState();
  });

  peer.on("connection", (conn) => {
    conn.on("open", () => {
      S.conns.set(conn.peer, conn);
      render();
    });
    conn.on("data", (message) => onHostMessage(conn, message));
    conn.on("close", () => dropMember(conn.peer));
    conn.on("error", (error) => {
      log("conn", error);
      dropMember(conn.peer);
    });
  });

  peer.on("error", (error) => {
    const type = error?.type;
    if (type === "unavailable-id" && duo) {
      // The partner already owns the duo id: join them instead of hosting.
      S.pendingPeer = null;
      try {
        peer.destroy();
      } catch {
        /* ignore */
      }
      joinSession(code, { duo: true, quiet: true });
      return;
    }
    if (type === "unavailable-id" && attempt < 4) {
      try {
        peer.destroy();
      } catch {
        /* ignore */
      }
      startHost(options, attempt + 1);
      return;
    }
    if (S.joined) {
      log("peer error", error);
      return;
    }
    S.pendingPeer = null;
    S.busy = false;
    S.connectingDuo = false;
    S.error =
      type === "network" || type === "server-error"
        ? "Serveur de connexion injoignable. Vérifie ta connexion."
        : error?.message || "Impossible de créer la session.";
    render();
    if (duo) {
      // Un duo ne renonce pas : on retente dès que la socket est retombée.
      window.setTimeout(() => {
        if (S.duo && !S.joined && !S.connectingDuo && !S.duoPaused) connectDuo();
      }, 1500);
    }
  });
}

function joinSession(raw, options = {}) {
  if (S.joined || S.busy) return;
  const duo = Boolean(options.duo);
  const code = normalizeCode(raw);
  if (code.length < 4) {
    S.error = duo ? "Code duo invalide." : "Entre un code de session valide.";
    S.connectingDuo = false;
    render();
    return;
  }

  if (!options.quiet) S.busy = true;
  S.error = "";
  render();

  let peer;
  try {
    peer = createPeer();
  } catch (error) {
    S.busy = false;
    S.error = "Impossible de se connecter (WebRTC indisponible).";
    render();
    return;
  }

  let settled = false;
  const timer = window.setTimeout(() => {
    if (settled) return;
    settled = true;
    S.busy = false;
    S.error = "Connexion impossible : réseau trop restrictif (NAT). Essaie un autre réseau.";
    try {
      peer.destroy();
    } catch {
      /* ignore */
    }
    render();
  }, 20000);

  peer.on("open", () => {
    const conn = peer.connect(duo ? duoPeerId(code) : PEER_PREFIX + code.toLowerCase(), { reliable: true });
    S.hostConn = conn;

    conn.on("open", () => {
      settled = true;
      window.clearTimeout(timer);
      S.peer = peer;
      S.role = "guest";
      S.mode = duo ? "duo" : "manual";
      S.code = code;
      S.peerId = peer.id;
      S.connectingDuo = false;
      send(conn, { t: "hello", name: S.me.name, image: S.me.image, duo, username: S.me.username || "" });
      render();
      window.setTimeout(() => {
        if (S.joined) return;
        S.busy = false;
        S.error = "L'hôte ne répond pas. Vérifie le code et réessaie.";
        resetSession();
        render();
      }, 6000);
    });

    conn.on("data", (message) => onGuestMessage(message));

    conn.on("close", () => {
      if (!S.joined) return;
      resetSession();
      S.error = "Connexion perdue avec l'hôte.";
      render();
      notify("Connexion perdue avec l'hôte", true);
    });
  });

  peer.on("error", (error) => {
    const type = error?.type;
    if (S.joined) {
      log("peer error", error);
      return;
    }
    window.clearTimeout(timer);
    settled = true;
    S.busy = false;
    S.connectingDuo = false;
    if (duo) {
      // Partner offline: stay quiet and let the retry loop take over.
      try {
        peer.destroy();
      } catch {
        /* ignore */
      }
      render();
      return;
    }
    if (type === "peer-unavailable") {
      S.error = `Aucune session active avec le code ${code}.`;
    } else if (type === "network" || type === "server-error") {
      S.error = "Serveur de connexion injoignable. Vérifie ta connexion.";
    } else {
      S.error = error?.message || "Connexion impossible.";
    }
    try {
      peer.destroy();
    } catch {
      /* ignore */
    }
    render();
  });
}

function resetSession() {
  S.joined = false;
  S.busy = false;
  S.role = null;
  S.mode = "manual";
  S.following = false;
  S.connectingDuo = false;
  if (S.pendingPeer) {
    try {
      S.pendingPeer.destroy();
    } catch {
      /* ignore */
    }
    S.pendingPeer = null;
  }
  S.code = "";
  S.peerId = "";
  S.authority = "";
  S.hostName = "";
  S.members = [];
  S.conns.clear();
  S.hostConn = null;
  S.hasRemote = false;
  S.copied = null;
  if (S.peer) {
    try {
      S.peer.destroy();
    } catch {
      /* ignore */
    }
    S.peer = null;
  }
}

/**
 * Quitter un duo ne coupe plus le lien : on arrête de suivre, mais on reste
 * joignable pour voir ce que l'autre écoute (et éventuellement le rejoindre).
 */
function leave(silent = false, hard = false) {
  if (!S.joined) {
    resetSession();
    render();
    return;
  }
  if (S.mode === "duo" && S.duo && !hard) {
    S.following = false;
    S.duoPaused = true;
    if (!silent) notify("Tu as quitté la session · le duo reste connecté");
    render();
    return;
  }
  const wasHost = S.role === "host";
  if (S.mode === "duo") S.duoPaused = true;
  if (wasHost) broadcast({ t: "bye" });
  else send(S.hostConn, { t: "bye" });
  resetSession();
  render();
  if (!silent) notify(wasHost ? "Session terminée" : "Tu as quitté la session");
}

function giveControl(memberId) {
  if (!S.joined) return;
  if (S.role !== "host" && !isAuthority()) return;
  const target = memberId === S.peerId ? S.peerId : memberId;
  if (!target || target === S.authority) return;
  S.authority = target;
  // Whoever hands the role over becomes a listener of the new host.
  S.following = target !== S.peerId;
  const message = { t: "control", authority: target };
  if (S.role === "host") {
    broadcast(message);
    broadcastMembers();
  } else {
    send(S.hostConn, message);
  }
  if (isAuthority()) pushState();
  render();
  const member = S.members.find((entry) => entry.id === target);
  notify(target === S.peerId ? "Tu es l'hôte" : `${member?.name ?? "Ton duo"} est l'hôte`);
}

function requestQueue(uri) {
  if (!S.joined || !uri) return;
  if (isAuthority()) {
    queueTrack(uri);
    return;
  }
  if (S.role === "host") {
    const target = S.conns.get(S.authority);
    if (target) send(target, { t: "add", uri });
    else queueTrack(uri);
    return;
  }
  send(S.hostConn, { t: "queue", uri });
  notify("Demande envoyée");
}

function resync() {
  if (S.role === "host") {
    const target = S.conns.get(S.authority);
    if (target) send(target, { t: "sync" });
  } else {
    send(S.hostConn, { t: "sync" });
  }
  notify("Resynchronisation…");
}

/* ------------------------------ view ------------------------------ */

function viewState() {
  if (isAuthority()) {
    return {
      track: trackInfo(),
      playing: isPlayingNow(),
      progress: smoothLocalProgress(),
      canControl: true,
    };
  }
  const remote = S.remote;
  const elapsed = remote.playing ? Date.now() - remote.at : 0;
  // While following, the local player IS the shared playback: read it directly
  // instead of extrapolating the last state we received (up to 1.5s stale).
  const localIsShared = Boolean(S.following && remote.uri && currentUri() === remote.uri);
  return {
    track: remote.uri
      ? {
          uri: remote.uri,
          name: remote.name,
          artist: remote.artist,
          art: remote.art,
          duration: remote.duration,
        }
      : null,
    playing: localIsShared ? isPlayingNow() : remote.playing,
    progress: localIsShared ? smoothLocalProgress() : remote.progress + elapsed,
    canControl: false,
  };
}

function avatarHTML(member) {
  if (member.image) {
    return `<img class="bonk-avatar" src="${esc(member.image)}" alt="" />`;
  }
  return `<span class="bonk-avatar bonk-initial" style="background:${hueFor(member.name)}">${esc(initials(member.name))}</span>`;
}

function headHTML() {
  const authMember = S.members.find((member) => member.id === S.authority);
  let subtitle = "Écouter ensemble";
  if (S.joined) {
    if (isAuthority()) {
      subtitle =
        S.role === "host" && S.mode === "manual"
          ? `Tu es l'hôte · ${S.members.length} connecté(s)`
          : "Tu es l'hôte";
    } else if (S.mode === "duo") {
      subtitle = `Hôte : ${authMember?.name ?? partnerName()}`;
    } else {
      subtitle = `Hôte : ${authMember?.name ?? (S.hostName || "en attente")}`;
    }
  } else if (S.connectingDuo) {
    subtitle = "Connexion au duo…";
  } else if (S.busy) {
    subtitle = "Connexion…";
  }
  return `
    <div class="bonk-brand">
      <span class="bonk-mark">${ICON.jam}</span>
      <span class="bonk-brand-text">
        <span class="bonk-title">BONK</span>
        <span class="bonk-subtitle">${esc(subtitle)}</span>
      </span>
    </div>
    <div class="bonk-head-actions">
      ${S.joined ? `<span class="bonk-status ${isAuthority() ? "live" : ""}"></span>` : ""}
      <button class="bonk-icon-btn" data-act="close" title="Fermer">${ICON.close}</button>
    </div>`;
}

function idleHTML() {
  if (S.duo && !duoLinked()) return pendingHTML();
  return `
    <div class="bonk-hero">
      <div class="bonk-hero-mark">${ICON.jam}</div>
      <h2>Écoutez ensemble</h2>
      <p>Lance une session, partage le code, et choisis qui est l'hôte. Tout le monde entend le même morceau, au même moment.</p>
    </div>
    <button class="bonk-btn bonk-primary" data-act="create" ${S.busy ? "disabled" : ""}>
      ${S.busy ? "Ouverture…" : "Créer une session"}
    </button>
    <div class="bonk-divider"><span>ou rejoindre</span></div>
    <div class="bonk-join">
      <input id="bonk-code" class="bonk-input" placeholder="CODE" maxlength="8" autocomplete="off" spellcheck="false"
        value="${esc(S.input)}" ${S.busy ? "disabled" : ""} />
      <button class="bonk-btn" data-act="join" ${S.busy ? "disabled" : ""}>Rejoindre</button>
    </div>
    ${S.error ? `<div class="bonk-error">${esc(S.error)}</div>` : ""}
    ${duoHTML()}
    ${statsHTML()}`;
}

/* ----------------------------- stats ----------------------------- */

const STATS_KEY = "bonk.stats";
const STATS_PREFIX = "bonk.stats.";
const STATS_MAX = 800;

function statsKey() {
  const pair = pairId();
  return pair ? STATS_PREFIX + pair : "";
}

/** Les stats n'ont de sens qu'entre deux personnes identifiées. */
function refreshStats() {
  S.stats = loadStats();
  S.statsOpen = false;
  S.lastRecorded = null;
  renderChanged();
}

function loadStats() {
  const key = statsKey();
  if (!key) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.plays) ? parsed.plays.filter((play) => play && play.u) : [];
  } catch {
    return [];
  }
}

function saveStats() {
  const key = statsKey();
  if (!key) return;
  try {
    window.localStorage.setItem(key, JSON.stringify({ v: 1, plays: S.stats.slice(-STATS_MAX) }));
  } catch (error) {
    log("stats storage", error);
  }
  scheduleStatsPush();
}

/** Rapproche les stats locales et celles retrouvées en ligne, sans doublon. */
function mergeStats(remote) {
  if (!statsKey() || !Array.isArray(remote) || !remote.length) return;
  const seen = new Set(S.stats.map((play) => `${play.u}|${play.t}`));
  let added = 0;
  for (const play of remote) {
    if (!play?.u) continue;
    const id = `${play.u}|${play.t}`;
    if (seen.has(id)) continue;
    seen.add(id);
    S.stats.push(play);
    added += 1;
  }
  if (!added) return;
  S.stats.sort((a, b) => (Number(a.t) || 0) - (Number(b.t) || 0));
  if (S.stats.length > STATS_MAX) S.stats = S.stats.slice(-STATS_MAX);
  saveStats();
  renderChanged();
}

/** Counts a track once, the first time it starts in a duo session. */
function recordPlay(track, byName) {
  if (!track?.uri || !String(track.uri).startsWith("spotify:track:")) return;
  if (S.mode !== "duo" || duoIdle() || !duoLinked()) return;
  if (S.lastRecorded === track.uri) return;
  S.lastRecorded = track.uri;
  S.stats.push({
    u: track.uri,
    n: track.name || "",
    a: track.artist || "",
    i: track.art || "",
    d: Number(track.duration) || 0,
    t: Date.now(),
    by: byName || "",
  });
  if (S.stats.length > STATS_MAX) S.stats = S.stats.slice(-STATS_MAX);
  saveStats();
  renderChanged();
}

function fmtHours(ms) {
  const minutes = Math.round((Number(ms) || 0) / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = (Number(ms) || 0) / 3600000;
  return `${hours.toFixed(hours < 10 ? 1 : 0)} h`;
}

function statsSummary() {
  const tracks = new Map();
  const artists = new Map();
  let ms = 0;
  for (const play of S.stats) {
    const entry = tracks.get(play.u) || { uri: play.u, name: play.n, artist: play.a, art: play.i, count: 0 };
    entry.count += 1;
    tracks.set(play.u, entry);
    String(play.a || "")
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .forEach((name) => artists.set(name, (artists.get(name) || 0) + 1));
    ms += Number(play.d) || 0;
  }
  return {
    plays: S.stats.length,
    ms,
    unique: tracks.size,
    topTracks: [...tracks.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    topArtists: [...artists.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count })),
  };
}

function statsHTML() {
  if (!duoLinked()) return "";
  if (!S.stats.length) {
    return `<div class="bonk-stats-empty">${ICON.chart} Les stats du duo apparaîtront dès vos premières écoutes ensemble.</div>`;
  }

  const summary = statsSummary();
  const head = `
    <button class="bonk-stats-head" data-act="stats-toggle">
      <span class="bonk-stats-title">${ICON.chart} Stats du duo</span>
      <span class="bonk-stats-summary">${summary.plays} écoutes · ${fmtHours(summary.ms)}${
        summary.topArtists[0] ? ` · ${esc(summary.topArtists[0].name)}` : ""
      }</span>
      <span class="bonk-chevron">${S.statsOpen ? "▾" : "▸"}</span>
    </button>`;
  if (!S.statsOpen) return head;

  const rows = summary.topTracks
    .slice(0, 4)
    .map(
      (track) => `
      <div class="bonk-top-row">
        ${track.art ? `<img class="bonk-top-art" src="${esc(track.art)}" alt="" />` : '<span class="bonk-top-art"></span>'}
        <span class="bonk-top-info"><b>${esc(track.name)}</b><small>${esc(track.artist)}</small></span>
        <span class="bonk-count">${track.count}×</span>
      </div>`,
    )
    .join("");

  const chips = summary.topArtists
    .slice(0, 5)
    .map((artist) => `<span class="bonk-chip">${esc(artist.name)} <b>${artist.count}</b></span>`)
    .join("");

  return `${head}
    <div class="bonk-stats-grid">
      <div><b>${summary.plays}</b><small>écoutes</small></div>
      <div><b>${fmtHours(summary.ms)}</b><small>ensemble</small></div>
      <div><b>${summary.unique}</b><small>titres</small></div>
    </div>
    <div class="bonk-section"><span>Top titres</span></div>
    <div class="bonk-top">${rows}</div>
    <div class="bonk-section"><span>Artistes</span></div>
    <div class="bonk-chips">${chips}</div>
    <div class="bonk-stats-actions"><button class="bonk-mini bonk-mini-ghost" data-act="stats-reset">Réinitialiser</button></div>`;
}

function pendingHTML() {
  return `
    <div class="bonk-hero">
      <div class="bonk-hero-mark">${ICON.jam}</div>
      <h2>Duo en attente</h2>
      <p>Ton duo existera dès que l'autre personne aura saisi ce code. Les stats démarreront à ce moment-là.</p>
    </div>
    <div class="bonk-duo-code bonk-duo-code-big">
      <span class="bonk-code-label">Code duo</span>
      <b>${esc(S.duo?.code || "")}</b>
      <button class="bonk-mini bonk-mini-ghost" data-act="duo-copy">${S.copied ? "copié" : "copier"}</button>
    </div>
    <div class="bonk-hint">${ICON.note} ${S.joined ? "En attente de ton binôme" : S.connectingDuo ? "Ouverture…" : "En veille"}</div>
    <button class="bonk-btn bonk-ghost bonk-full" data-act="duo-cancel">Annuler l'invitation</button>
    ${cloudHTML()}`;
}

function duoHTML() {
  if (duoLinked()) {
    const label = S.duo.partnerName || "en attente de l'autre côté";
    const state = S.connectingDuo
      ? "Connexion…"
      : S.duoPaused
        ? "En pause"
        : S.joined
          ? "Connecté"
          : "En veille";
    return `
      <div class="bonk-duo">
        <span class="bonk-duo-icon">${ICON.note}</span>
        <span class="bonk-duo-text">
          <b>Duo · ${esc(label)}</b>
          <small>${esc(state)} · reconnexion automatique</small>
        </span>
        <div class="bonk-actions">
          ${S.duoPaused && !S.following ? `<button class="bonk-mini" data-act="duo-reconnect">Reprendre</button>` : ""}
          <button class="bonk-mini ${S.confirmUnlink ? "bonk-mini-danger" : "bonk-mini-ghost"}" data-act="duo-leave">${
            S.confirmUnlink ? "Confirmer" : "Délier"
          }</button>
        </div>
      </div>
      <div class="bonk-duo-code">
        <span class="bonk-code-label">Code duo</span>
        <b>${esc(S.duo.code)}</b>
        <button class="bonk-mini bonk-mini-ghost" data-act="duo-copy">${S.copied ? "copié" : "copier"}</button>
      </div>
      ${
        S.joined && S.remote?.uri && S.authority && S.authority !== S.peerId
          ? `<div class="bonk-duo-live">
              <span class="bonk-duo-live-text">${ICON.note} ${esc(
                `${S.members.find((member) => member.id === S.authority)?.name ?? "Ton duo"} écoute ${S.remote.name || "un titre"}`,
              )}</span>
              <button class="bonk-mini" data-act="duo-follow">Rejoindre</button>
            </div>`
          : ""
      }
      <button class="bonk-mini ${S.autoJoin ? "bonk-mini-on" : "bonk-mini-ghost"}" data-act="autojoin">
        ${S.autoJoin ? "Rejoindre auto · oui" : "Rejoindre auto · non"}
      </button>
      ${cloudHTML()}`;
  }
  return `
    <div class="bonk-divider"><span>toujours ensemble</span></div>
    <div class="bonk-join">
      <input id="bonk-duo-input" class="bonk-input" placeholder="CODE DUO" maxlength="8" autocomplete="off" spellcheck="false"
        value="${esc(S.duoInput)}" ${S.busy ? "disabled" : ""} />
      <button class="bonk-btn" data-act="duo-join" ${S.busy ? "disabled" : ""}>Activer</button>
    </div>
    <button class="bonk-btn bonk-ghost bonk-full" data-act="duo-create">Créer un duo permanent</button>
    ${cloudHTML()}
    <div class="bonk-hint">${ICON.note} Un code une fois, puis connexion automatique</div>`;
}

function roomHTML() {
  const view = viewState();
  const track = view.track;
  const canControl = view.canControl;
  const isHost = S.role === "host";
  const authMember = S.members.find((member) => member.id === S.authority);
  const authName = authMember?.name ?? "l'hôte";

  const membersHTML = S.members
    .map((member) => {
      const isMe = member.id === S.peerId;
      const isLead = member.id === S.authority;
      const canHandOver = !isMe && (isAuthority() || (isHost && S.mode === "manual"));
      const actions = canHandOver
        ? `<button class="bonk-mini ${isLead ? "bonk-mini-ghost" : ""}" data-act="give" data-id="${esc(member.id)}"
             title="${isLead ? "Reprendre le rôle d'hôte" : "Passer le rôle d'hôte"}">${isLead ? "Reprendre" : "Passer l'hôte"}</button>`
        : "";
      return `
        <div class="bonk-member ${isLead ? "bonk-member-host" : ""}">
          ${avatarHTML(member)}
          <span class="bonk-member-name">${esc(member.name)}${isMe ? "<em> toi</em>" : ""}</span>
          ${isLead ? `<span class="bonk-tag bonk-tag-host">${ICON.crown} hôte</span>` : '<span class="bonk-tag">auditeur</span>'}
          ${actions}
        </div>`;
    })
    .join("");

  return `
    <div class="bonk-np">
      <div class="bonk-art">
        ${track?.art ? `<img src="${esc(track.art)}" alt="" />` : '<span class="bonk-art-ph">♪</span>'}
        ${view.playing ? '<span class="bonk-eq"><i></i><i></i><i></i><i></i></span>' : ""}
      </div>
      <div class="bonk-np-info">
        <span class="bonk-np-label">${view.playing ? "En lecture" : track ? "En pause" : "En attente"}</span>
        <span class="bonk-np-title">${esc(track?.name ?? "Rien en lecture")}</span>
        <span class="bonk-np-artist">${esc(track?.artist ?? "Lance un morceau dans Spotify")}</span>
      </div>
    </div>

    <div class="bonk-progress ${canControl ? "bonk-progress-live" : ""}" data-act="${canControl ? "seek" : ""}">
      <div class="bonk-progress-fill"></div>
    </div>
    <div class="bonk-times"><span class="bonk-cur">0:00</span><span class="bonk-dur">0:00</span></div>

    ${
      canControl
        ? `<div class="bonk-transport">
             <button class="bonk-round" data-act="prev" title="Précédent">${ICON.prev}</button>
             <button class="bonk-round bonk-play" data-act="toggle" title="Lecture / pause">${view.playing ? ICON.pause : ICON.play}</button>
             <button class="bonk-round" data-act="next" title="Suivant">${ICON.next}</button>
           </div>`
        : `<div class="bonk-host-note">${ICON.crown} Hôte <b>${esc(authName)}</b></div>
           <div class="bonk-actions">
             ${
               S.following
                 ? `<button class="bonk-mini bonk-mini-ghost" data-act="resync">${ICON.refresh} Resynchroniser</button>
                    <button class="bonk-mini bonk-mini-ghost" data-act="unfollow">Me désynchroniser</button>`
                 : `<button class="bonk-mini" data-act="follow">${ICON.headphones} Écouter avec</button>`
             }
             <button class="bonk-mini bonk-mini-ghost" data-act="claim">Prendre l'hôte</button>
           </div>`
    }

    ${
      isHost
        ? `<button class="bonk-code" data-act="copy" title="Copier le code">
             <span class="bonk-code-label">Code</span>
             <span class="bonk-code-value">${esc(S.code)}</span>
             <span class="bonk-code-action">${S.copied ? ICON.check + " copié" : ICON.copy}</span>
           </button>`
        : ""
    }

    <div class="bonk-section"><span>Membres</span><span>${S.members.length}</span></div>
    <div class="bonk-members">${membersHTML}</div>
    ${statsHTML()}
    ${S.error ? `<div class="bonk-error">${esc(S.error)}</div>` : ""}
    <button class="bonk-btn bonk-ghost bonk-full" data-act="leave">${isHost ? "Terminer la session" : "Quitter la session"}</button>`;
}

function signature() {
  const view = viewState();
  return [
    view.track?.uri || "",
    view.playing ? 1 : 0,
    S.members.map((member) => `${member.id}:${member.name}`).join(","),
    S.authority,
    S.error,
    S.copied ? "copied" : "",
    S.joined ? "joined" : "idle",
    S.busy ? "busy" : "",
    S.following ? "following" : "free",
    S.duo ? `duo:${S.duo.code}:${S.duo.partnerName}` : "noduo",
    S.autoJoin ? "autojoin" : "",
    S.statsOpen ? "stats-open" : "stats-closed",
    `plays:${S.stats.length}`,
    S.lastRecorded || "",
    S.connectingDuo ? "connecting" : "",
    S.duoPaused ? "paused" : "",
    S.confirmUnlink ? "confirm-unlink" : "",
    readCloudKey() ? "cloud-on" : "cloud-off",
    canControlSignature(),
  ].join("|");
}

function canControlSignature() {
  return isAuthority() ? "host" : "listener";
}

/** Re-renders only when something visible actually changed (avoids DOM thrash). */
function renderChanged() {
  if (!S.el.panel) return;
  if (signature() === S.sig) return;
  render();
}

function render() {
  if (!S.el.panel) return;
  S.sig = signature();
  S.el.panel.classList.toggle("bonk-open", S.open);
  if (S.el.button) S.el.button.classList.toggle("bonk-trigger-on", S.open);
  S.el.head.innerHTML = headHTML();
  const pendingDuo = Boolean(S.duo && !duoLinked());
  S.el.body.innerHTML = S.joined && !pendingDuo && !duoIdle() ? roomHTML() : idleHTML();
  updateProgress();
  startProgressLoop();
}

/** Repaints the progress bar straight from the player on every frame. */
function paintProgress() {
  if (!S.open || !S.el.panel) {
    S.progressRaf = 0;
    return;
  }
  updateProgress();
  const next = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 16));
  S.progressRaf = next.call(window, paintProgress);
}

function startProgressLoop() {
  if (S.progressRaf || !S.open || !S.el.panel) return;
  const first = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 16));
  S.progressRaf = first.call(window, paintProgress);
}

function updateProgress() {
  const panel = S.el.panel;
  if (!panel) return;
  const fill = panel.querySelector(".bonk-progress-fill");
  if (!fill) return;
  const view = viewState();
  const duration = view.track?.duration || 0;
  const percent = duration > 0 ? Math.min(100, Math.max(0, (view.progress / duration) * 100)) : 0;
  fill.style.width = `${percent}%`;
  const cur = panel.querySelector(".bonk-cur");
  const dur = panel.querySelector(".bonk-dur");
  if (cur) cur.textContent = fmtTime(view.progress);
  if (dur) dur.textContent = fmtTime(duration);
}

/* ------------------------------ ui ------------------------------ */

function injectStyles() {
  if (document.getElementById("bonk-styles")) return;
  const style = document.createElement("style");
  style.id = "bonk-styles";
  // The display face ships inside the bundle: no network call, no CSP issue.
  style.textContent = `@font-face{font-family:"BONK Display";src:url("${displayFont}") format("woff2");font-weight:400;font-display:swap;}${panelCss}`;
  document.head.appendChild(style);
}

function createPanel() {
  if (document.getElementById("bonk-panel")) return;
  const panel = document.createElement("div");
  panel.id = "bonk-panel";
  panel.innerHTML = '<div class="bonk-head"></div><div class="bonk-body"></div>';
  panel.addEventListener("click", onClick);
  panel.addEventListener("input", onInput);
  panel.addEventListener("keydown", onKeyDown);
  document.body.appendChild(panel);
  S.el.panel = panel;
  S.el.head = panel.querySelector(".bonk-head");
  S.el.body = panel.querySelector(".bonk-body");
}

function togglePanel(force) {
  S.open = typeof force === "boolean" ? force : !S.open;
  render();
}

function onClick(event) {
  const target = event.target.closest("[data-act]");
  if (!target || !S.el.panel.contains(target)) return;
  const act = target.dataset.act;
  if (!act) return;
  event.preventDefault();
  event.stopPropagation();

  switch (act) {
    case "close":
      togglePanel(false);
      break;
    case "create":
      startHost();
      break;
    case "join":
      joinSession(S.input || "");
      break;
    case "copy":
      copyCode();
      break;
    case "leave":
      leave();
      break;
    case "give":
      giveControl(target.dataset.id || S.peerId);
      break;
    case "toggle":
      if (!isAuthority()) return;
      try {
        if (isPlayingNow()) player().pause();
        else player().play();
      } catch (error) {
        log(error);
      }
      pushState();
      render();
      break;
    case "next":
      if (!isAuthority()) return;
      try {
        player().next ? player().next() : player().skip();
      } catch (error) {
        log(error);
      }
      window.setTimeout(pushState, 350);
      break;
    case "prev":
      if (!isAuthority()) return;
      try {
        player().back();
      } catch (error) {
        log(error);
      }
      window.setTimeout(pushState, 350);
      break;
    case "seek": {
      if (!isAuthority()) return;
      const track = trackInfo();
      const bar = target.querySelector(".bonk-progress-fill") ? target : target.closest(".bonk-progress");
      if (!bar || !track?.duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      try {
        player().seek(Math.round(ratio * track.duration));
      } catch (error) {
        log(error);
      }
      pushState();
      render();
      break;
    }
    case "resync":
      resync();
      break;
    case "follow":
      startFollowing();
      break;
    case "unfollow":
      S.following = false;
      render();
      break;
    case "claim":
      takeHost();
      break;
    case "duo-create":
      createDuo();
      break;
    case "duo-join":
      joinDuoFromInput();
      break;
    case "duo-leave":
      if (!S.confirmUnlink) {
        S.confirmUnlink = true;
        render();
        window.setTimeout(() => {
          if (!S.confirmUnlink) return;
          S.confirmUnlink = false;
          render();
        }, 4000);
        break;
      }
      S.confirmUnlink = false;
      unbindDuo();
      break;
    case "duo-cancel":
      // Annuler doit aussi fermer la salle d'attente, sinon le panneau
      // retombe sur une session sans duo.
      unbindDuo();
      break;
    case "duo-copy":
      if (S.duo) copyCode(S.duo.code);
      break;
    case "duo-reconnect":
      followDuo();
      connectDuo();
      break;
    case "duo-follow":
      followDuo();
      break;
    case "autojoin":
      S.autoJoin = !S.autoJoin;
      saveAutoJoin();
      render();
      notify(S.autoJoin ? "Rejoindre automatiquement : activé" : "Rejoindre automatiquement : désactivé");
      break;
    case "cloud-restore":
      syncCloud().then((found) => {
        if (!found && S.duo) cloudPush();
      });
      break;
    case "stats-toggle":
      S.statsOpen = !S.statsOpen;
      render();
      break;
    case "stats-reset":
      S.stats = [];
      S.lastRecorded = null;
      saveStats();
      render();
      notify("Stats du duo réinitialisées");
      break;
    default:
      break;
  }
}

function onInput(event) {
  if (event.target.id === "bonk-code") S.input = normalizeCode(event.target.value);
  if (event.target.id === "bonk-duo-input") S.duoInput = normalizeCode(event.target.value);
}

function onKeyDown(event) {
  if (event.key !== "Enter") return;
  if (event.target.id === "bonk-code") {
    event.preventDefault();
    joinSession(S.input || "");
  }
  if (event.target.id === "bonk-duo-input") {
    event.preventDefault();
    joinDuoFromInput();
  }
}

async function copyCode(value = S.code) {
  try {
    await navigator.clipboard.writeText(value);
    S.copied = Date.now();
    render();
    window.setTimeout(() => {
      S.copied = null;
      render();
    }, 1600);
  } catch {
    notify(`Code : ${S.code}`);
  }
}

function registerButton() {
  const Spicetify = window.Spicetify;
  try {
    if (Spicetify.Playbar?.Button) {
      const button = new Spicetify.Playbar.Button("BONK", PLAYBAR_ICON, () => togglePanel());
      button.register();
      S.el.button = button.element;
      return;
    }
  } catch (error) {
    log("playbar", error);
  }
  try {
    if (Spicetify.Topbar?.Button) new Spicetify.Topbar.Button("BONK", PLAYBAR_ICON, () => togglePanel());
  } catch (error) {
    log("topbar", error);
  }
}

function registerContextMenu() {
  try {
    const item = new window.Spicetify.ContextMenu.Item(
      "Ajouter à la session BONK",
      (uris) => {
        (uris || []).filter((uri) => String(uri).includes(":track:")).forEach((uri) => requestQueue(uri));
      },
      (uris) => S.joined && (uris || []).some((uri) => String(uri).includes(":track:")),
      "plus-alt",
    );
    item.register();
  } catch (error) {
    log("context menu", error);
  }
}

const ME_KEY = "bonk.me";

function cachedMe() {
  try {
    const raw = window.localStorage.getItem(ME_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      name: String(parsed?.name || "").slice(0, 40),
      image: fmtImg(parsed?.image),
      username: String(parsed?.username || "").slice(0, 60),
    };
  } catch {
    return { name: "", image: "", username: "" };
  }
}

function cacheMe(me) {
  try {
    window.localStorage.setItem(
      ME_KEY,
      JSON.stringify({ name: me.name, image: me.image, username: me.username || "" }),
    );
  } catch (error) {
    log("me storage", error);
  }
}

/** Walks a payload looking for the signed-in user (name and/or avatar). */
function scanProfile(node, depth = 0) {
  if (!node || typeof node !== "object" || depth > 7) return null;
  if (Array.isArray(node)) {
    for (const item of node) {
      const hit = scanProfile(item, depth + 1);
      if (hit) return hit;
    }
    return null;
  }
  const uri = typeof node.uri === "string" ? node.uri : "";
  if (/^spotify:user:/.test(uri) || "displayName" in node || "avatar" in node || "profileImage" in node) {
    const name = String(node.displayName || node.name || node.username || "").trim().slice(0, 40);
    const username = String(node.username || (uri.startsWith("spotify:user:") ? uri.slice(13) : ""))
      .trim()
      .toLowerCase()
      .slice(0, 60);
    const image = fmtImg(
      node.avatar?.url ||
        node.avatar?.uri ||
        node.avatar?.imageUrl ||
        node.avatar?.sources?.[0]?.url ||
        node.profileImage?.url ||
        node.profileImage ||
        node.imageUrl ||
        node.image ||
        (Array.isArray(node.images) ? node.images[0]?.url || node.images[0] : ""),
    );
    if (name || image || username) return { name, image, username };
  }
  for (const key of Object.keys(node)) {
    const hit = scanProfile(node[key], depth + 1);
    if (hit) return hit;
  }
  return null;
}

/** Last resort: the profile widget Spotify always renders in the top bar. */
function meFromDom() {
  const result = { name: "", image: "" };
  try {
    const box = document.querySelector(
      '[data-testid="user-widget-link"], .main-userWidget-box, .main-userWidget-user',
    );
    const img = box?.querySelector("img") || document.querySelector('[data-testid="user-widget-link"] img');
    result.image = fmtImg(img?.src || img?.getAttribute("src"));
    const label =
      box?.getAttribute("aria-label") || box?.querySelector("[aria-label]")?.getAttribute("aria-label") || "";
    const clean = String(label).trim();
    if (clean && !/^(profil|profile|compte|account|paramètres|settings)/i.test(clean)) {
      result.name = clean.slice(0, 40);
    }
  } catch (error) {
    log("me dom", error);
  }
  return result;
}

async function loadMe() {
  const cached = cachedMe();
  S.me = { name: cached.name, image: cached.image, username: cached.username };

  const sources = [
    ["UserAPI", () => window.Spicetify.Platform?.UserAPI?.getUser?.()],
    [
      "GraphQL",
      () =>
        window.Spicetify.GraphQL?.Definitions?.profileAttributes
          ? window.Spicetify.GraphQL.Request(window.Spicetify.GraphQL.Definitions.profileAttributes)
          : null,
    ],
    ["identity", () => window.Spicetify.CosmosAsync?.get?.("sp://identity/v1/profile")],
    ["identity-user", () => window.Spicetify.CosmosAsync?.get?.("sp://identity/v1/user")],
  ];

  for (const [label, run] of sources) {
    if (S.me.name && S.me.image) break;
    try {
      const profile = scanProfile(await run());
      if (!profile) continue;
      S.me = {
        name: profile.name || S.me.name,
        image: profile.image || S.me.image,
        username: profile.username || S.me.username,
      };
      log("me", label, S.me.name || "?", S.me.image ? "photo" : "sans photo");
    } catch (error) {
      log("me " + label, error);
    }
  }

  if (!S.me.name || !S.me.image) {
    const dom = meFromDom();
    S.me = { ...S.me, name: S.me.name || dom.name, image: S.me.image || dom.image };
  }

  // Filet de sécurité : Spicetify espace son stockage par nom de compte.
  if (!S.me.username) {
    try {
      const namespace = window.Spicetify.Platform?.LocalStorageAPI?.namespace;
      if (typeof namespace === "string" && namespace.trim()) {
        S.me.username = namespace.trim().toLowerCase().slice(0, 60);
      }
    } catch (error) {
      log("me namespace", error);
    }
  }

  if (S.me.name || S.me.image) cacheMe(S.me);
  const complete = Boolean(S.me.name && S.me.image);
  if (!S.me.name) S.me.name = "Auditeur";
  refreshStats();
  applyMe();
  await syncCloud();
  return complete;
}

/** Pushes the freshly resolved identity into the session and to the partner. */
function applyMe() {
  if (!S.joined) return;
  const self = S.members.find((member) => member.id === S.peerId);
  if (self) {
    self.name = S.me.name;
    self.image = S.me.image;
  }
  if (S.role === "host") {
    broadcast({ t: "profile", name: S.me.name, image: S.me.image });
    broadcastMembers();
  } else if (S.hostConn) {
    send(S.hostConn, { t: "profile", name: S.me.name, image: S.me.image });
  }
  render();
}

function bindPlayerEvents() {
  try {
    window.Spicetify.Player.addEventListener("songchange", () => onLocalChange(true));
  } catch (error) {
    log("player event songchange", error);
  }
  try {
    window.Spicetify.Player.addEventListener("playpause", () => onLocalChange(false));
  } catch (error) {
    log("player event playpause", error);
  }
}

function tick() {
  updateProgress();
  if (isAuthority() && isPlayingNow() && Date.now() - S.lastPush > PUSH_MS) pushState();
}

/* ------------------------------ boot ------------------------------ */

(async function boot() {
  const ready = await waitFor(() => window.Spicetify && window.Spicetify.Player && (window.Spicetify.Playbar || window.Spicetify.Topbar));
  if (!ready) return;
  injectStyles();
  createPanel();
  registerButton();
  registerContextMenu();
  const meComplete = await loadMe();
  if (!meComplete) {
    // The profile widget may not be mounted yet: one retry once the UI settles.
    window.setTimeout(() => {
      loadMe();
    }, 5000);
  }
  S.duo = loadDuo();
  S.autoJoin = loadAutoJoin();
  log(
    "duo",
    S.duo
      ? `${S.duo.code} · ${S.duo.partnerUser ? S.duo.partnerName || S.duo.partnerUser : "invitation en attente"}`
      : "aucun",
  );
  if (!S.duo && readCloudKey()) cloudRestore(readCloudKey(), true);
  S.stats = [];
  render();
  bindPlayerEvents();
  window.setInterval(tick, TICK_MS);
  if (S.duo) connectDuo();
  window.setInterval(() => {
    if (S.duo && !S.joined && !S.connectingDuo) connectDuo();
  }, 8000);
  window.addEventListener("beforeunload", () => {
    if (S.joined) leave(true);
  });
  log("prêt");
})();
