const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unsync')
        .setDescription('Unsyncs the sub-role from the main-role.')
        .addRoleOption(option => option.setName('sub-role').setDescription('The role that triggers a sync.').setRequired(true))
        .addRoleOption(option => option.setName('main-role').setDescription('The role that is given on sync.').setRequired(true)),
    async execute(interaction) {
        const mainRole = interaction.options.getRole('main-role')
        const subRole = interaction.options.getRole('sub-role')

        if (interaction.client.settings.has(interaction.guild.id, `syncedRoles.${mainRole.id}`)) {
            interaction.client.settings.remove(interaction.guild.id, subRole.id, `syncedRoles.${mainRole.id}`)
            await interaction.reply(`${mainRole} will no longer be granted whenever a user is added to the ${subRole} role.`)
        } else {
            interaction.client.settings.set(interaction.guild.id, [subRole.id], `syncedRoles.${mainRole.id}`)
            await interaction.reply(`${mainRole} isn't synced with any roles.`)
        }
    }
}