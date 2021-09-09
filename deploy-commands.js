const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { clientId, token } = require('./config.json')
const {SlashCommandBuilder} = require("@discordjs/builders")
const fs = require('fs')

const commands = []

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        const res = await rest.put(
            Routes.applicationGuildCommands(clientId, "296958915235676161"),
            { body: commands },
        )

        console.log('Successfully registered application commands.', res)
    } catch (error) {
        console.error(error)
    }
})()
