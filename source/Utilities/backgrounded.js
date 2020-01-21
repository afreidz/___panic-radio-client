const browserprefix = typeof document.hidden !== 'undefined'
  ? 'hidden'
  : typeof document.msHidden !== 'undefined'
    ? 'ms'
    : typeof document.webkitHidden !== 'undefined'
      ? 'webkit'
      : '';

export const hiddenprop = browserprefix === 'hidden' ? browserprefix : `${browserprefix}Hidden`;
export const visibilityChange = browserprefix === 'hidden' ? 'visibilitychange' : `${browserprefix}visibilitychange`;