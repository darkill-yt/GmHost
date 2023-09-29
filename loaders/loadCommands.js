const fs = require("fs")

module.exports = async bot => {

    fs.readdirSync("./commandes").filter(f => f.endsWith(".js")).forEach(async file => {

        let command = require(`../Commandes/${file}`)
        console.log(command)
        if(!command.data.name || typeof command.data.name !== "string") throw new TypeError(`La commande ${file.slice(0, file.length -3)} n'a pas de nom!`)
        bot.commands.set(command.data.name, command)
        console.log(`[commande] Commande ${file} chargée avec succès!`)
    })
}