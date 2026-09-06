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
  verbose: true,
  // MODIFICA FONDAMENTALE: rtsp-relay non accetta 'transport', vuole i flag nativi di FFmpeg.
  // Servono per forzare il TCP e disabilitare il controllo SSL (-tls_verify 0)
  additionalFlags: ['-rtsp_transport', 'tcp', '-tls_verify', '0'], 
}));

function startServer(port) {
  return new Promise((resolve) => {
    // Nota: per fare in modo che express-ws intercetti correttamente i WebSocket su grandi carichi,
    // è consigliato salvare il riferimento del server HTTP restituito da app.listen
    const server = app.listen(port, () => {
      console.log(`[1/3] Server HTTP attivo su http://localhost:${port}`);
      resolve(server); // Restituisci l'istanza del server anziché app
    });
  });
}

module.exports = { startServer };
