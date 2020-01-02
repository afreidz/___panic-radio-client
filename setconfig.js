const fs = require('fs');

(() => {
  const header = `module.exports = {`;
  const footer = `};`
  let config = '';
  for (let key in process.env) {
    if (key.includes('PANIC_RADIO_')) config += `${key}: "${process.env[key]}",\n`;
  }
  if (process.env.NODE_ENV === 'production') {
    console.log(`${header}${config}${footer}`);
    fs.writeFileSync(`./config.js`, `${header}${config}${footer}`, 'utf8');
  }
})();