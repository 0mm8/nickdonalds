
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const db = require(`quick.db`);
const fs = require("fs");
const Users = require("../../database/DB.js");
const discord = require("discord.js");
let AuthDB = require(`../../database/AuthDB`)
module.exports = {
  name: "help",
  description: "Shows help menu",
  options: null,

  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction, args) => {
    await interaction.deferReply()


    let embed1 = new discord.EmbedBuilder()
      .setTitle(`Help Menu`)
      .setColor(`#2f3136`)
      .setThumbnail()
      .setDescription(`> /pull - Pull specific amount of users with the given serverid using JSON database.\n\n> /info - Shows info of pulling processes\n\n> /refresh - Refresh the authorized users in mongo\n\n> /jsonrefresh - Refresh the authorized users in json\n\n> /clean - Clean the authorized users\n\n> /join - Pull specific amount of users with the given serverid using Mongo database.\n\n> /online - Pull specific amount of online users with the given serverid.\n\n> /restart - Restarts the bot.\n\n> /ping - Checks bot's ping.\n\n> /users - Shows users count on the database.\n\n> /links - Get bot links. \n\n > Invite bot - [here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`)


    await interaction.followUp({
      embeds: [embed1]
    })

  },
};