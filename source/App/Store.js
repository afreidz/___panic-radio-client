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

export const socket = derived([room, username, photo], ([$room, $username, $photo], set) => {
  if ($room === 'lobby') return set({});
  const url = `${PANIC_RADIO_WS_ENDPOINT}/${$room}`;
  const ws = PanicSocket.get(url);
  set(ws);

  if (!!$username || !!$photo) {
    ws.onready(() => {
      ws.sendhost({ type: 'listenerinfo', name: $username, photo: $photo });
    });
  }
});