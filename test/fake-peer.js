// Stand-in for PeerJS. Instances are recorded on globalThis so the test can
// inspect peers created inside the bundled plugin code.
const registry = (globalThis.__bonkFakePeers ||= []);

export default class FakePeer {
  constructor(id, options) {
    this.id = id || `guest-${registry.length}`;
    this.options = options;
    this.handlers = {};
    this.destroyed = false;
    this.connections = [];
    registry.push(this);
  }

  on(event, callback) {
    (this.handlers[event] ||= []).push(callback);
    return this;
  }

  emit(event, payload) {
    (this.handlers[event] || []).forEach((callback) => callback(payload));
  }

  connect(peerId) {
    const conn = makeConn(peerId);
    this.connections.push(conn);
    return conn;
  }

  destroy() {
    this.destroyed = true;
  }
}

export function makeConn(peerId) {
  const handlers = {};
  const sent = [];
  return {
    peer: peerId,
    open: true,
    sent,
    on(event, callback) {
      (handlers[event] ||= []).push(callback);
      return this;
    },
    emit(event, payload) {
      (handlers[event] || []).forEach((callback) => callback(payload));
    },
    send(message) {
      sent.push(message);
    },
    last(type) {
      return [...sent].reverse().find((message) => message.t === type);
    },
  };
}
