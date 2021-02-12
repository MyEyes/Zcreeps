const accounting = require("accounting")
roles = require("roles")
expansion = require("expansion")

spawner = 
{
    spawn: function(spawner)
    {
        for(roleName in roles)
        {
            roleInfo = accounting.getRoleInfo(spawner.room.name, roleName)
            if(roleInfo.needed > roleInfo.alive)
            {
                role = roles[roleName]
                if (spawner.spawnCreep(role.body(spawner.room), Game.time, {memory:{home: spawner.room.name, role: roleName}}) == OK)
                {
                    accounting.addCreepToRole(spawner.room.name, roleName)
                    return
                }
            }
        }
        surrogateRoom = expansion.getSurrogateRoom(spawner.room.name)
        for(roleName in roles)
        {
            roleInfo = accounting.getRoleInfo(surrogateRoom, roleName)
            if(roleInfo.needed > roleInfo.alive)
            {
                role = roles[roleName]
                if (spawner.spawnCreep(role.body(spawner.room), Game.time, {memory:{home: surrogateRoom, role: roleName}}) == OK)
                {
                    accounting.addCreepToRole(surrogateRoom, roleName)
                    return
                }
            }
        }
    }
}

module.exports = spawner