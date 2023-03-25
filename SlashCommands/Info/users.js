
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const db = require(`quick.db`);
const fs = require("fs");
const Users = require("../../database/DB.js");
const discord = require("discord.js");
let AuthDB = require(`../../database/AuthDB`)
module.exports = {
  name: "users",
  description: "...",
  options: null,

  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction, args) => {
await interaction.deferReply()
let count = 0;
    let uwus = interaction.guild.id
    let guild = client.guilds.cache.get("1077313075457314897");
let database = await AuthDB.findOne({ id: `1`});
    
let jsonInput = fs.readFileSync('./authDB.json') // Read Database

  if (!jsonInput) return console.log("NO DATABASE FOUND")

  let jsonData = JSON.parse(jsonInput);
let dba = jsonData.data;
  //let on = 0;
let GUILD_MEMBERS = await guild.members.fetch({ withPresences: true,})
let cc = 0; 
 let array = [];
await GUILD_MEMBERS.filter(async (online) => {
   if(online.presence?.status === "idle" || online.presence?.status === "online" || online.presence?.status === "dnd") {
     let f = dba.find((x) => x.user_id === online.id);
     if(!f || !f.access_token) return;
     let obj = {
       user_id: online.id,
       access_token: f.access_token, 
     }
array.push(obj)

     
   }
 });
    
   
 let on = 0;

    let embed1 = new discord.EmbedBuilder()
      .setTitle(`Total Users`)
      .setColor(0x7cade2)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`**Current DB**: ${await client.tokenCount()}\n**Alt DB**: ${dba.length}\n**Last refresh**: ${db.get(`refresh${client.user.id}`)}\n**Current users online**: ${array.length}\n\`Note\`: use /join to use the current DB and use /pull for the alt DB which has the more users.`)


    await interaction.followUp({
      embeds: [embed1]
    })

  },
};