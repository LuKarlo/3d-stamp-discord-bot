const ngrok = require('@ngrok/ngrok');

async function startTunnel(port) {
  console.log('[2/3] Avvio del tunnel ngrok statico...');

  try {
    const listener = await ngrok.forward({
      addr: port,
      authtoken: process.env.NGROK_AUTHTOKEN,
      domain: process.env.NGROK_DOMAIN,
    });

    const publicUrl = listener.url();
    console.log(`[2/3] Tunnel HTTPS permanente attivo: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error('❌ Errore durante l\'avvio di ngrok:', err.message);
    throw err;
  }
}

module.exports = { startTunnel };