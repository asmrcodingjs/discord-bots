const { config } = require("dotenv");
config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} = require("discord.js");
const commands = require("./commands/index");

const token = process.env.BOT_TOKEN;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const bot = {
  clientId: "1169689274086596669",
  guildId: "951168681088528434",
};
client.commands = new Collection();
const commandsStore = [];

commands.map((cmd) => {
  client.commands.set(cmd.data.name, cmd);
  commandsStore.push(cmd.data.toJSON());
});
const rest = new REST().setToken(token);
(async () => {
  // update commands
  const data = await rest.put(
    Routes.applicationGuildCommands(bot.clientId, bot.guildId),
    { body: commandsStore }
  );
  console.log(`Successfully reloaded ${data.length} application (/) commands.`);

  await client.login(token);
  console.log(`${client.user.tag} is online..`);

  client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const command = client.commands.get(commandName);
    if (command) {
      command.execute(interaction);
    } else {
      interaction.reply("invalid command");
    }
  });
})();
