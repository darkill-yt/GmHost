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

    if(interaction.isButton()) {return}

    if(interaction.isStringSelectMenu()) {return}
}