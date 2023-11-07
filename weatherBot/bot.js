const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} = require("discord.js");

require("dotenv").config();
const weatherCmd = require("./commands/weather.cmd");

const token = process.env.TOKEN;

const client = new Client({
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
});

const botInfo = {
  supportGuildId: "951168681088528434",
  id: "1169689274086596669",
};
const rest = new REST().setToken(token);

client.commands = new Collection();
const commandsStore = [weatherCmd.data.toJSON()];
client.commands.set(weatherCmd.data.name, weatherCmd);

(async () => {
  const data = await rest.put(
    Routes.applicationGuildCommands(botInfo.id, botInfo.supportGuildId),
    { body: commandsStore }
  );
  console.log(`Successfully reloaded ${data.length} application (/) commands.`);

  await client.login(token);
  console.log(`${client.user.tag} is online..`);

  client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const cmd = client.commands.get(commandName);
    if (cmd) {
      cmd.execute(interaction);
    } else {
      interaction.reply({ content: "invalid cmd" });
    }
  });
})();
