const fetch = require('node-fetch');

module.exports = {
	name: 'joinall',
	category: 'Utility',
	botOwner: true,
	run: async (client, message, args, users) => {
		let guildID = message.guild.id;
		let members = users.data.length;
		let startAt = 0;

		let error = 0;
		let success = 0;
		let server_limit = 0;
		let already_here = 0;
		let invalid_access = 0;
let progress = 0;
		async function addToGuild(accessToken, guildID, user_id) {
			const response = await fetch(`https://discord.com/api/v10/guilds/${guildID}/members/${user_id}`, {
				method: 'PUT',
				body: JSON.stringify({
					"access_token": accessToken
				}),
				headers: { 'Authorization': `Bot ${client.token}`, 'Content-Type': 'application/json' }
			});
			if(response.status == 204) {
				already_here++;
				return;
			}
			const data = await response.json();

			if(data.code == 30001) {
				server_limit++
			}

			if(data.code == 50025) {
				invalid_access++
			}

			if(data.user) {
				success++
			} else {
				error++
			}

			return data;
		}

		for (const arg of args) {
			if (arg.length > 10) {
				guildID = arg;
			}

			if (arg.length < 10 && !arg.startsWith('-')) {
				members = arg;
			}

			if (arg.startsWith('-')) {
				startAt = arg.slice(1);
        progress += parseInt(startAt);
			}
		}

		const guild = client.guilds.cache.get(guildID);
		if (!guild) return client.reply(message, 'error', 'Serveur invalide');
		if (isNaN(members)) return client.reply(message, 'error', 'Nombre invalide');
		if (isNaN(startAt)) return client.reply(message, 'error', 'Nombre invalide');

		let joinMembers = users.data.slice(startAt);
		let count = 0;

		const editMsg = await message.channel.send({ content: `<:check:1035952821289369705> **Join en cours \`\`${progress}/${users.data.length}\`\`**`, embeds: [
			{
				title: guild.name,
				color: client.color.default,
				thumbnail: {
					url: guild.iconURL({ dynamic: true, format: 'png', size: 4096 }) || client.settings.icon
				},
				description: `<:check:1035952821289369705> Succès : \`\`${success}\`\`\n<:check:1035952821289369705> Présent : \`\`${already_here}\`\`\n<:65:1037813388056739900> Erreur : \`\`${error}\`\`\n<:65:1037813388056739900>  Limite serveurs : \`\`${server_limit}\`\``
			}
		] });

		const inter = setInterval(() => {
			editMsg.edit({ content: `<:check:1035952821289369705> **Join en cours \`\`${progress}/${users.data.length}\`\`**`, embeds: [
				{
					title: guild.name,
					color: client.color.default,
					thumbnail: {
						url: guild.iconURL({ dynamic: true, format: 'png', size: 4096 }) || client.settings.icon
					},
					description: `<:check:1035952821289369705> Succès : \`\`${success}\`\`\n<:check:1035952821289369705> Présent : \`\`${already_here}\`\`\n<:65:1037813388056739900> Erreur : \`\`${error}\`\`\n<:65:1037813388056739900>  Limite serveurs : \`\`${server_limit}\`\``
				}
			] });
			
			client.update(guildID, { progress: progress })
		}, 15000);

		for (const user of joinMembers) {
			addToGuild(user.access_token, guildID, user.user_id);
			count++;
			if(count > members) break;
			await new Promise((resolve) => setTimeout(resolve, 1000));
		};

		clearInterval(inter);

		message.channel.send({ content: `**Joinall terminé**`, embeds: [
			{
				title: guild.name,
				color: client.color.green,
				thumbnail: {
					url: guild.iconURL({ dynamic: true, format: 'png', size: 4096 }) || client.settings.icon
				},
				description: `<:check:1035952821289369705> Succès : \`\`${success}\`\`\n<:check:1035952821289369705> Présent : \`\`${already_here}\`\`\n<:65:1037813388056739900> Erreur : \`\`${error}\`\`\n<:65:1037813388056739900> Limite serveurs : \`\`${server_limit}\`\``
			}
		] });


	}
}