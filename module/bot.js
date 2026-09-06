const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

async function startBot(publicUrl) {
  console.log('[3/3] Registrazione comandi Discord...');
  
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  let existingCommands = [];
  try {
    existingCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
  } catch (err) {
    console.warn('Avviso: impossibile recuperare i comandi esistenti:', err.message);
  }

  const entryPointCommand = existingCommands.find(cmd => cmd.type === 4);

  const streamCommand = new SlashCommandBuilder()
    .setName('stream')
    .setDescription('Mostra la diretta della stampante 3D')
    .toJSON();

  const commandsToRegister = [streamCommand];

  if (entryPointCommand) {
    commandsToRegister.push(entryPointCommand);
  }

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commandsToRegister });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'stream') {
      await interaction.reply({
        content: `🎥 **Stampante 3D Live**\nUsa l'Activity di Discord oppure apri il link: ${publicUrl}`,
      });
    }
  });
  

  await client.login(process.env.DISCORD_TOKEN);
  console.log(`[3/3] Bot connesso come ${client.user.tag}`);
}

module.exports = { startBot };