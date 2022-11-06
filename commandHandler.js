const { REST } = require("@discordjs/rest")
const { Routes } = require("discord.js")
const fs = require("fs")


let commands = [];

module.exports = {
    execute: async (client) => {
        const rest = new REST({version: 10}).setToken(process.env.TOKEN)
        const filesInCommandsFolder = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
        for(const e of filesInCommandsFolder) {
            const command = require(`./commands/${e}`)
            commands = [...commands, command.data.toJSON()]
        }
        (async () => {
            try {
                await rest.put(Routes.applicationCommands(client.user.id), {
                    body: commands
                })
                console.log('Ładujemy komendy z buta tak o')
            } catch(e) {
                console.error(e)
            }
        })();
    }
}