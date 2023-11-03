const { SlashCommandBuilder } = require("discord.js");
const short = require("short-uuid");
const todos = require("../store");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-todo")
    .setDescription("create todo")
    .addStringOption((op) =>
      op.setName("name").setDescription("todo name").setRequired(true)
    )
    .addBooleanOption((op) =>
      op.setName("isdone").setDescription("todo status").setRequired(true)
    ),
  execute: (interaction) => {
    const name = interaction.options.getString("name");
    const isDone = interaction.options.getBoolean("isdone");
    const todoId = short.generate();

    todos.push({ name, status: isDone, id: todoId });
    interaction.reply(`todo added!`);
  },
};
