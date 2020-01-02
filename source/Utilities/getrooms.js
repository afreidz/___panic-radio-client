import { PANIC_RADIO_HOST_ENDPOINT } from '../../config';

export default async function () {
  const url = `${PANIC_RADIO_HOST_ENDPOINT}/lobby`;
  return await (await fetch(url)).json();
}