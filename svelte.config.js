const less = require('svelte-preprocess-less');

module.exports = {
  preprocess: [less()],
};