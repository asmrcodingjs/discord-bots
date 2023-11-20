const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} = require("discord.js");
const whisperCmd = require("./whisper.cmd");

require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const TOKEN = process.env.TOKEN;

const rest = new REST().setToken(TOKEN);

client.commands = new Collection();
client.messages = new Collection();

const commandsStore = [whisperCmd.data.toJSON()];
client.commands.set(whisperCmd.data.name, whisperCmd);

const botInfo = {
  guildId: "951168681088528434",
  clientId: "1169689274086596669",
};

(async () => {
  const data = await rest.put(
    Routes.applicationGuildCommands(botInfo.clientId, botInfo.guildId),
    {
      body: commandsStore,
    }
  );

  console.log(`Successfully reloaded ${data.length} application (/) commands.`);

  await client.login(TOKEN);
  console.log(`${client.user.tag} is Online..`);

  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) {
        command.exec(interaction);
      } else {
        interaction.reply({ content: "invalid command", ephemeral: true });
      }
    } else if (interaction.isButton()) {
      const [type, target, msgId] = interaction.customId.split(":");
      if (target !== interaction.user.id) {
        interaction.reply({
          content: "Sorry, you can't see this whisper message",
          ephemeral: true,
        });
        return;
      }
      const messageContent = client.messages.get(msgId);
      if (messageContent) {
        interaction.reply({
          content: messageContent,
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `Sorry, We can't find message content`,
          ephemeral: true,
        });
      }
    }
  });
})();
