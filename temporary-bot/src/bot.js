const {
  Client,
  GatewayIntentBits,
  Collection,
  ChannelType,
} = require("discord.js");
require("dotenv").config();

// commands
const setupCmd = require("./commands/setup.cmd");
const lockCmd = require("./commands/lock.cmd");
const unLockCmd = require("./commands/unLock.cmd");
const limitCmd = require("./commands/limit.cmd");
const nameCmd = require("./commands/name.cmd");
const inviteCmd = require("./commands/invite.cmd");

const TOKEN = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();
// client.store = new Collection();
client.channelsStore = new Collection(); //or use mongo ...

[setupCmd, lockCmd, unLockCmd, limitCmd, nameCmd, inviteCmd].map((cmd) => {
  client.commands.set(cmd.data.name, cmd);
});

(async () => {
  await client.login(TOKEN);

  console.log(`${client.user.tag} is online!`);

  client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;

    const cmd = client.commands.get(commandName);
    // check
    if (cmd) {
      cmd.exec(interaction);
    } else {
      interaction.reply({
        content: "invalid command",
        ephemeral: true,
      });
    }
  });

  client.on("voiceStateUpdate", async (oldCh, newChannel) => {
    console.log(oldCh.channelId, newChannel.channelId);
    const tempLobbyId = client.channelsStore.get(`voice:${oldCh.guild.id}`);
    const tempCategoryId = client.channelsStore.get(
      `category:${oldCh.guild.id}`
    );
    if (oldCh.channelId && !newChannel.channelId) {
      // remove channel
      console.log("remove section");
      const channelId = oldCh.channelId;
      const hasTemp = client.channelsStore.get(
        `temp-v:${String(oldCh.channelId)}`
      );

      if (!hasTemp || hasTemp !== newChannel.member.id) return;

      console.log("has a temp voice ", oldCh.channel.members.size);
      if (oldCh.channel.deletable) {
        /// check members count
        // check permission
        // then delete
        await oldCh.channel.delete(`temp voice`);
      }

      return;
    }

    if (newChannel.channelId == tempLobbyId) {
      // create channel
      await oldCh.guild.channels.fetch();
      console.log("store", tempCategoryId);
      const category = await oldCh.guild.channels.cache.get(tempCategoryId);
      if (!category) return console.log("invalid category");

      const temChannel = await oldCh.guild.channels.create({
        name: `${newChannel.member.user.tag} | temp`,
        parent: category,
        type: ChannelType.GuildVoice,
      });
      await newChannel.member.voice.setChannel(temChannel);

      client.channelsStore.set(
        `temp-v:${String(temChannel.id)}`,
        oldCh.member.id
      );
    } else {
      console.log("invalid channel");
    }
  });
})();
