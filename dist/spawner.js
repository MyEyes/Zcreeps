accounting = require("accounting")
spawner = 
{
    spawn: function(spawner)
    {
        if(spawner.room.energyAvailable >= 300 && Object.keys(Game.creeps).length<10)
        {
            spawner.spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], Game.time, {memory:{home: spawner.room.name, role: "worker"}})
            accounting.addCreepToRole(spawner.room.name, "worker")
        }
    }
}

module.exports = spawner