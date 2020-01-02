import getUser from 'Utilities/getuser';
import PanicSocket from 'Utilities/socket';
import persist from 'Utilities/persistentstore';
import { writable, derived, get } from 'svelte/store';
import { PANIC_RADIO_WS_ENDPOINT } from '../../config';

const qs = new URLSearchParams(window.location.search);

export const openviews = writableSet();
export const jwt = persist('jwt', null);
export const currentuserid = persist('currentuserid', null);
export const room = writable(qs.has('room') ? qs.get('room') : 'lobby');

export const socket = derived(room, ($room, set) => {
  if ($room === 'lobby') return set(null);
  const url = `${PANIC_RADIO_WS_ENDPOINT}/${$room}`;
  const ws = PanicSocket.get(url);
  set(ws);
});

export const currentuser = derived([currentuserid, socket, jwt], async ([$id, $socket, $jwt], set) => {
  let user = null;
  if (!!$id && !!$jwt) user = await getUser($id);
  set(user);

  if (!!user && !!$socket) $socket.sendhost({ type: 'authenticate', jwt: $jwt });
}, null);

function writableSet() {
  const localstate = new Set;
  const { subscribe, set, update } = writable(localstate);

  return {
    set,
    update,
    subscribe,
    add: i => {
      localstate.add(i);
      update(() => (localstate));
    },
    delete: i => {
      localstate.delete(i);
      update(() => (localstate));
    },
    has: i => (localstate.has(i))
  };
}