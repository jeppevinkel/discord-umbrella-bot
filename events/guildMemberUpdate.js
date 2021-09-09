module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    execute(oldMember, newMember) {
        console.log(`[Bot] guildMemberUpdate triggered!`)

        let rolesToAdd = []
        for (const role of newMember.roles.cache) {
            if (newMember.client.settings.has(newMember.guild.id, `syncedRoles.${role[0]}`)) {
                rolesToAdd.push(newMember.client.settings.get(newMember.guild.id, `syncedRoles.${role[0]}`))

                console.log(`[Bot] Client should be given ${newMember.client.settings.get(newMember.guild.id, `syncedRoles.${role[0]}`)}`)
            }
        }

        newMember.roles.add(rolesToAdd).catch(err => {
            console.error(`[Bot] ${err}`)
        })
    },
}