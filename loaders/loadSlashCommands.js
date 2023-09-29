const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord.js")

module.exports = async bot => {

    let commands = [];

    bot.commands.forEach(async command => {

        await commands.push(command.data)
    })

    return commands;
}