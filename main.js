const Discord = require("discord.js")
const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({intents})
const loadCommandes = require("./loaders/loadCommands")
const loadEvents = require("./loaders/loadEvents")
const loadContextMenu = require("./loaders/loadContextMenu")
const config = require("./config")
const process = require("node:process")
const logs = require("./logs")

bot.web = new Discord.WebhookClient({ url: 'https://discord.com/api/webhooks/1138400422172840037/AJYgFVrKK_GyLbBiXLAyLrk0CUNJLs-dnSJRU6FQ_1Dxz6lZpSKgA13E-mdg5ua4PF-i' });
//logs(bot)

const em = new Discord.EmbedBuilder()
.setTitle("Démarrage du bot")
.setDescription(`Le bot est en train de démarrer...`)
.setColor("#49ff00")

bot.web.send({embeds: [em]})

bot.commands = new Discord.Collection()
bot.ContextMenus = new Discord.Collection()
bot.cooldown = new Discord.Collection()
bot.lock = new Discord.Collection()

bot.function = {
    createID: require("./Fonctions/createID"),
    generateCaptcha: require("./Fonctions/generateCaptcha"),
    ErrorMessage: require("./Fonctions/ErrorMessage")
}
bot.color = "#00BDFF"

bot.login(config.token)
loadCommandes(bot)
loadEvents(bot)
loadContextMenu(bot)

/*process.on("unhandledRejection", (reason, promise) => {
    console.log(`unhandledRejection à ${promise}, raison: ${reason}`)
})

process.on("uncaughtException", (err, origin) => {
    console.log(err, origin)
})
nsole.log(err, origin)
})
process.on("uncaughtExceptionMonitor", (err, origin) => {
    co
*/