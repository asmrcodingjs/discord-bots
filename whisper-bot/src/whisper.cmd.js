const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("whisper")
    .setDescription("send a whisper message")
    .addStringOption((op) =>
      op.setName("content").setDescription("your content").setRequired(true)
    )
    .addBooleanOption((op) =>
      op
        .setName("secret")
        .setDescription("send anonymous message, true = 'Yes' false = 'No'")
        .setRequired(true)
    )
    .addUserOption((op) =>
      op.setName("target").setDescription("user target").setRequired(true)
    ),
  exec: function (interaction) {
    const user = interaction.options.getUser("target");
    const content = interaction.options.getString("content");
    const isSecret = interaction.options.getBoolean("secret");

    interaction.reply({ content: "successfully", ephemeral: true });
    console.log(user.id, content, isSecret);

    interaction.client.messages.set(interaction.id, content);

    const messageForTarget = `${user.tag}, you have a secret message ${
      isSecret ? "" : `from ${interaction.user.tag}`
    }`;

    const button = new ButtonBuilder()
      .setCustomId(`show:${user.id}:${interaction.id}`)
      .setLabel("show me")
      .setEmoji("👁️")
      .setStyle(ButtonStyle.Primary);

    const component = new ActionRowBuilder().addComponents(button);

    interaction.channel.send({
      content: messageForTarget,
      components: [component],
    });
  },
};
