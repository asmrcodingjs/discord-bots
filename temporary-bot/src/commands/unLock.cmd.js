const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("🔓 ulock channel"),
  exec: async function (interaction) {
    const { voice, guild, id } = interaction.member;
    if (!voice.channel) return interaction.reply("please join to a temp voice");

    const hasTemp = interaction.client.channelsStore.get(
      `temp-v:${String(voice.channel.id)}`
    ); // return member id or null

    if (!hasTemp || hasTemp !== id)
      return interaction.reply("please join to a temp voice");

    await voice.channel.permissionOverwrites.set([
      {
        id: guild.roles.everyone.id,
        allow: [PermissionFlagsBits.Connect],
      },
      {
        id,
        allow: [PermissionFlagsBits.Connect],
      },
    ]);
    interaction.reply("🔓 UnLocked");
  },
};
