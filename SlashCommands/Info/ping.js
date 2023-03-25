
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const discord = require("discord.js");
let e = require(`../../database/AuthDB`)
module.exports = {
  name: "ping",
  description: "Bot's connection to everything.",
  options: null,

  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction, args) => {

    let start = Date.now();

    let embed1 = new discord.EmbedBuilder()
      .setDescription("Looks like the bot is slow.")


    await interaction.reply({
      embeds: [embed1]
    })
    let end = Date.now();
    const getDatabasePing = async () => {
      const Now = Date.now();
      await e.find().then(entrys => { })
      return `${~~(Date.now() - Now)}`;
    };

    const DbPing = await getDatabasePing();

    let embed = new discord.EmbedBuilder()
      .setTitle("Ping!")
      .addFields([
        { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms` },
        { name: 'Message Latency', value: `${end - start}ms` },
        { name: 'Database Ping', value: `${DbPing}ms` },
      ])


    interaction.editReply({ embeds: [embed] }).catch((e) => interaction.channel.send(e));
  },
};