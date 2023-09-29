const Discord = require("discord.js")

module.exports = {

    name: "commande",
    owneronly: false,
    category: "",
    data: new Discord.SlashCommandBuilder()
    .setName("commande")
    .setDescription("Passer une commande de bot discord personnalisé")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
    .setDMPermission(false),

    async run(bot, message, args, db) {

        return message.reply({content: "Commande désactivé!", ephemeral: true})

        const embed = new Discord.EmbedBuilder()
        .setTitle("Passer une commande de bot discord personnalisé")
        .setDescription("Pour passer une commande de bot discord personnalisé, veuillez cliquer sur le boutton ci-dessous.")
        .setColor("Aqua")

        const row = new Discord.ActionRowBuilder()
        .addComponents(new Discord.ButtonBuilder()
        .setCustomId("commander")
        .setLabel("commander")
        .setStyle(Discord.ButtonStyle.Success))

        message.channel.send({embeds: [embed], components: [row]})
        return message.reply({content: "message envoyé avec succées!", ephemeral: true})

    }
}