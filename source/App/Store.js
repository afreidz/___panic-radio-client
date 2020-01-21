import PanicSocket from 'Utilities/socket';
import { writable, derived } from 'svelte/store';
import storehelpers from 'Utilities/storehelpers';
import { PANIC_RADIO_WS_ENDPOINT } from '../../config';

export const room = writable('test');
export const backgrounded = writable(false);
export const openviews = storehelpers.writableSet();
export const photo = storehelpers.persistantWritable('photo', null);
export const username = storehelpers.persistantWritable('username', null);
export const userid = storehelpers.persistantWritable('userid', Number(new Date));

export const socket = derived([room, username, photo, userid], ([$room, $username, $photo, $userid], set) => {
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