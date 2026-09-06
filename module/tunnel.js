const ngrok = require('@ngrok/ngrok');

async function startTunnel(port) {
  console.log('[2/3] Avvio del tunnel ngrok...');

  try {
    const listener = await ngrok.forward({
      addr: port,
      authtoken: process.env.NGROK_AUTHTOKEN,
    });

    const publicUrl = listener.url();

    if (!publicUrl) {
      throw new Error('Impossibile ottenere l\'URL da ngrok.');
    }

    console.log(`[2/3] Tunnel HTTPS creato: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error('❌ Errore durante l\'avvio di ngrok:', err.message);
    throw err;
  }
}

module.exports = { startTunnel };