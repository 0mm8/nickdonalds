const { ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const discord = require("discord.js");
let AuthDB = require(`../../database/AuthDB`)
const config = require("../../config.js")
module.exports = {
  name: "giveaway",
  description: "giveaway",
  //type: ApplicationCommandType.ChatInput,
  options: [
     {
          name: "duration",
          description: "duration",
          type: ApplicationCommandOptionType.Number,
       required: true,
      },
    {
          name: "winners",
          description: "winners",
          type: ApplicationCommandOptionType.Number,
       required: true,
      },
    {
          name: "prize",
          description: "prize",
          type: ApplicationCommandOptionType.String,
       required: true,
      },
      {
          name: "requirements",
          description: "requirements",
          type: ApplicationCommandOptionType.String,
       required: true,
      }
  ],

  
  run: async (client, interaction, args) => {
let requirements = interaction.options.getString(`requirements`);
    let prize = interaction.options.getString(`prize`);
    let winners = interaction.options.getNumber(`winners`);
    
        let duration = interaction.options.getNumber(`duration`);
 
 let embed1 = new discord.EmbedBuilder()
      .setTitle(`🎉 **Giveaway** for ${prize} 🎉`)
      .setDescription(`\n:gift: **WINNERS:** \`${winners}\`\n:tada: **TIMER**: \`${duration}h\`\n:gift: **PRIZE:** \`${prize}\`\n:tada: **HOSTED BY: ${interaction.user}**\n\n:link: __**Requirements:**__\n:link: **${requirements}**\n\nTo enter the giveaway click on the enter button.`)
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
      .setLabel("Enter")
      .setStyle(ButtonStyle.Link)
      .setURL(`${config.oauth_link}`)
          .setDisabled(false),
      );


    await interaction.reply(
                            {
      
      embeds: [embed1],
      components: [row]

    });
    
  },
};