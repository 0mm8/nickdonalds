const userwl = require('../../models/whitelist');
const { ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const discord = require("discord.js");
let AuthDB = require(`../../database/AuthDB`)
const { redirect_uri } = require("../../config.js");
const config = require("../../config.js");

module.exports = {
  name: "wl",
  description: "stuff",
  options: null,

  type: ApplicationCommandType.ChatInput,
  options: [
      {
          name: "choose",
    
          description: "wl choices",
          type: ApplicationCommandOptionType.String,
       required: true,
        choices: [
        {
        name: 'Add',
        value: 'add',
      },
           {
        name: 'Remove',
        value: 'remove',
      },
           {
        name: 'List',
        value: 'list',
      },
      
       ] 
      },
  {
          name: "user",
          description: "user to wl",
          type: ApplicationCommandOptionType.User,
       required: false,
      },
  ],
  run: async (client, interaction, args) => {

let dhcamount = interaction.options.getString(`choose`);
     if (!config.Owners.includes(interaction.user.id)){
       return interaction.reply("you have to be owner to wl bozo")
     }

    if (dhcamount === 'add') {
      const user = interaction.options.getUser("user");
   
      let users = await userwl.findOne({ userId: user.id })
      if(!users) {
        await userwl.create({ userId: user.id })
        interaction.reply(`**${client.users.cache.get(user.id).tag}** has been added to the whitelist`)
      } else {
        interaction.reply(`${client.users.cache.get(user.id).tag} is already wl !`)
      }
    } else if(dhcamount === 'remove') {
     const user = interaction.options.getUser("user");
    
      let users = await userwl.findOne({ userId: user.id })
      if (!users) return interaction.reply(`${client.users.cache.get(user.id).tag} is not in the whitelist`)
      
      await userwl.deleteOne({ userId: user.id })
      return interaction.reply(`The user ${client.users.cache.get(user.id).tag} is removed from wl`)
      
    } else if(dhcamount === 'list') {
      const total = await userwl.find()

      var content = ""
      const blrank = total.filter((data) => data.userId).sort((a, b) => b.data - a.data);
      
      for(let i in blrank) {
        if(blrank[i].data === null) blrank[i].data = 0;
        content +=  `\`${blrank.indexOf(blrank[i]) + 1}\` ${client.users.cache.get(blrank[i].userId).tag} (\`${client.users.cache.get(blrank[i].userId).id}\`)\n`
      }

      interaction.reply({embeds: [{
        title: "users whitelist",
        description: `${content}`,
    }]})
    }
  }
}