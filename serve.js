const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');

if (fs.existsSync('./config.js')) {
  const config = require('./config.js');
  for (let key in config) {
    process.env[key] = config[key];
  }
}

const key = fs.readFileSync('./keys/localhost.key');
const cert = fs.readFileSync('./keys/localhost.cert');
const opts = {
  public: './public'
}

const server = http.createServer((req, res) => handler(req, res, opts));

server.listen(5000, () => console.log('Listening on port 5000'));