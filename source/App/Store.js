import getUser from 'Utilities/getuser';
import PanicSocket from 'Utilities/socket';
import storehelpers from 'Utilities/storehelpers';
import { writable, derived, get } from 'svelte/store';
import { PANIC_RADIO_WS_ENDPOINT } from '../../config';

const qs = new URLSearchParams(window.location.search);

export const openviews = storehelpers.writableSet();
export const photo = storehelpers.persistantWritable('photo', null);
export const room = writable(qs.has('room') ? qs.get('room') : 'lobby');
export const username = storehelpers.persistantWritable('username', null);
export const userid = storehelpers.persistantWritable('userid', Number(new Date));

export const socket = derived([room, username, photo, userid], ([$room, $username, $photo, $userid], set) => {
  if ($room === 'lobby') return set({});
  const url = `${PANIC_RADIO_WS_ENDPOINT}/${$room}`;
  const ws = PanicSocket.get(url);
  set(ws);

  if (!!$username || !!$photo || !!$userid) {
    if (ws && ws.readyState === 1) return ws.sendhost({ type: 'listenerinfo', name: $username, photo: $photo, id: $userid });
    ws.onready(() => {
      ws.sendhost({ type: 'listenerinfo', name: $username, photo: $photo, id: $userid });
    });
  }
});

export const backgrounded = writable(false);
const browserprefix = typeof document.hidden !== 'undefined'
  ? 'hidden'
  : typeof document.msHidden !== 'undefined'
    ? 'ms'
    : typeof document.webkitHidden !== 'undefined'
      ? 'webkit'
      : '';
const hiddenprop = browserprefix === 'hidden' ? browserprefix : `${browserprefix}Hidden`;
const visibilityChange = browserprefix === 'hidden' ? 'visibilitychange' : `${browserprefix}visibilitychange`;
document.addEventListener(visibilityChange, () => {
  if (document[hiddenprop]) return backgrounded.update(b => true);
  return backgrounded.update(b => false);
}, false);