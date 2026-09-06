const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const { proxy } = require('rtsp-relay')(app);

// Serve i file del frontend dalla cartella 'public'
app.use(express.static('public'));

// URL RTSPS nativo di Bambu Lab (Porta 1989)
const bambuUrl = `rtsps://bblp:${process.env.ACCESS_CODE_3D_STAMP}@${process.env.IP_ADDRESS_3D_STAMP}:1989/live`;

app.ws('/api/stream', proxy({
  url: bambuUrl,
  verbose: false,
  transport: 'tcp',
}));

function startServer(port) {
  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`[1/3] Server HTTP attivo su http://localhost:${port}`);
      resolve(app);
    });
  });
}

module.exports = { startServer };