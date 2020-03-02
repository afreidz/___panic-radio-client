import PanicSocket from 'Utilities/socket';
import { writable, derived } from 'svelte/store';
import { PANIC_RADIO_WS_ENDPOINT } from '../../config';
import { persistantWritable, writableSet, persistantSet } from 'Utilities/storehelpers';

export const members = writable([]);
export const muted = writable(true);
export const room = writable('test');
export const listeners = writable([]);
export const preview = writable(null);
export const request = writable(null);
export const openviews = writableSet();
export const tracks = writable(new Map());
export const backgrounded = writable(false);
export const listenerdetails = writable(null);
export const items = persistantWritable('crate', []);
export const photo = persistantWritable('photo', null);
export const pinned = persistantSet('pinned', new Set());
export const userid = persistantWritable('userid', null);
export const username = persistantWritable('username', null);
export const autoplay = persistantWritable('autoplay', false);
export const anonymous = persistantWritable('anonymous', false);

export const socket = derived(
  [room, photo, username, userid, anonymous, tracks],
  ([$room, $photo, $username, $userid, $anonymous, $tracks], set) => {
    const url = `${PANIC_RADIO_WS_ENDPOINT}/${$room}`;
    const anonid = Number(new Date());
    const ws = PanicSocket.get(url);
    set(ws);

    if (!!$username || !!$photo || !!$userid) {
      if (ws && ws.readyState === 1) {
        return ws.sendhost({
          type: 'listenerupdate',
          name: $anonymous ? `anon_${anonid}` : $username,
          photo: $anonymous ? null : $photo,
          id: $anonymous ? anonid : $userid,
        });
      }
      ws.onready(() => {
        ws.sendhost({
          type: 'listenerupdate',
          name: $anonymous ? `anon_${anonid}` : $username,
          photo: $anonymous ? null : $photo,
          id: $anonymous ? anonid : $userid,
        });
      });
    }

    ws.onhostmessage('status', (state = {}) => {
      listeners.update(() => state.listeners);
      members.update(() => state.members);
      if (state.queue) {
        state.queue.forEach((t) => {
          $tracks.set(t.id, t);
        });
      }
    });

    ws.onhostmessage('songadded', (details) => {
      tracks.update((t) => {
        t.set(details.song.id, details.song);
        return t;
      });
    });

    ws.onhostmessage('miss', () => ws.sendhost({ type: 'leave' }));

    ws.onhostmessage('ask', (details) => {
      openviews.add('play');
      request.update(() => details.remaining);
      setTimeout(() => request.update(() => null), details.remaining);
    });

    return ws;
  },
);
