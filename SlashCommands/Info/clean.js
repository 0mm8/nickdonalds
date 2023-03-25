
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const discord = require("discord.js");
let AuthDB = require(`../../database/AuthDB`)
module.exports = {
  name: "clean",
  description: "Cleans dead auths and leaves fresh auths.",
  type: ApplicationCommandType.ChatInput,



  run: async (client, interaction, args) => {
    client.clean(interaction)

  },
};