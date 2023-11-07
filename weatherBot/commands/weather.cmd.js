const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

const weatherCmd = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("get weather a city")
    .addStringOption((op) =>
      op.setName("name").setDescription("city name").setRequired(true)
    ),
  execute: async (interaction) => {
    const cityName = interaction.options.getString("name");
    const { data } = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: cityName,
          appid: process.env.WeatherTOKEN,
          units: "metric",
        },
      }
    );

    const embed = new EmbedBuilder()
      .setTitle(`Weather in ${cityName}, ${data.sys.country}`)
      .addFields(
        {
          name: "Temperature",
          value: `${data.main.temp} C`,
        },
        {
          name: "Weather",
          value: `current: ${data.weather[0].main} | ${data.weather[0].description}`,
        },
        {
          name: "Wind Speed",
          value: data.wind.speed.toString(),
        },
        {
          name: "Humidity",
          value: `${data.main.humidity}%`,
        }
      )
      .setColor("Greyple")
      .setThumbnail(
        `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
      );

    interaction.reply({ embeds: [embed] });
  },
};
module.exports = weatherCmd;
