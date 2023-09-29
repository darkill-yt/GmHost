const Discord = require("discord.js")

module.exports = async (err, message) => {

    const em = new Discord.EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("Une erreur est survenue!")
    .setDescription(`Une erreur inattendu est survenue lors de l'execution de la commande.\nVous ne devriez jamais recevoir cette erreur. Si l'erreur perciste, merci de contacter le [serveur support](https://discord.gg/)\n\`\`\`\n${err}\n\`\`\``)

    return message.reply({embeds: [em], ephemeral: true});
}