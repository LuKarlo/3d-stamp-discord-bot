const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

async function startBot(publicUrl) {
  console.log('[3/3] Registrazione comandi Discord...');
  
  const commands = [
    new SlashCommandBuilder()
      .setName('stream')
      .setDescription('Mostra la diretta della stampante 3D')
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

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