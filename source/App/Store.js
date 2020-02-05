import PanicSocket from 'Utilities/socket';
import { writable, derived } from 'svelte/store';
import storehelpers from 'Utilities/storehelpers';
import { PANIC_RADIO_WS_ENDPOINT } from '../../config';

export const room = writable('test');
export const backgrounded = writable(false);
export const openviews = storehelpers.writableSet();
export const photo = storehelpers.persistantWritable('photo', null);
export const username = storehelpers.persistantWritable('username', null);
export const anonymous = storehelpers.persistantWritable('anonymous', false);
export const userid = storehelpers.persistantWritable(
  'userid',
  Number(new Date()),
);

export const socket = derived(
  [room, username, photo, userid, anonymous],
  ([$room, $username, $photo, $userid, $anonymous], set) => {
    const url = `${PANIC_RADIO_WS_ENDPOINT}/${$room}`;
    const anonid = Number(new Date());
    const ws = PanicSocket.get(url);
    set(ws);

    if (!!$username || !!$photo || !!$userid) {
      if (ws && ws.readyState === 1) {
        return ws.sendhost({
          type: 'listenerinfo',
          name: $anonymous ? `anon_${anonid}` : $username,
          photo: $anonymous ? null : $photo,
          id: $anonymous ? anonid : $userid,
        });
      }
      ws.onready(() => {
        ws.sendhost({
          type: 'listenerinfo',
          name: $anonymous ? `anon_${anonid}` : $username,
          photo: $anonymous ? null : $photo,
          id: $anonymous ? anonid : $userid,
        });
      });
    }
    return true;
  },
);
