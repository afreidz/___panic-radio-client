import { writable } from 'svelte/store';
import persist from 'Utilities/persistentstore';

export const preview = writable(null);
export const items = persist('crate', []);