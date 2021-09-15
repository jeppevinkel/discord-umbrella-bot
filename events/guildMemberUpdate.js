module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    execute(oldMember, newMember) {
        console.log(`[Bot] guildMemberUpdate triggered!`)

        let newRoles = newMember.roles.cache.map(r => r.id)
        let oldRoles = oldMember.roles.cache.map(r => r.id)
        let roleAdded = false;
        let roleRemoved = false;

        if (newRoles.length > oldRoles.length) {
            newRoles = newRoles.filter(nr => !oldRoles.includes(nr))
            roleAdded = true;
        } else if (newRoles.length < oldRoles.length) {
            oldRoles = oldRoles.filter(or => !newRoles.includes(or))
            roleRemoved = true;
        }

        if (roleAdded) {
            const syncedRoles = newMember.client.settings.get(newMember.guild.id, `syncedRoles`)
            let rolesToAdd = []

            for (const role of newRoles) {
                Object.keys(syncedRoles).forEach(key => {
                    let syncedRole = syncedRoles[key]
                    let shouldGet = syncedRole.includes(role)
                    // console.log("Should get:", shouldGet, ":", syncedRole, ":", role, ":", key)

                    if (shouldGet) rolesToAdd.push(key)
                })
            }

            // console.log(rolesToAdd)
            newMember.roles.add(rolesToAdd).catch(err => {
                console.error(`[Bot] ${err}`)
            })
        } else if (roleRemoved) {
            const syncedRoles = newMember.client.settings.get(newMember.guild.id, `syncedRoles`)
            let rolesToRemove = []

            for (const role of newRoles) {

                if (Object.keys(syncedRoles).includes(role) && !newRoles.some(r => syncedRoles[role].includes(r))) {
                    // console.log("Should remove:", true, ":", role, ":", syncedRoles[role], ":", role);
                    rolesToRemove.push(role)
                }
            }

            newMember.roles.remove(rolesToRemove).catch(err => {
                console.error(`[Bot] ${err}`)
            })
        }
    },
}