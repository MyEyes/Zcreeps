accounting = require("accounting")
roles = require("roles")

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
                }
            }
        }
    }
}

module.exports = spawner