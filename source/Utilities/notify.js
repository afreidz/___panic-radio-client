const cannotify = async () => {
  if (!'Notification' in window) return false;
  if (!window.Notification.permission || window.Notification !== 'granted') {
    let resp = await window.Notification.requestPermission();
    if (resp === 'granted') return true;
  } else {
    return true;
  }
};

export default class notifier {
  constructor() {
    this.common = {
      image: '/assets/emoji.png',
      icon: '/assets/emoji.png',
      requireInteraction: true,
      vibrate: true,
    }
  }
  async notify(title, msg) {
    this.common.body = msg;
    if (await cannotify()) return new window.Notification(title, { ...this.common });
  }
}