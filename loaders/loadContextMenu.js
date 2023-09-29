const fs = require("fs")

module.exports = async bot => {

    fs.readdirSync("./ContextMenu").filter(f => f.endsWith(".js")).forEach(async file => {

        let ContextMenu = require(`../ContextMenu/${file}`)
        if(!ContextMenu.name || typeof ContextMenu.name !== "string") throw new TypeError(`Le menu contextuelle ${file.slice(0, file.length -3)} n'a pas de nom!`)
        bot.ContextMenus.set(ContextMenu.name, ContextMenu)
        console.log(`[ContextMenu] Menu contextuelle ${file} chargée avec succès!`)
    })
}