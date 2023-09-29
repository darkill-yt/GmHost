const Discord = require("discord.js")
const loadDatabase = require("../loaders/loadDatabase")
const loadSlashCommands = require("../loaders/loadSlashCommands")
const createContextMenu = require("../loaders/CreateContextMenu")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord.js")

module.exports = async bot => {

    bot.db = await loadDatabase()
    bot.db.connect(function (err)  {

        if(err) {
            console.log("\n\n################################################################\n#                                                              #\n#   [ERREUR] Impossible de se connecter  à la base de donné!   #\n#                                                              #\n################################################################\n\n")
            process.exit(1)
        }
        else console.log("[DB] Base de données connecté avec succés!")
    })

    let s = await loadSlashCommands(bot)
    let c = await createContextMenu(bot)
    let cmd = s.concat(c)

    const rest = new REST({version: "10"}).setToken(bot.token)

    await rest.put(Routes.applicationCommands(bot.user.id), {body: cmd})
    console.log("[slash] les SlashsCommandes sont crées avec succès !")
    console.log("[ContextMenu] les ContextMenu sont crées avec succès !")

    console.log(`[bot] ${bot.user.tag} est bien en ligne sur ${bot.guilds.cache.size} serveurs`)

    db = bot.db
}