const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const { proxy } = require('rtsp-relay')(app);

app.use(express.static('public'));

const accessCode = process.env.ACCESS_CODE_3D_STAMP || '2174e2e0';
const ipAddress = process.env.IP_ADDRESS_3D_STAMP || '192.168.1.207';

// URL RTSPS testato e funzionante
const bambuUrl = `rtsps://bblp:${accessCode}@${ipAddress}:322/streaming/live/1`;

app.ws('/api/stream', (ws, req) => {
  console.log('📡 [WebSocket] Client connesso all\'Activity Discord');

  proxy({
    url: bambuUrl,
    verbose: true,
    additionalFlags: [
      '-rtsp_transport', 'tcp'
    ],
  })(ws, req);
});

function startServer(port) {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`[1/3] Server attivo su http://localhost:${port}`);
      resolve(server);
    });
  });
}

module.exports = { startServer };