
const { ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const discord = require("discord.js");
const config = require("../../config")
let AuthDB = require(`../../database/AuthDB`)
const { redirect_uri } = require("../../config.js");


module.exports = {
  name: "nsfw",
  description: "nsfw",
  options: null,

  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction, args) => {



    let embed1 = new discord.EmbedBuilder()
      .setTitle(`You can see channels after verification.`)
      .setDescription(`Click the 'Verify' button to confirm that you are 18 years or older and that you consent to viewing sexually content. 🔞`)
    .setImage('https://media.discordapp.net/attachments/895353212956192809/972072712950399036/4e25c6a7ac1fd3a31fd62594930536221cfd32f3.gif')
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Verify")
      .setStyle(ButtonStyle.Link)
        .setURL(`${config.oauth_link}`)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel("Silk")
      .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
      );


    await interaction.reply({
      embeds: [embed1],
      components: [row]

    });

  },
};