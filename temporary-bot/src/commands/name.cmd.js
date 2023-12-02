const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("name")
    .setDescription("📝 change channel name")
    .addStringOption((op) =>
      op
        .setName("name")
        .setDescription("enter your new name")
        // .setMinValue(1)
        // .setMaxValue(200)
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

    const name = interaction.options.getString("name");

    await voice.channel.edit({
      name: name,
    });
    interaction.reply(`📝 updated channel name to ${name}`);
  },
};
