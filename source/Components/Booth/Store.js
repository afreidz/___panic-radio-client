import Notifier from 'Utilities/notify';
import { derived, writable } from 'svelte/store';
import storehelpers from 'Utilities/storehelpers';
import { socket, room, openviews } from 'App/Store';
import { listeners } from 'Components/Listeners/Store';

export const autoplay = storehelpers.persistantWritable('autoplay', false);

export const djs = derived(
  [socket, listeners],
  ([$socket, $listeners], set) => {
    $socket.onhostmessage('djs', data => {
      const djs = [];
      data.djs.forEach(dj => {
        const listener = $listeners.find(l => l.id === dj);
        if (listener) djs.push(listener);
      });
      set(djs);
    });
  },
  [],
);

export const reqtimeremaining = writable(null);
export const request = derived(
  [room, socket, autoplay, openviews, reqtimeremaining],
  ([$room, $socket, $autoplay, $openviews, $reqtimeremaining], set) => {
    const notifier = new Notifier();
    let timer;

    $socket.onhostmessage('request', data => {
      set(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        set(false);
        notifier.notify('Time is up!', `You are no longer a DJ in "${$room}"`);
        openviews.delete('play');
      }, data.time * 1000);
      if (!$autoplay) {
        notifier
          .notify('Heads up!', `It is your turn to DJ in "${$room}"`)
          .then(() => {
            openviews.add('play');
          });
      }
      request.respond = song => {
        set(null);
        clearTimeout(timer);
        reqtimeremaining.update(r => null);
        $socket.sendhost({ type: 'play', song });
      };
      reqtimeremaining.update(r => data.time);
    });
  },
  null,
);
