const { SlashCommandBuilder} = require('@discordjs/builders')
const { MessageEmbed, Permissions} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('synced-roles')
        .setDescription('Lists currently synced roles.'),
    async execute(interaction) {
        const adminRole = interaction.client.settings.get(interaction.guild.id, 'adminRole')
        if (!(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES) || interaction.member.roles.cache.has(role => role.name === adminRole))) {
            await interaction.reply(`You have insufficient permissions to use this command.`)
            return;
        }

        const syncedRoles = interaction.client.settings.get(interaction.guild.id, `syncedRoles`)

        const myEmbed = new MessageEmbed()
            .setTitle("Synced Roles")

        for (const mainRole in syncedRoles) {
            const myMainRole = interaction.guild.roles.cache.get(mainRole)

            const mySubRoles = []

            for (const subRole in syncedRoles[mainRole]) {
                const mySubRole = interaction.guild.roles.cache.get(syncedRoles[mainRole][subRole])
                mySubRoles.push(mySubRole)
            }

            myEmbed.addField(myMainRole.name, mySubRoles.join(', '))
        }

        await interaction.reply({ embeds: [myEmbed] })
    }
}