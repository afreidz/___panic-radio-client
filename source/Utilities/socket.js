import modal from 'Components/Modal/Store';

const socketMap = new Map();

export default class PanicSocket extends WebSocket {
  constructor(url) {
    super(url);
    this.listeners = new Map();

    this.onhostmessage('error', data => {
      modal.update(m => {
        m.content = data.error;
        m.title = '☠️ Error!';
        m.theme = 'error';
        m.action = null;
        m.open = true;
        return m;
      });
    });

    return this;
  }

  sendhost(msg = {}) {
    const data = { ...msg, target: 'host' };
    this.send(JSON.stringify(data));
    return this;
  }

  onready(fn = () => {}) {
    this.addEventListener('open', fn);
    return this;
  }

  onhostmessage(type, fn = () => {}) {
    if (this.listeners.has(type)) {
      this.removeEventListener('message', this.listeners.get(type));
    }
    this.listeners.set(type, msg => {
      const data = JSON.parse(msg.data);
      if (data.target !== 'client') return false;
      if (data.type !== type) return false;
      fn(data);
    });
    this.addEventListener('message', this.listeners.get(type));
    return this;
  }

  static get(url) {
    return socketMap.has(url)
      ? socketMap.get(url)
      : socketMap.set(url, new PanicSocket(url)).get(url);
  }
}
