const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("limit")
    .setDescription("👥 set limit for channel")
    .addNumberOption((op) =>
      op
        .setName("count")
        .setDescription("enter your count")
        .setMinValue(1)
        .setMaxValue(99)
        .setRequired(true)
    ),
  exec: async function (interaction) {
    const { voice, guild, id } = interaction.member;
    if (!voice.channel) return interaction.reply("please join to a temp voice");

    const hasTemp = interaction.client.channelsStore.get(
      `temp-v:${String(voice.channel.id)}`
    ); // return member id or null

    if (!hasTemp || hasTemp !== id)
      return interaction.reply("please join to a temp voice");

    const count = interaction.options.getNumber("count");

    await voice.channel.edit({
      userLimit: count,
    });
    interaction.reply(`👥 updated user limit to ${count}`);
  },
};
