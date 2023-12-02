const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("translate bot with OpenAI")
    .addStringOption((op) =>
      op.setName("text").setDescription("enter your text").setRequired(true)
    )
    .addStringOption((op) =>
      op.setName("to").setDescription("lang").setRequired(true)
    ),
  execute: async function (interaction) {
    const text = interaction.options.getString("text");
    const to = interaction.options.getString("to");

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: `please translate to ${to}` },
        { role: "user", content: text },
      ],
      model: "gpt-3.5-turbo",
    });
    const { content } = chatCompletion.choices[0].message;

    interaction.reply(`**${content}**`);
  },
};
