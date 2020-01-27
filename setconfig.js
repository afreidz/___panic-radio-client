const fs = require('fs');

(() => {
  const header = 'module.exports = {';
  const footer = '};';
  let config = '';
  Object.keys(process.env).forEach((key) => {
    if (key.includes('PANIC_RADIO_')) config += `${key}: "${process.env[key]}",\n`;
  });
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line no-console
    console.log(`${header}${config}${footer}`);
    fs.writeFileSync('./config.js', `${header}${config}${footer}`, 'utf8');
  }
})();
