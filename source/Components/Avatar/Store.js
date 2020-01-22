import { socket } from 'App/Store';
import { derived } from 'svelte/store';

export const votes = derived(
  [socket],
  ([$socket], set) => {
    let state = [];
    $socket.onhostmessage('vote', (data) => {
      state = data.votes;
      if (data.sound === 'like') new Audio('./assets/like.mp3').play();
      if (data.sound === 'dislike') new Audio('./assets/dislike.mp3').play();
      set(state);
    });
    $socket.onhostmessage('clear-votes', () => {
      state = [];
      set(state);
    });
  },
  [],
);
