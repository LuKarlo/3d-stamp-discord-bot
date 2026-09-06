require('dotenv').config();

// 1. Gestione globale degli errori (va all'inizio per proteggere l'app fin dal primo secondo)
process.on('uncaughtException', (err) => {
  console.error('⚠️ Errore catturato nel processo:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Promessa non gestita:', reason);
});

const { startServer } = require('./module/server');
const { startTunnel } = require('./module/tunnel');
const { startBot } = require('./module/bot');

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    console.log('🚀 Avvio dell\'infrastruttura di streaming...');
    await startServer(PORT);
    const publicUrl = await startTunnel(PORT);
    await startBot(publicUrl);
    console.log('✅ Sistema pronto!');
  } catch (err) {
    console.error('❌ Errore durante l\'avvio:', err);
    process.exit(1);
  }
}

main();