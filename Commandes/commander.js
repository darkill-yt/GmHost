const Discord = require("discord.js")

module.exports = {

    name: "commander",
    owneronly: false,
    category: "",
    data: new Discord.SlashCommandBuilder()
    .setName("commander")
    .setDescription("Passer une commande de bot discord personnalisé")
    .addSubcommandGroup(cmd =>
        cmd
            .setName("avec")
            .setDescription("Passer une commande de bot discord avec hebergement")
            .addSubcommand(cmd =>
                cmd
                .setName("hebergement")
                .setDescription("Passer une commande de bot discord personnalisé avec hebergement")
                .addStringOption(option => 
                    option
                        .setName("offre")
                        .setDescription("Quelle offre de développement souhaitez-vous?")
                        .setRequired(true))))
    .addSubcommandGroup(cmd =>
        cmd
            .setName("sans")
            .setDescription("Passer une commande de bot discord personnalisé sans hebergement")
            .addSubcommand(cmd => 
                cmd
                .setName("hebergement")
                .setDescription("Passer une commande de bot discord sans hebergement")
                .addStringOption(option => 
                    option
                        .setName("offre")
                        .setDescription("Quelle offre de développement souhaitez-vous?")
                        .setRequired(true)))),

    async run(bot, message, args, db) {

        return message.reply({content: "Commande désactivé!", ephemeral: true})

        try{
            
            const heberg = args.getSubcommandGroup(true)

            if(heberg === "avec") {


            }
            if(heberg === "sans") {}

        } catch (err) {bot.function.ErrorMessage(message)}
    }
}