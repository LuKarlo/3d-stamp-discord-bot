const localtunnel = require('localtunnel');

async function startTunnel(port) {
  console.log('[2/3] Avvio del tunnel HTTPS...');
  const tunnel = await localtunnel({ port: port });
  console.log(`[2/3] Tunnel HTTPS creato: ${tunnel.url}`);
  return tunnel.url;
}

module.exports = { startTunnel };