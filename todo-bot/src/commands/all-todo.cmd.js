const { SlashCommandBuilder } = require("discord.js");
const Todos = require("../store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("all-todos")
    .setDescription("Get all todos")
    .addStringOption((op) =>
      op
        .setName("todo-id")
        .setRequired(false)
        .setDescription("or get a todo with unique id")
    ),
  execute: (interaction) => {
    const todoId = interaction.options.getString("todo-id");
    if (todoId) {
      const todo = Todos.find((t) => t.id == todoId);

      if (!todo) return interaction.reply("todo not found!");

      interaction.reply(`
- id: \`${todo.id}\`
- name: ${todo.name}
- status: ${todo.status ? "todo" : "done"}      
      `);
    } else {
      const todosContent =
        Todos.map(
          (t) => `
- id: \`${t.id}\`
- name: ${t.name}
- status: ${t.status ? "todo" : "done"}      
      `
        ).join("\n") || "empty list";
      interaction.reply(todosContent);
    }
  },
};
