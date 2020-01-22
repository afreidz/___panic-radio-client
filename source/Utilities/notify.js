import { get } from 'svelte/store';
import { backgrounded } from 'App/Store';

const cannotify = async () => {
  if (!('Notification' in window)) return false;
  if (!window.Notification.permission || window.Notification !== 'granted') {
    const resp = await window.Notification.requestPermission();
    if (resp === 'granted') return get(backgrounded);
  } else {
    return get(backgrounded);
  }
};

export default class notifier {
  constructor() {
    this.common = {
      icon: '/assets/emoji.png',
      vibrate: true,
    };
  }

  async notify(title, msg) {
    this.common.body = msg;
    if (await cannotify()) return new window.Notification(title, { ...this.common });
    return console.log('Notification', msg);
  }
}
