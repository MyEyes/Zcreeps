spawner = 
{
    spawn: function(spawner)
    {
        if(spawner.room.energyAvailable >= 300)
        {
            spawner.spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], Game.time, {memory:{home: spawner.room.name, type: "worker"}})
        }
    }
}

module.exports = spawner