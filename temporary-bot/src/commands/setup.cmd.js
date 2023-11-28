const { SlashCommandBuilder, ChannelType } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("setup temp voice channels")
    .addChannelOption((op) =>
      op
        .setName("category")
        .setDescription("select a category")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    )
    .addChannelOption((op) =>
      op
        .setName("voice")
        .setDescription("select a voice channel")
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    ),
  exec: (interaction) => {
    const category = interaction.options.getChannel("category");
    const voice = interaction.options.getChannel("voice");
    console.log(category.name, voice.name);
    interaction.client.channelsStore.set(
      `category:${interaction.guild.id}`,
      category.id
    );
    interaction.client.channelsStore.set(
      `voice:${interaction.guild.id}`,
      voice.id
    );

    interaction.reply({
      content: `success! 
> category: ${category.name} | ${category.id}
> voice: ${voice.name} | ${voice.id}
        `,
      //   ephemeral: true,
    });
  },
};
