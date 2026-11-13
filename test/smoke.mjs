import { build } from "esbuild";
import { JSDOM } from "jsdom";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
await build({
  entryPoints: [path.join(root, "src/bonk.js")],
  outfile: path.join(root, "test/bonk.test.js"),
  bundle: true,
  format: "iife",
  target: "chrome100",
  logLevel: "error",
  loader: { ".css": "text", ".woff2": "dataurl" },
  define: { __BONK_VERSION__: JSON.stringify("test") },
  plugins: [
    {
      name: "fake-peer",
      setup(pluginBuild) {
        pluginBuild.onResolve({ filter: /^peerjs$/ }, () => ({
          path: path.join(root, "test/fake-peer.js"),
        }));
      },
    },
  ],
});

const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
  url: "https://open.spotify.com",
});
global.window = dom.window;
global.document = dom.window.document;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const failures = [];
const check = (label, condition, detail = "") => {
  if (condition) console.log(`  ok   ${label}`);
  else {
    console.log(`  FAIL ${label} ${detail}`);
    failures.push(label);
  }
};

let playing = true;
let progress = 61_000;
const calls = { playUri: [], seek: [], pause: 0, play: 0 };

const notes = [];
const listeners = {};

dom.window.Spicetify = {
  showNotification: (html) => notes.push(String(html)),
  addEventListener: () => {},
  addToQueue: async () => {},
  CosmosAsync: { get: async () => ({ displayName: "Alice" }) },
  Platform: {
    UserAPI: {
      getUser: async () => ({
        username: "alice",
        displayName: "Alice",
        images: [{ url: "https://img/alice.jpg" }],
      }),
    },
  },
  ContextMenu: {
    Item: class {
      register() {}
      deregister() {}
    },
  },
  Playbar: {
    Button: class {
      constructor(label, icon, onClick) {
        this.label = label;
        this.onClick = onClick;
        this.element = dom.window.document.createElement("button");
        dom.window.__bonkButton = this;
      }
      register() {}
      deregister() {}
    },
  },
  Player: {
    addEventListener: (event, callback) => {
      listeners[event] = callback;
    },
    data: {
      item: {
        uri: "spotify:track:HHJ9Y",
        name: "Nuits fauves",
        metadata: { artist_name: "Zola", image_url: "spotify:image:abc123" },
      },
    },
    isPlaying: () => playing,
    getProgress: () => progress,
    getDuration: () => 214_000,
    playUri: (uri) => {
      calls.playUri.push(uri);
      return Promise.resolve();
    },
    seek: (ms) => calls.seek.push(ms),
    play: () => {
      calls.play += 1;
      playing = true;
    },
    pause: () => {
      calls.pause += 1;
      playing = false;
    },
    skip: () => {},
    back: () => {},
  },
};

let cloudState = "missing";
const cloudCalls = [];
globalThis.fetch = async (url, options = {}) => {
  cloudCalls.push({ url: String(url), method: options.method || "GET", body: options.body });
  if ((options.method || "GET") === "POST") return { ok: true, status: 200, json: async () => ({ ok: true }) };
  if (cloudState === "found") {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        found: true,
        code: "ZZZ999",
        partner: "Léa",
        partner_user: "lea",
        stats: [{ u: "spotify:track:CLOUD", n: "Titre en ligne", a: "Léa", i: "", d: 1000, t: 1, by: "Léa" }],
      }),
    };
  }
  return { ok: false, status: 404, json: async () => ({ found: false }) };
};

const { makeConn } = await import("./fake-peer.js");

await import(`./bonk.test.js?t=${Date.now()}`);
await wait(400);

const panel = document.getElementById("bonk-panel");
check("panel injected", Boolean(panel));
check("idle hero rendered", /Écoutez ensemble/.test(panel?.textContent ?? ""));

dom.window.__bonkButton.onClick();
check("panel opens on playbar click", panel.classList.contains("bonk-open"));

panel.querySelector('[data-act="create"]').click();
const hostPeer = globalThis.__bonkFakePeers.at(-1);
check("host peer created with room id", Boolean(hostPeer?.id?.startsWith("bonk-aux-")), hostPeer?.id);
check("peer options carry ice servers", Array.isArray(hostPeer?.options?.config?.iceServers));

hostPeer.emit("open", hostPeer.id);
await wait(50);

const code = panel.querySelector(".bonk-code-value")?.textContent ?? "";
check("room code shown", /^[A-Z0-9]{6}$/.test(code), code);
check("host listed", /Alice/.test(panel.textContent ?? ""));
check("track title rendered", /Nuits fauves/.test(panel.textContent ?? ""));

const guestConn = makeConn("guest-bob");
hostPeer.emit("connection", guestConn);
guestConn.emit("open");
guestConn.emit("data", { t: "hello", name: "Bob", image: "", username: "bob" });
await wait(50);

const welcome = guestConn.last("welcome");
check("guest receives welcome", welcome?.code === code, JSON.stringify(welcome));
const state = guestConn.last("state");
check("guest receives playback state", state?.track?.uri === "spotify:track:HHJ9Y", JSON.stringify(state));
check("members broadcast to guest", /Bob/.test(panel.textContent ?? ""));
check(
  "avatar shown from the profile",
  Boolean(panel.querySelector('img.bonk-avatar[src="https://img/alice.jpg"]')),
  panel.querySelector(".bonk-members")?.innerHTML,
);

guestConn.emit("data", { t: "profile", name: "Bob B", image: "https://img/bob.jpg" });
await wait(60);
check("partner pseudo updates live", /Bob B/.test(panel.textContent ?? ""));
check(
  "partner photo updates live",
  Boolean(panel.querySelector('img.bonk-avatar[src="https://img/bob.jpg"]')),
);

const give = panel.querySelector('[data-act="give"]');
check("host sees give-control button", Boolean(give));
give.click();
await wait(50);
check("control handed over", guestConn.last("control")?.authority === "guest-bob");

const guestTrack = { uri: "spotify:track:OTHER", name: "Autre", artist: "X", art: "", duration: 200_000 };
guestConn.emit("data", { t: "state", track: guestTrack, playing: true, progress: 10_000, ts: Date.now() });
await wait(50);
check("host player follows the new host", calls.playUri.includes("spotify:track:OTHER"), JSON.stringify(calls.playUri));
check("host UI names the host", /Hôte/.test(panel.textContent ?? ""));

guestConn.emit("close");
await wait(50);
check("host note disappears after guest leaves", !/Hôte/.test(panel.textContent ?? ""));
check("host transport controls come back", Boolean(panel.querySelector('[data-act="toggle"]')));
check("guest removed from listeners", !/Bob/.test(panel.querySelector(".bonk-members")?.textContent ?? ""));

/* ---------- duo permanent ---------- */

panel.querySelector('[data-act="leave"]').click();
await wait(60);
check("returns to idle after leaving", /Écoutez ensemble/.test(panel.textContent ?? ""));
check("duo entry offered", Boolean(panel.querySelector('[data-act="duo-create"]')));

panel.querySelector('[data-act="duo-create"]').click();
await wait(60);
const duoPeer = globalThis.__bonkFakePeers.at(-1);
check("duo peer uses the duo id", String(duoPeer?.id || "").startsWith("bonk-aux-duo-"), duoPeer?.id);

const duoStored = JSON.parse(dom.window.localStorage.getItem("bonk.duo") || "null");
const duoBackup = JSON.parse(dom.window.localStorage.getItem("bonk.duo.bak") || "null");
check(
  "duo is stored and backed up",
  Boolean(duoStored?.code) && duoStored.code === duoBackup?.code,
  `${JSON.stringify(duoStored)} / ${JSON.stringify(duoBackup)}`,
);
duoPeer.emit("open", duoPeer.id);
await wait(60);
check(
  "duo stays pending until the second person joins",
  /Duo en attente/.test(panel.textContent ?? ""),
  panel.textContent?.slice(0, 160),
);
check("pending duo holds no stats", !panel.querySelector('[data-act="stats-toggle"]'));

panel.querySelector('[data-act="duo-cancel"]')?.click();
await wait(120);
check(
  "cancelling an invitation leaves no session",
  /Écoutez ensemble/.test(panel.textContent ?? "") && !panel.querySelector(".bonk-np"),
  panel.textContent?.slice(0, 160),
);
check("cancelled invitation is forgotten", !dom.window.localStorage.getItem("bonk.duo"));

panel.querySelector('[data-act="duo-create"]')?.click();
await wait(120);
const duoPeer2 = (globalThis.__bonkFakePeers || []).at(-1);
duoPeer2?.emit("open", duoPeer2.id);
await wait(60);
check("a new invitation can be created again", /Duo en attente/.test(panel.textContent ?? ""), panel.textContent?.slice(0, 160));

const partner = makeConn("partner-1");
duoPeer2.emit("connection", partner);
partner.emit("open");
partner.emit("data", { t: "hello", name: "Léa", image: "", duo: true, username: "lea" });
await wait(80);
check("partner name saved in the duo", /Léa/.test(panel.textContent ?? ""));
check(
  "duo goes live once both accounts are known",
  /Tu es l'hôte/.test(panel.textContent ?? ""),
  panel.textContent?.slice(0, 160),
);
check(
  "duo stores the partner account",
  JSON.parse(dom.window.localStorage.getItem("bonk.duo") || "null")?.partnerUser === "lea",
  dom.window.localStorage.getItem("bonk.duo"),
);

calls.playUri.length = 0;
const partnerTrack = { uri: "spotify:track:LEA", name: "Sa chanson", artist: "Léa", art: "", duration: 180000 };
partner.emit("data", { t: "claim", from: "partner-1" });
partner.emit("data", { t: "state", track: partnerTrack, playing: true, progress: 4000, ts: Date.now(), authority: "partner-1" });
await wait(80);
check(
  "duo: taking the host role switches the shared music",
  calls.playUri.includes("spotify:track:LEA"),
  JSON.stringify(calls.playUri),
);
check("duo: Role change is announced", notes.some((entry) => /Léa est l'hôte/.test(entry)), JSON.stringify(notes));
check("duo: host badge follows the role", /hôte/i.test(panel.querySelector(".bonk-member-host")?.textContent ?? ""));
check("duo: auditeur can take the role back", Boolean(panel.querySelector('[data-act="claim"]')));

// Suivi : la barre doit refleter le lecteur local, pas l'etat reseau extrapole.
dom.window.Spicetify.Player.data.item = { uri: "spotify:track:LEA", name: "Sa chanson", metadata: { artist_name: "Léa" } };
progress = 30_000;
await wait(150);
check(
  "progress follows the real player",
  /^0:30$/.test(panel.querySelector(".bonk-cur")?.textContent ?? ""),
  panel.querySelector(".bonk-cur")?.textContent,
);

// Le compteur doit continuer d'avancer entre deux échantillons de getProgress().
progress = 10_100;
await wait(150);
const secondsA = panel.querySelector(".bonk-cur")?.textContent;
await wait(1_000);
const secondsB = panel.querySelector(".bonk-cur")?.textContent;
check("seconds keep flowing between samples", secondsA !== secondsB, `${secondsA} -> ${secondsB}`);

await wait(2400); // laisse retomber la fenêtre anti-boucle
partner.sent.length = 0;
dom.window.Spicetify.Player.data.item = { uri: "spotify:track:HOST", name: "Ma chanson", metadata: { artist_name: "Moi" } };
listeners.songchange?.();
await wait(80);
check(
  "host takes the role back when picking a track",
  partner.sent.some((message) => message.t === "claim" && message.from === duoPeer2.id),
  JSON.stringify(partner.sent.map((message) => message.t)),
);
check(
  "host pushes its own state",
  partner.sent.some((message) => message.t === "state" && message.track?.uri === "spotify:track:HOST"),
);

/* ---------- passage du rôle d'hôte ---------- */

partner.sent.length = 0;
const handOver = panel.querySelector('[data-act="give"][data-id="partner-1"]');
check("host can hand the role over", Boolean(handOver));
handOver?.click();
await wait(80);
check(
  "handover is broadcast",
  partner.sent.some((message) => message.t === "control" && message.authority === "partner-1"),
  JSON.stringify(partner.sent.map((message) => message.t)),
);
check("host becomes an auditeur", /Hôte/.test(panel.textContent ?? ""));

/* ---------- stats du duo ---------- */

check("stats section available", Boolean(panel.querySelector('[data-act="stats-toggle"]')));
panel.querySelector('[data-act="stats-toggle"]').click();
await wait(60);
const topText = panel.querySelector(".bonk-top")?.textContent ?? "";
check("shared tracks counted", /Sa chanson/.test(topText), topText);
check("stat tiles rendered", (panel.querySelectorAll(".bonk-stats-grid > div").length ?? 0) === 3);
const statsKeys = [];
for (let index = 0; index < dom.window.localStorage.length; index += 1) {
  statsKeys.push(String(dom.window.localStorage.key(index) || ""));
}
check(
  "stats are stored for this pair only",
  statsKeys.some((key) => key.startsWith("bonk.stats.")) && !dom.window.localStorage.getItem("bonk.stats"),
  statsKeys.join(","),
);

panel.querySelector('[data-act="stats-reset"]').click();
await wait(60);
check("reset clears the stats", !panel.querySelector(".bonk-top"), panel.textContent?.slice(0, 80));

/* ---------- délier : double confirmation ---------- */

panel.querySelector('[data-act="leave"]').click();
await wait(80);
check("unlink button offered", Boolean(panel.querySelector('[data-act="duo-leave"]')));
panel.querySelector('[data-act="duo-leave"]')?.click();
await wait(60);
check("first click keeps the duo", Boolean(dom.window.localStorage.getItem("bonk.duo")));
check("unlink asks for confirmation", /Confirmer/.test(panel.textContent ?? ""));
panel.querySelector('[data-act="duo-leave"]')?.click();
await wait(60);
check(
  "confirmed unlink clears both keys",
  !dom.window.localStorage.getItem("bonk.duo") && !dom.window.localStorage.getItem("bonk.duo.bak"),
  dom.window.localStorage.getItem("bonk.duo"),
);

/* ---------- sauvegarde en ligne, automatique ---------- */

const storedKey = dom.window.localStorage.getItem("bonk.duo.k") || "";
check(
  "unlink also clears the online copy",
  cloudCalls.some((call) => call.method === "POST" && String(call.body || "").includes('"code":""')),
  JSON.stringify(cloudCalls.map((call) => call.body || call.method)),
);
check("cloud key derived from the account", /^[a-f0-9]{64}$/.test(storedKey), storedKey.slice(0, 12));
check("cloud block offered without any setup", Boolean(panel.querySelector(".bonk-cloud")), panel.textContent?.slice(0, 120));
check("first boot found nothing online", cloudCalls.some((call) => call.method === "GET"));

cloudState = "found";
panel.querySelector('[data-act="cloud-restore"]')?.click();
await wait(150);
check("duo restored from the cloud", /ZZZ999/.test(panel.textContent ?? ""), panel.textContent?.slice(0, 140));
check("restored duo is pushed back", cloudCalls.some((call) => call.method === "POST"));
check(
  "cloud row carries the pair of accounts",
  cloudCalls.some((call) => call.method === "POST" && String(call.body || "").includes('"partnerUser":"lea"')),
  JSON.stringify(cloudCalls.map((call) => call.body || call.method)),
);
const pairStats = (() => {
  for (let index = 0; index < dom.window.localStorage.length; index += 1) {
    const key = String(dom.window.localStorage.key(index) || "");
    if (key.startsWith("bonk.stats.")) return dom.window.localStorage.getItem(key) || "";
  }
  return "";
})();
check("stats come back with the pair", /Titre en ligne/.test(pairStats), pairStats.slice(0, 120));
check(
  "the account itself is never sent",
  cloudCalls.every((call) => !String(call.body || "").includes("alice") && !String(call.url).includes("alice")),
  JSON.stringify(cloudCalls.map((call) => call.url)),
);

/* ---------- recréer un duo après avoir délié ---------- */

panel.querySelector('[data-act="duo-leave"]')?.click();
await wait(60);
panel.querySelector('[data-act="duo-leave"]')?.click();
await wait(60);
check("unlink clears the previous connection", Boolean(panel.querySelector('[data-act="duo-create"]')));

panel.querySelector('[data-act="duo-create"]')?.click();
await wait(150);
const firstPeer = (globalThis.__bonkFakePeers || []).at(-1);
check("recreating a duo starts a fresh connection", Boolean(firstPeer?.id?.startsWith("bonk-aux-duo-")), firstPeer?.id);

firstPeer?.emit("error", { type: "network" });
await wait(1_900);
const retryPeer = (globalThis.__bonkFakePeers || []).at(-1);
check("a failed duo connection retries on its own", retryPeer !== firstPeer, `${firstPeer?.id} -> ${retryPeer?.id}`);

retryPeer?.emit("open");
await wait(200);
check("recreated duo is pending again", /Duo en attente/.test(panel.textContent ?? ""), panel.textContent?.slice(0, 160));

const newPartner = makeConn("partner-2");
retryPeer.emit("connection", newPartner);
newPartner.emit("open");
newPartner.emit("data", { t: "hello", name: "Léa", image: "", duo: true, username: "lea" });
await wait(150);
const nowName = dom.window.Spicetify.Player.data.item?.name ?? "";
check("recreated duo opens the session", Boolean(panel.querySelector(".bonk-np")), panel.textContent?.slice(0, 200));
check("recreated session shows the track", Boolean(nowName) && (panel.textContent ?? "").includes(nowName), nowName);

/* ---------- rejoindre automatiquement ---------- */

newPartner.emit("data", { t: "claim", from: "partner-2" });
await wait(90);
check("the duo can take the host role", /Hôte : Léa/.test(panel.textContent ?? ""), panel.textContent?.slice(0, 160));

panel.querySelector('[data-act="leave"]')?.click();
await wait(100);
check("leaving a duo keeps the connection", Boolean(panel.querySelector('[data-act="duo-reconnect"]')), panel.textContent?.slice(0, 200));

const autoState = {
  t: "state",
  track: { uri: "spotify:track:AUTO", name: "Auto", artist: "Léa", art: "", duration: 1000 },
  playing: true,
  progress: 0,
  ts: Date.now(),
  authority: "partner-2",
};
newPartner.emit("data", { ...autoState, ts: Date.now() });
await wait(120);
check("no automatic join while the toggle is off", !panel.querySelector(".bonk-np"), panel.textContent?.slice(0, 160));

check("auto join toggle offered", Boolean(panel.querySelector('[data-act="autojoin"]')));
panel.querySelector('[data-act="autojoin"]')?.click();
await wait(80);
check("auto join is remembered", dom.window.localStorage.getItem("bonk.autojoin") === "1");

newPartner.emit("data", { ...autoState, ts: Date.now() });
await wait(160);
check("the duo pulls me back in when it plays", Boolean(panel.querySelector(".bonk-np")), panel.textContent?.slice(0, 200));
check(
  "the automatic join is announced",
  notes.some((entry) => /rejoint ton duo/.test(entry)),
  JSON.stringify(notes.slice(-2)),
);

if (process.env.BONK_DUMP) {
  const fs = await import("node:fs");
  fs.writeFileSync(process.env.BONK_DUMP, panel.outerHTML);
  console.log(`panneau exporté vers ${process.env.BONK_DUMP}`);
}

console.log(failures.length ? `\n${failures.length} échec(s)` : "\ntous les contrôles passent");
process.exit(failures.length ? 1 : 0);
