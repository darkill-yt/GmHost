const Discord = require("discord.js")

module.exports = {

    owneronly: false,
    category: "",
    data: new Discord.SlashCommandBuilder()
    .setName("offres")
    .setDescription("Affiche les offres")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
    .setDMPermission(false),

    async run(bot, message, args, db) {

        const embed = new Discord.EmbedBuilder()
        .setTitle("GmHost")
        .setDescription("**🛒 • Découvrir nos offres**\nCliquez sur la catégorie de votre choix et découvrez les offres disponibles !")
        .setThumbnail("https://i.imgur.com/6gyyOn4.png")
        .setColor("#000000")

        const row = new Discord.ActionRowBuilder()
        .addComponents(new Discord.ButtonBuilder()
        .setLabel("Fivem (GTARP)")
        .setURL("https://www.gmhost.fr/store/fivem")
        .setStyle(Discord.ButtonStyle.Link))

        .addComponents(new Discord.ButtonBuilder()
        .setLabel("Garry's Mod")
        .setURL("https://www.gmhost.fr/store/gmod")
        .setStyle(Discord.ButtonStyle.Link))

        .addComponents(new Discord.ButtonBuilder()
        .setLabel("Bit Discord")
        .setURL("https://www.gmhost.fr/store/discord")
        .setStyle(Discord.ButtonStyle.Link))

        .addComponents(new Discord.ButtonBuilder()
        .setLabel("Serveur Dédié")
        .setURL("https://www.gmhost.fr/store/serveurs")
        .setStyle(Discord.ButtonStyle.Link))

        message.channel.send({embeds: [embed], components: [row]})
        return message.reply({content: "message envoyé avec succées!", ephemeral: true})

    }
}