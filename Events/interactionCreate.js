const Discord = require("discord.js")
const ownerId = '817814016096206879';
const ms = require("ms")
const transcript = require("discord-html-transcripts")

module.exports = async (bot, interaction) => {

    const db = bot.db

    const cooldown = bot.cooldown

    if(interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

        let entry = interaction.options.getFocused()

/*            if(interaction.commandName === "help") {

            let choices = bot.commands.filter(cmd => cmd.name.includes(entry))
            await interaction.respond(entry === "" ? bot.commands.map(cmd => ({name: cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice.name, value: choice.name})))
        }
        
/*            if(interaction.commandName === "setcaptcha") {

            let choices = ["on", "off"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }*/
    }

    if(interaction.isContextMenuCommand()) {
        let menu = require(`../ContextMenu/${interaction.commandName}`) //envoie commande
        if (menu.owneronly && interaction.user.id != ownerId) return interaction.reply({content: "Seul le développeur du bot peut utiliser cette commande !", ephemeral: true }); //check owner
        // cooldown
        if (!cooldown.has(menu.name)) {
            cooldown.set(menu.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldown.get(menu.name);
        const cooldownAmount = (menu.cooldown || 10) * 1000;
        const cooldownTimestamp = (menu.cooldown ?? 3) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownTimestamp;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);                

                return interaction.reply({ content: `Veuillez patienter, vous êtes sur un temps de cooldown pour la commande \`${menu.name}\`. Vous pouvez l'utiliser à nouveau <t:${expiredTimestamp}:R>.`, ephemeral: true });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        return menu.run(bot, interaction, bot.db)
    }

    if(interaction.type === Discord.InteractionType.ApplicationCommand) {
        let command = require(`../Commandes/${interaction.commandName}`) //envoie commande
        if (command.owneronly && interaction.user.id != ownerId) return interaction.reply({content: "Seul le développeur du bot peut utiliser cette commande !", ephemeral: true }); //check owner
        // cooldown
        if (!cooldown.has(command.name)) {
            cooldown.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldown.get(command.name);
        const cooldownAmount = (command.cooldown || 10) * 1000;
        const cooldownTimestamp = (command.cooldown ?? 3) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownTimestamp;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);                

                return interaction.reply({ content: `Veuillez patienter, vous êtes sur un temps de cooldown pour la commande \`${command.name}\`. Vous pouvez l'utiliser à nouveau <t:${expiredTimestamp}:R>.`, ephemeral: true });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        command.run(bot, interaction, interaction.options, bot.db)
    }

    if(interaction.isButton()) {

        if(interaction.customId === "commander") {

            db.query(`SELECT * FROM commande WHERE user = '${interaction.user.id}'`, async (err, req) => {

                console.log(interaction.user.id)

                if(req.length > 0) { return interaction.reply({content: `Vous avez déjà une commande d'ouverte dans le salon <#${req[0].channel}>`, ephemeral: true})}

                const row = new Discord.ActionRowBuilder()
                .addComponents(new Discord.StringSelectMenuBuilder()
                .setCustomId("offre")
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder("choisissez une offre")
                .setOptions({label: "découverte", value: "découverte"}, {label: "basique", value: "basique"}, {label: "communauté", value: "communauté"}, {label: "total", value: "total"}, {label: "personnalisé", value: "personnalisé"}))

                return interaction.reply({content: "Quelle offre de développement souhaitez-vous ?", components: [row], ephemeral: true})

            })
        }
        if(interaction.customId === "cmd_com_no") {

            db.query(`SELECT * FROM commande WHERE user = '${interaction.user.id}'`, async (err, req) => {

                const devprice = {
                    découverte: "3€",
                    basique: "7€",
                    communauté: "12€",
                    total: "17€",
                    personnalisé: "à définir"
                }
                const hebergprice = {
                    premium: "5€",
                    basique: "3€"
                }

                const suppprice = {
                    découverte_em: "1€",
                    découverte_msg: "1€",
                    basique_em: "1€",
                    basique_msg: "2€",
                    communauté_em: "2€",
                    communauté_msg: "3€",
                    total_em: "3€",
                    total_msg: "3€",
                    personnalisé_em: "à définir",
                    personnalisé_msg: "à définir"
                }

                const supps = {
                    em: "message en embeds",
                    msg: "message aléatoire"
                }

                const total = req[0].offre === "personnalisé" ? "à définir" : parseInt(devprice[req[0].offre]) + parseInt(hebergprice[req[0].hebergement] || 0) + parseInt( req[0].supplement === null ? 0 : JSON.parse(req[0].supplement).map(s => suppprice[`${req[0].offre}_${s}`]).join(" + "))

                const cat = bot.channels.cache.get("1136972428887740436")

                const channel = await interaction.guild.channels.create({
                    name: `commande de ${interaction.user.username}`,
                    type: Discord.ChannelType.GuildText,
                    parent: cat,
                    reason: `Création du salon pour la commande de ${interaction.user.username}`,
                    permissionOverwrites: [
                        {
                        id: interaction.user.id,
                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages],
                        },
                    ],
                })

                const em = new Discord.EmbedBuilder()
                .setTitle(`commande de ${interaction.user.username}`)
                .setDescription(`__Récapitulatif de la commande:__\n\n> **offre de développement:** \`${req[0].offre} (${devprice[req[0].offre]})\`\n> **offre d'hébergement:** \`${req[0].hebergement} (${hebergprice[req[0].hebergement]})\`\n> **supplément(s):** ${req[0].supplement === null ? "\`Aucun\`" : `\n> ${JSON.parse(req[0].supplement).map(s => `- ${supps[s]}: \`${suppprice[`${req[0].offre}_${s}`]}\``).join("\n> ")}`}\n\n__total:__ ${total}`)
                .setColor("Aqua")
                .setTimestamp()
                
                channel.send({content: `${interaction.user} <@&923903108243935282>`, embeds: [em]})
                return interaction.update({content: `Merci de votre commande, vous pouvez continuer dans ce salon: ${channel}`, components: [], ephemeral: true})
            })
        }
    }

    if(interaction.isStringSelectMenu()) {

        if(interaction.customId === "offre") {

            const id = bot.function.createID(`cmd-${interaction.user.id}`)

            db.query(`INSERT INTO commande (user, id, offre) VALUES ('${interaction.user.id}', '${id}', '${interaction.values[0]}')`)

            const row = new Discord.ActionRowBuilder()
            .addComponents(new Discord.StringSelectMenuBuilder()
            .setCustomId(`supp`)
            .setMaxValues(2)
            .setMinValues(1)
            .setPlaceholder("choisissez vos suppléments")
            .setOptions({label: "message en embed", value: "em"}, {label: "message aléatoire", value: "msg"}, {label: "aucun", value: null}))

            return interaction.update({content: "Quel(s) supplément(s) souhaitez-vous ?", components: [row], ephemeral: true})
        }
        if(interaction.customId === "supp") {

            let v
            interaction.values.length > 1 && !interaction.values.includes(null) ? v = JSON.stringify(["em", "msg"]) : v = JSON.stringify([interaction.value[0]])

            db.query(`UPDATE commande SET supplement = '${v}' WHERE user = '${interaction.user.id}'`)

            const row = new Discord.ActionRowBuilder()
            .addComponents(new Discord.StringSelectMenuBuilder()
            .setCustomId(`heberg`)
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder("choisissez votre hébergement")
            .setOptions({label: "basique", value: "basique"}, {label: "premium", value: "premium"}, {label: "aucun", value: null}))

            return interaction.update({content: "Quelle hébergement souhaitez-vous ?", components: [row], ephemeral: true})
        }
        if(interaction.customId === "heberg") {

            db.query(`UPDATE commande SET hebergement = '${interaction.values[0]}' WHERE user = '${interaction.user.id}'`)

            const row = new Discord.ActionRowBuilder()
            .addComponents(new Discord.ButtonBuilder()
            .setCustomId('cmd_com_yes')
            .setLabel("oui")
            .setStyle(Discord.ButtonStyle.Success))
            .addComponents(new Discord.ButtonBuilder()
            .setCustomId('cmd_com_no')
            .setLabel("non")
            .setStyle(Discord.ButtonStyle.Danger))

            return interaction.update({content: "Souhaitez-vous ajouter un commentaire ?", components: [row], ephemeral: true})
        }
    }
}