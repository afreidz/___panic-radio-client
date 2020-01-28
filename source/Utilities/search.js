import { PANIC_RADIO_HOST_ENDPOINT } from '../../config';

export default async function (query, provider = 'youtube') {
  const body = JSON.stringify(query);
  const url = `${PANIC_RADIO_HOST_ENDPOINT}/search/${provider}`;
  const opts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  };
  const resp = await fetch(url, opts);
  if (resp.status === 400) throw new Error((await resp.json()).msg);
  return resp.json();
}
