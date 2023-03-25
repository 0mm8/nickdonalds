const fs = require("fs");
const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');
let fetch = require("node-fetch");
const { Prefix, Owners, client_id, redirect_uri, Token, oauth_link, Auth_log_channel, Error_log_channel, client_secret } = require("../../config.js");
const db = require(`quick.db`)
const discord = require("discord.js");
let AuthDB = require(`../../database/AuthDB`)
let info = require(`../../database/e`)
module.exports = {
  name: "online",
  description: "....",
  //type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "amount",
      description: "Amount of users to migrate",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "server-id",
      description: "Server to migrate users to.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  {
      name: "minus",
      description: "Start from a certain amount.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],


  run: async (client, interaction, args) => {
    await interaction.deferReply()
        

let jsonInput = fs.readFileSync('./authDB.json') // Read Database

  if (!jsonInput) return console.log("NO DATABASE FOUND")

  let jsonData = JSON.parse(jsonInput);
let database = jsonData;
    let server = interaction.options.getString(`server-id`) || interaction.guild.id;
    let amount = interaction.options.getNumber(`amount`);

    let user = interaction.options.getUser(`user`);
    if (!client.guilds.cache.get(server)) return interaction.reply(`I failed to find a guild with that ID.`)
    interaction.followUp(`<a:Load:1045742152493314058> Starting from ${interaction.options.getString(`minus`) || `normal`} database line, and authing onlines [**${amount}**].`)
    let count = 0;
    let already = 0;
    let error = 0;
    let valid = 0;
    // alr = 0;
    let rt = 0;
    let success = 0;
    let invalid = 0;
    let limit = 0;
    let array = [];
    db.delete(`sentmsg${server}`);
    let time = Date.now();
    let guild = client.guilds.cache.get("1077313075457314897");

  let on = 0;
let GUILD_MEMBERS = await guild.members.fetch({ withPresences: true,})
let cc = 0; 
 
await GUILD_MEMBERS.filter(async (online) => {
   if(online.presence?.status === "idle" || online.presence?.status === "online" || online.presence?.status === "dnd") {
     let f = database.data.find((x) => x.user_id === online.id);
     if(!f || !f.access_token) return;
     let obj = {
       user_id: online.id,
       access_token: f.access_token, 
     }
array.push(obj)

     
   }
 });
    let arr = array;
    let minus = interaction.options.getString(`minus`);
        if(minus && minus.startsWith(`-`)) {
let minuss =   minus.slice(1)
 arr = array.slice(minuss); 



}
       db.delete(`stop${server}`)
   if(await info.findOne({ GuildID: server})) return interaction.followUp(`-_- this server is already getting authed rn.`)
   await info.findOneAndUpdate({ GuildID: server, }, {
       Author: `<@${interaction.user.id}>`,
      Amount: amount,
      Started: ` <t:${parseInt(Date.now() / 1000)}:R>`,
      Progress: `[0 / ${amount}]`,
      Type: `Online`,
   }, { new: true, upsert: true }).catch((err) => console.log(err));            let scd = arr.length * 0.08;
  scd = scd * 3360;
        let estim = msToTime(scd)
  function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000))
      , seconds = parseInt((duration / 1000) % 60)
      , minutes = parseInt((duration / (1000 * 60)) % 60)
      , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = hours;
    minutes = minutes;
    seconds = seconds;

    return hours + " hour(s) " + minutes + " minute(s) " + seconds + " second(s)"
  }
    //interaction.channel.send(`${array}`)
  async function addToGuild(accessToken, guildID, user_id) {

			const response = await fetch(`https://discord.com/api/v10/guilds/${guildID}/members/${user_id}`, {
				method: 'PUT',
				body: JSON.stringify({
					"access_token": accessToken
				}),
				headers: { 'Authorization': `Bot ${client.token}`, 'Content-Type': 'application/json' }
			});
			if(response.status == 204) {
			already++;
				return;
			}
			const data = await response.json();

			if(data.code == 30001) {
				limit++
			}

			if(data.code == 50025) {
				invalid++
			}

			if (data.user) {
				success++
			} else {
				error++
			}

			return data;
		}
  let pp = await interaction.channel.send(`online members progression, dont delete this.`);
  let int = setInterval(async() => {

   await info.findOneAndUpdate({ GuildID: server, }, {
       Author: `<@${interaction.user.id}>`,
      Amount: amount,
      //Started: ` <t:${parseInt(Date.now() / 1000)}:R>`,
      Progress: `[${cc} / ${amount}]`,
      Type: `Online`,
   }, { new: true, upsert: true }).catch((err) => console.log(err));    
  pp.edit({
      content: `<a:loading_blue:1037515163680653342> members adding  [${count}/${database.data.length}].`,
      embeds: [new EmbedBuilder()
                 .setAuthor({ name: `ETA: ${estim}`, iconURL: interaction.user?.displayAvatarURL({dynamic:true})})
                   .setColor(`Blurple`)
             .setThumbnail(guild?.iconURL({dynamic:true}))
               .setTitle(`Pulling in process..`)
                  .setDescription(`> **Pulled**: ${success}\n> **Already in server**: ${already}\n> **Max servers**: ${limit}\n> **Invalid access**: ${invalid}\n> **Error**: ${error}`)
          
               .setTimestamp()
               .setFooter({ text: `Developed by Conflict`, })
      ],
    })
  }, 10000)

  // if (ratelimit === true) array_of_members = ratelimit_arr;
  //var count = 0;
  let alr = 0;

//parseInt(obj.amount);
  

  for (const user of arr) {
   
addToGuild(user.access_token, server, user.user_id) 
      cc++
if(cc > amount) break;
         if(db.get(`stop${server}`)) break;
			await new Promise((resolve) => setTimeout(resolve, 2000));
  
  }
    clearInterval(int)
interaction.channel.send({ embeds: [
  new EmbedBuilder()
  .setColor(`Blurple`)
  .setTitle(`<:2197_blurple_check:1045742999088406600> Pull successfully finished`)
 .setDescription(`> **Pulled**: ${success}\n> **Already in server**: ${already}\n> **Max servers**: ${limit}\n> **Invalid access**: ${invalid}\n> **Error**: ${error}`)
          
]});
   
   await info.findOneAndRemove({ GuildID: server, }).catch((err) => console.log(err));    
     //interaction.channel.send(`${array.length}`)    

    
  },
};