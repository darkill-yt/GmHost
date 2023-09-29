const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord.js")

module.exports = async bot => {

    let ContextMenus = [];

    bot.ContextMenus.forEach(async command => {

        await ContextMenus.push(command.date)
    })

    return ContextMenus;
}