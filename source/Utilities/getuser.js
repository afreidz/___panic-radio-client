import { get } from 'svelte/store';
import { PANIC_RADIO_HOST_ENDPOINT } from '../../config';

export default async function (userid) {
  if (!userid) return null;
  const url = `${PANIC_RADIO_HOST_ENDPOINT}/users/${userid}`

  return await (await fetch(url)).json();
}