const { Routes, REST } = require("discord.js");
require("dotenv").config();
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const rest = new REST().setToken(token);

// commands
const setupCmd = require("./commands/setup.cmd");
const lockCmd = require("./commands/lock.cmd");
const unLockCmd = require("./commands/unLock.cmd");
const limitCmd = require("./commands/limit.cmd");
const nameCmd = require("./commands/name.cmd");
const inviteCmd = require("./commands/invite.cmd");

const commands = [
  setupCmd.data.toJSON(),
  lockCmd.data.toJSON(),
  unLockCmd.data.toJSON(),
  limitCmd.data.toJSON(),
  nameCmd.data.toJSON(),
  inviteCmd.data.toJSON(),
];

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
