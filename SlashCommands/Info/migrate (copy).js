const db = require(`quick.db`)
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { Prefix, Owners, client_id, redirect_uri, Token, oauth_link, Auth_log_channel, Error_log_channel, client_secret } = require("../../config.js");
const discord = require("discord.js");
let AuthDB = require(`../../database/AuthDB`)
module.exports = {
  name: "join",
  description: "oauth users with mongoose DB.",
  //type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "amount",
      description: "Amount of users to migrate",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
     {
      name: "minus",
      description: "Start from a certain amount.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "server-id",
      description: "Server to migrate users to.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
 
  ],


  run: async (client, interaction, args) => {

    let server = interaction.options.getString(`server-id`) || interaction.guild.id;
    let amount = interaction.options.getString(`amount`);

    let user = interaction.options.getUser(`user`);
    if (!client.guilds.cache.get(server)) return interaction.reply(`I failed to find a guild with that ID.`)
   // interaction.reply(`starting then...`)
    let count = 0;
    db.delete(`stop${server}`);
     let info = require(`../../database/e`)
    if(await info.findOne({ GuildID: server})) return interaction.reply(`-_- this server is already getting authed rn.`)
   await info.findOneAndUpdate({ GuildID: server, }, {
       Author: `<@${interaction.user.id}>`,
      Amount: amount,
      Started: ` <t:${parseInt(Date.now() / 1000)}:R>`,
      Progress: `[0 / ${amount}]`,
      Type: `Online`,
   }, { new: true, upsert: true }).catch((err) => console.log(err));  
    if(interaction.options.getString(`minus`)) {
       interaction.reply({ content: `<a:loading_blue:1037515163680653342> You have started adding **${amount}** of users and started from **${interaction.options.getString(`minus`)}** database line.`});
       return  client.manageJoin({
      amount: amount,
      minus: interaction.options.getString(`minus`) || `idk`,
      guild_id: server,
    }, interaction); 
    }
 interaction.reply({ ephemeral: true, content: `<a:loading_blue:1037515163680653342> You have started adding **${amount}** of users.` });
    client.manageJoin({
      amount: amount,
      minus: interaction.options.getString(`minus`) || `idk`,
      guild_id: server,
    }, interaction);
    
  },
};