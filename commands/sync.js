const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sync')
        .setDescription('Syncs the first role to the second role.')
        .addRoleOption(option => option.setName('sub-role').setDescription('The role that triggers a sync.').setRequired(true))
        .addRoleOption(option => option.setName('main-role').setDescription('The role that is given on sync.').setRequired(true)),
    async execute(interaction) {
        const adminRole = interaction.client.settings.get(interaction.guild.id, 'adminRole')
        if (!(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES) || interaction.member.roles.cache.has(role => role.name === adminRole))) {
            await interaction.reply(`You have insufficient permissions to use this command.`)
            return;
        }


        const mainRole = interaction.options.getRole('main-role')
        const subRole = interaction.options.getRole('sub-role')

        if (interaction.client.settings.has(interaction.guild.id, `syncedRoles.${mainRole.id}`)) {
            interaction.client.settings.push(interaction.guild.id, subRole.id, `syncedRoles.${mainRole.id}`)
        } else {
            interaction.client.settings.set(interaction.guild.id, [subRole.id], `syncedRoles.${mainRole.id}`)
        }

        await interaction.reply(`${mainRole} will now be granted whenever a user is added to the ${subRole} role.`)
    }
}