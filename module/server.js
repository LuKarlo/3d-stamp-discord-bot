const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const { proxy } = require('rtsp-relay')(app);

app.use(express.static('public'));

// 1. Validazione delle variabili d'ambiente
const accessCode = process.env.ACCESS_CODE_3D_STAMP;
const ipAddress = process.env.IP_ADDRESS_3D_STAMP;

if (!accessCode || !ipAddress) {
  console.error('❌ ERRORE CRITICO: Controlla il file .env!');
  console.error(`- ACCESS_CODE_3D_STAMP: ${accessCode ? 'OK' : 'MANCANTE'}`);
  console.error(`- IP_ADDRESS_3D_STAMP: ${ipAddress ? 'OK' : 'MANCANTE'}`);
}

// Per la porta 1989 usa solitamente "rtsp://", per la 322 usa "rtsps://"
const bambuUrl = `rtsp://bblp:${accessCode}@${ipAddress}:1989/live`;

// 2. Log dell'URL di connessione (con password mascherata per sicurezza)
const maskedUrl = bambuUrl.replace(accessCode, '******');
console.log(`🎥 Configurato stream Bambu Lab su: ${maskedUrl}`);

// 3. Endpoint di diagnosi (apribile dal browser)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    printerIp: ipAddress || 'Non configurato',
    hasAccessCode: !!accessCode,
    streamUrl: maskedUrl,
  });
});

// 4. WebSocket proxy con gestione log
app.ws('/api/stream', (ws, req) => {
  console.log('📡 [WebSocket] Nuovo client connesso all\'Activity!');
  
  ws.on('close', () => {
    console.log('🔌 [WebSocket] Client disconnesso dall\'Activity.');
  });

  proxy({
    url: bambuUrl,
    verbose: true,
    additionalFlags: [
      '-rtsp_transport', 'tcp',
      '-tls_verify', '0'
    ],
  })(ws, req);
});

function startServer(port) {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`[1/3] Server HTTP e WebSocket attivi su http://localhost:${port}`);
      resolve(server);
    });
  });
}

module.exports = { startServer };