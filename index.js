const fs = require('fs');
const Config = require('./config.json')
const {Client, Intents, Collection} = require("discord.js")
const Enmap = require('enmap')

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS]})

client.commands = new Collection()
const commantFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commantFiles) {
    const command = require(`./commands/${file}`)

    client.commands.set(command.data.name, command)
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

client.settings = new Enmap({
    name: 'settings',
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
    autoEnsure: {
        adminRole: '',
        syncedRoles: {}
    }
})

client.login(Config.token)