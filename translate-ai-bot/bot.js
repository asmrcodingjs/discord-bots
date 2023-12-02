const { Client, GatewayIntentBits, Collection } = require("discord.js");
const translate = require("./commands/translate/translate");
require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.commands = new Collection();

(async () => {
  await client.login(BOT_TOKEN);
  console.log(`${client.user.tag} is online...`);

  client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;

    const commandName = interaction.commandName;

    if (commandName === "translate") {
      translate.execute(interaction);
    } else interaction.reply("invalid cmd");
  });
})();
