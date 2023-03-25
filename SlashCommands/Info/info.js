
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
let fetch = require("node-fetch");
const { Prefix, Owners, client_id, redirect_uri, Token, oauth_link, Auth_log_channel, Error_log_channel, client_secret } = require("../../config.js");
const db = require(`quick.db`)
const discord = require("discord.js");
let AuthDB = require(`../../database/e`)
module.exports = {
  name: "info",
  description: "...",
  //type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "server-id",
      description: "..",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
 
  ],


  run: async (client, interaction, args) => {
    await interaction.deferReply()
      

    let server = interaction.options.getString(`server-id`);
    if(server) {
  const find = await AuthDB.find({ GuildID: server});
    if(!find) return interaction.followUp(`No data on that server has been found.`);
      let array = [];
      let guild = client.guilds.cache.get(server);
        find.forEach(async (data) => {
          
          array.push(`**${guild.name || `not in guild`}** (${guild.memberCount || `not in guild`} members)\n**Author**: ${data.Author}\n**Amount**: ${data.Amount}\n**Progress**: ${data.Progress}\n**Started at**: ${data.Started}\n**Bot**: ${data.Type}`)
        });
      let embed = new discord.EmbedBuilder()
        //    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setImage(guild?.bannerURL({ dynamic: true, size: 512 }) ?? null)
      .setTitle(`Currently ${array.length || `0`} sessions.`)
          .addFields({ name: `Guild Created`, value: `<t:${parseInt(guild.createdTimestamp / 1000)}:R>\n(<t:${parseInt(guild.createdTimestamp / 1000)}:D>)`})
 .addFields({ name: `Owner`, value: `${(await guild.fetchOwner()).user}\n(${(await guild.fetchOwner()).user.tag})`})
      .setDescription(`${array.join(`\n\n`) || `<:1956_Blurple_X:1045742986530664458> Im not authing this guild.`}`)
      .setColor(`Blurple`)
     .setThumbnail(guild?.iconURL({dynamic:true}))
	//.setDisabled(true);
      	const row = new discord.ActionRowBuilder()
			.addComponents(
				new discord.ButtonBuilder()
	.setCustomId('pause')
	.setLabel('Stop')
	.setStyle(discord.ButtonStyle.Danger)
			);
       interaction.followUp({ content: `Finding info on guild \`${server}\``, embeds: [embed], components: [row]});
      const filter = i => i.customId === 'pause' && i.user.id === interaction.user.id;

const collector = interaction.channel.createMessageComponentCollector({ filter, time: 55000 });
      collector.on('collect', async i => {

        db.set(`stop${server}`, Date.now())
        i.reply(`<:2197_blurple_check:1045742999088406600> Stopped authing on the guild \`${server}\`.`);
        
});


    }
        if(!server) {
  const find = await AuthDB.find();
    if(!find) return interaction.followUp(`No data was found -_-.`);
      let array = [];
           
        find.forEach(async (data) => {
         let guild = client.guilds.cache.get(data.GuildID);
          array.push(`**Server ID**: ${guild.id}\n**Server name**: **${guild.name || `not in guild`}** (${guild.memberCount || `not in guild`} members)\n**Author**: ${data.Author}\n**Amount**: ${data.Amount}\n**Progress**: ${data.Progress}\n**Started at**: ${data.Started}\n**Type**: ${data.Type}`)
        });
      let embed = new discord.EmbedBuilder()
      .setTitle(`Currently ${array.length || `0`} session(s).`)
        

      .setDescription(`${array.join(`\n\n`) || `<:1956_Blurple_X:1045742986530664458> `}`)
          .setColor(`Blurple`)
      return interaction.followUp({  embeds: [embed]})
    }
  },
};